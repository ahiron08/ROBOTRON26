Add-Type -AssemblyName System.Drawing

# ============================================================
# White-matte -> alpha keying for the Hero scene plates.
#
# The source plates in public/ are 24bpp PNGs (no alpha) rendered on a
# pure-white matte. 24bpp cannot express transparency at all, so a plate
# like "new scene 12" (foreground rock + rover) is a fully OPAQUE
# 1920x1080 rectangle and hides every layer behind it.
#
# This script rewrites the AREAS THAT ARE PURE WHITE as fully transparent
# and leaves every other pixel completely untouched (same RGB bytes), so
# the original colour grading, contrast and lighting are preserved
# exactly. White is the background of these renders, so it is safe to key.
#
# Output is written next to the source as "<name> (alpha).png"; the
# originals are never modified.
# ============================================================

$outDir = 'public/scene'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$files = Get-ChildItem -LiteralPath 'public' -Filter 'new scene *.png' |
    Sort-Object { [int]($_.BaseName -replace '\D', '') }

foreach ($f in $files) {
    $src = New-Object System.Drawing.Bitmap($f.FullName)
    $w = [int]$src.Width
    $h = [int]$src.Height

    $dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $kept = 0
    $cleared = 0

    # Lock bits for speed: 12 x 2MP through GetPixel/SetPixel is far too slow.
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly,
        [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $stride = $srcData.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

    # In-place on the same buffer: set A=0 wherever the pixel is pure white.
    for ($y = 0; $y -lt $h; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $w; $x++) {
            $i = $row + ($x * 4)
            # B, G, R order in memory (little-endian ARGB)
            if ($bytes[$i] -eq 255 -and $bytes[$i + 1] -eq 255 -and $bytes[$i + 2] -eq 255) {
                $bytes[$i + 3] = 0
                $cleared++
            }
            else {
                $bytes[$i + 3] = 255
                $kept++
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $dstData.Scan0, $bytes.Length)

    $src.UnlockBits($srcData)
    $dst.UnlockBits($dstData)

    $outName = ($f.BaseName + ' (alpha).png')
    $outPath = Join-Path $outDir $outName
    $dst.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    "{0,-17} -> scene/{1,-24} {2}x{3}  kept={4,9}  keyed={5,9} ({6:P1})" -f `
        $f.Name, $outName, $w, $h, $kept, $cleared, ($cleared / ($kept + $cleared))

    $dst.Dispose()
    $src.Dispose()
}
