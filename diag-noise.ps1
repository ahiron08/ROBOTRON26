Add-Type -AssemblyName System.Drawing

# Diagnose the white-noise artefacts in the keyed plates.
# 1. Count OPAQUE pixels that are pure/near white (the stranded noise).
# 2. Measure how much of each plate is "barely off white" (the alpha ramp
#    the binary keyer collapsed to fully-opaque white).

$dir = Join-Path $PWD 'public\scene'
Get-ChildItem -LiteralPath $dir -Filter '*.png' | Sort-Object { [int]($_.BaseName -replace '\D', '') } | ForEach-Object {
    $bmp = New-Object System.Drawing.Bitmap($_.FullName)
    $w = $bmp.Width; $h = $bmp.Height
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $d = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $d.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($d.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($d); $bmp.Dispose()

    $noise = 0; $pureWhite = 0; $faint = 0; $opaque = 0; $total = 0
    for ($y = 0; $y -lt $h; $y += 2) {
        $row = $y * $stride
        for ($x = 0; $x -lt $w; $x += 2) {
            $i = $row + ($x * 4)
            $b = $bytes[$i]; $g = $bytes[$i + 1]; $r = $bytes[$i + 2]; $a = $bytes[$i + 3]
            $total++
            if ($a -gt 0) { $opaque++ }
            $min = [Math]::Min($r, [Math]::Min($g, $b))
            if ($min -ge 240) { $faint++ }
            if ($a -gt 200 -and $min -ge 245) { $noise++ }
            if ($a -gt 200 -and $r -eq 255 -and $g -eq 255 -and $b -eq 255) { $pureWhite++ }
        }
    }
    $bmp = $null
    $pn = [math]::Round(100 * $noise / $total, 2)
    $pw = [math]::Round(100 * $pureWhite / $total, 2)
    $pf = [math]::Round(100 * $faint / $total, 2)
    "layer {0,-3} opaque={1,6}  near-white+OPAQUE={2,6} ({3,5}%)  pure-white+OPAQUE={4,6} ({5,5}%)  pixels-in-240..254={6,7} ({7,5}%)" -f `
        ($_.BaseName -replace '\D', ''), $opaque, $noise, $pn, $pureWhite, $pw, $faint, $pf
}
