[CmdletBinding()]
param(
    [switch]$Local
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$SqlPath = Join-Path $PSScriptRoot "product-metrics.sql"
$Wrangler = Join-Path $RepoRoot "node_modules\.bin\wrangler.cmd"
$Target = if ($Local) { "--local" } else { "--remote" }
$Sql = (Get-Content $SqlPath) -join " "

$Output = & $Wrangler d1 execute kata-prompt $Target --json --command $Sql
if ($LASTEXITCODE -ne 0) {
    throw "D1 metrics query failed with exit code $LASTEXITCODE"
}

$Payload = ($Output -join [Environment]::NewLine) | ConvertFrom-Json
$Row = $Payload[0].results[0]
if (-not $Row) {
    throw "D1 metrics query returned no result"
}

function Get-Percent {
    param(
        [int]$Numerator,
        [int]$Denominator
    )

    if ($Denominator -eq 0) { return 0.0 }
    return [Math]::Round(($Numerator / $Denominator) * 100, 1)
}

$Users = [int]$Row.users
$Selected = [int]$Row.selected
$Filled = [int]$Row.filled
$Copied = [int]$Row.copied

[ordered]@{
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    service = "kata-prompt"
    environment = if ($Local) { "local" } else { "production" }
    funnel = [ordered]@{
        users = $Users
        selected = $Selected
        filled = $Filled
        copied = $Copied
        saved = [int]$Row.saved
        exported = [int]$Row.exported
        returned = [int]$Row.returned
        users_7d = [int]$Row.users_7d
        copied_7d = [int]$Row.copied_7d
    }
    rates = [ordered]@{
        selection_percent = Get-Percent $Selected $Users
        fill_percent = Get-Percent $Filled $Selected
        completion_percent = Get-Percent $Copied $Filled
        save_percent = Get-Percent ([int]$Row.saved) $Copied
        return_percent = Get-Percent ([int]$Row.returned) $Copied
    }
} | ConvertTo-Json -Depth 4
