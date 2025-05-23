# Script to get the public IP address using an external API

Write-Host "--------------------------------------------------"
Write-Host "Public IP Address Fetcher - $(Get-Date)"
Write-Host "--------------------------------------------------"

$ApiUrl = "https://ipinfo.io/json" # A common public IP API that returns JSON

Write-Host "Fetching public IP from $ApiUrl..."

try {
    # Invoke-RestMethod automatically parses JSON responses into PowerShell objects
    $Response = Invoke-RestMethod -Uri $ApiUrl -UseBasicParsing -ErrorAction Stop

    if ($Response -and $Response.ip) {
        Write-Host "OK: Public IP Address: $($Response.ip)"
        Write-Host "Hostname: $($Response.hostname)"
        Write-Host "City: $($Response.city)"
        Write-Host "Region: $($Response.region)"
        Write-Host "Country: $($Response.country)"
        Write-Host "Location: $($Response.loc)"
        Write-Host "Organization: $($Response.org)"
        Write-Host "Postal Code: $($Response.postal)"
        Write-Host "Timezone: $($Response.timezone)"
    } else {
        Write-Warning "Could not retrieve or parse IP address from the API response." # Write-Warning is fine
        Write-Host "Raw Response:"
        Write-Output $Response | ConvertTo-Json # Display raw response if parsing failed
    }
}
catch {
    Write-Error "Error fetching public IP: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Error "Status Code: $($_.Exception.Response.StatusCode)"
        Write-Error "Status Description: $($_.Exception.Response.StatusDescription)"
    }
}

Write-Host "--------------------------------------------------"
Write-Host "Fetch Complete."
Write-Host "--------------------------------------------------"