Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$OrgRoot = Split-Path $Repo -Parent
$Control = Join-Path $OrgRoot '_LOCAL-CONTROL'
$ToolRoot = Join-Path $Control 'oss-tools'
$Registry = Join-Path $Repo 'tools\oss\toolchain.json'

if (-not (Test-Path -LiteralPath $Registry)) {
    throw "OSS toolchain registry not found: $Registry"
}

New-Item -ItemType Directory -Force -Path $ToolRoot | Out-Null
$toolchain = Get-Content -LiteralPath $Registry -Raw | ConvertFrom-Json

Write-Host "=== ROOT OSS TOOLCHAIN BOOTSTRAP ===" -ForegroundColor Cyan
Write-Host "Repo:      $Repo"
Write-Host "Tool root: $ToolRoot"

foreach ($tool in $toolchain.repositories) {
    $safeName = ($tool.name -replace '[^A-Za-z0-9._-]', '-').ToLowerInvariant()
    $dest = Join-Path $ToolRoot $safeName

    Write-Host "`n--- $($tool.name) ---" -ForegroundColor Yellow
    Write-Host "Mode:    $($tool.mode)"
    Write-Host "License: $($tool.license)"
    Write-Host "Use:     $($tool.active_use)"

    if (-not (Test-Path -LiteralPath $dest)) {
        & git clone --depth 1 $tool.repo $dest
        if ($LASTEXITCODE -ne 0) { throw "Clone failed for $($tool.name)" }
    }
    else {
        & git -C $dest fetch --depth 1 origin
        if ($LASTEXITCODE -ne 0) { throw "Fetch failed for $($tool.name)" }

        $defaultRef = (& git -C $dest symbolic-ref refs/remotes/origin/HEAD 2>$null)
        if ($LASTEXITCODE -eq 0 -and $defaultRef) {
            $defaultBranch = ($defaultRef -replace '^refs/remotes/origin/', '').Trim()
            & git -C $dest checkout $defaultBranch | Out-Null
            & git -C $dest reset --hard "origin/$defaultBranch" | Out-Null
        }
    }

    $sha = (& git -C $dest rev-parse HEAD).Trim()
    Write-Host "[OK] $($tool.name) @ $sha" -ForegroundColor Green
}

$stamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'
$proof = Join-Path $ToolRoot 'ROOT-OSS-TOOLCHAIN-READY.txt'
@"
ROOT OSS TOOLCHAIN READY
Generated: $stamp
Registry: $Registry

The repositories in this directory are local tooling/reference clones.
They are intentionally outside the production website repository and are not shipped to the public website unless a later implementation deliberately incorporates a permissively licensed library/package.

Recordly is AGPL-3.0 and must remain an external local production tool unless separately reviewed.
Tailwind remains disabled in ROOT production rendering.
No PHI is permitted in these tools.
"@ | Set-Content -LiteralPath $proof -Encoding UTF8

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " ROOT OSS TOOLCHAIN READY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host $ToolRoot
