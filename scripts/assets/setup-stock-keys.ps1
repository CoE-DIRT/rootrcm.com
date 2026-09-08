$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$envFile = Join-Path $repoRoot '.env.local'

function Read-PlainSecret([string]$Prompt) {
    $secure = Read-Host $Prompt -AsSecureString
    return ([System.Net.NetworkCredential]::new('', $secure)).Password
}

function Read-OptionalSecret([string]$Prompt) {
    $secure = Read-Host "$Prompt (optional; press Enter to skip)" -AsSecureString
    return ([System.Net.NetworkCredential]::new('', $secure)).Password
}

function Upsert-EnvValue([string[]]$Lines, [string]$Key, [string]$Value) {
    $found = $false
    [string[]]$updated = @(
        foreach ($line in $Lines) {
            if ($line -match "^$([regex]::Escape($Key))=") {
                $found = $true
                "$Key=$Value"
            }
            else {
                $line
            }
        }
    )
    if (-not $found) {
        $updated += "$Key=$Value"
    }
    return ,$updated
}

Write-Host "ROOT stock-provider local setup" -ForegroundColor Cyan
Write-Host "Secrets will be written only to .env.local, which is gitignored." -ForegroundColor DarkGray
Write-Host "Do not paste PHI, payer data, production credentials, or unrelated secrets here." -ForegroundColor DarkGray
Write-Host ""

$pexels = Read-PlainSecret 'Pexels API key'
$pixabay = Read-PlainSecret 'Pixabay API key'
$unsplash = Read-OptionalSecret 'Unsplash access key'

if ([string]::IsNullOrWhiteSpace($pexels) -and [string]::IsNullOrWhiteSpace($pixabay)) {
    throw 'At least one local-download provider key (Pexels or Pixabay) is required.'
}

$lines = @()
if (Test-Path $envFile) {
    $lines = @(Get-Content $envFile)
}

$lines = Upsert-EnvValue $lines 'PEXELS_API_KEY' $pexels
$lines = Upsert-EnvValue $lines 'PIXABAY_API_KEY' $pixabay
if (-not [string]::IsNullOrWhiteSpace($unsplash)) {
    $lines = Upsert-EnvValue $lines 'UNSPLASH_ACCESS_KEY' $unsplash
}

Set-Content -Path $envFile -Value $lines -Encoding UTF8

Write-Host ""
Write-Host "Saved local provider configuration to $envFile" -ForegroundColor Green
Write-Host "Checking provider readiness..." -ForegroundColor Cyan
Push-Location $repoRoot
try {
    npm run assets:providers
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Next example:" -ForegroundColor Cyan
Write-Host 'npm run assets:search -- --query="healthcare revenue analytics operations" --orientation=landscape --limit=12'
