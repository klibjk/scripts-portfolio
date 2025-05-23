# Script to gather basic system information and health metrics

Write-Host "--------------------------------------------------"
Write-Host "System Health Check - $(Get-Date)"
Write-Host "--------------------------------------------------"

# --- OS Information ---
Write-Host "`n--- Operating System ---"
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsArchitecture

# --- Hostname & Uptime ---
Write-Host "`n--- Hostname & Uptime ---"
Write-Host "Hostname: $env:COMPUTERNAME"
$Uptime = (Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
Write-Host "Uptime: $($Uptime.Days) days, $($Uptime.Hours) hours, $($Uptime.Minutes) minutes"

# --- CPU Usage ---
Write-Host "`n--- CPU Usage (Top 5 processes) ---"
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | Format-Table Name, CPU, Id -AutoSize

# --- Memory Usage ---
Write-Host "`n--- Memory Usage ---"
$Memory = Get-CimInstance Win32_OperatingSystem
$TotalMemory = [math]::Round($Memory.TotalVisibleMemorySize / 1MB, 2)
$FreeMemory = [math]::Round($Memory.FreePhysicalMemory / 1MB, 2)
$UsedMemory = $TotalMemory - $FreeMemory
$PercentFree = [math]::Round(($FreeMemory / $TotalMemory) * 100, 2)
Write-Host "Total Memory: $($TotalMemory) GB"
Write-Host "Used Memory: $($UsedMemory) GB"
Write-Host "Free Memory: $($FreeMemory) GB ($($PercentFree)%)"

# --- Disk Usage ---
Write-Host "`n--- Disk Usage (C: Drive) ---"
Get-PSDrive C | Select-Object Name, @{Name="Size (GB)";Expression={[math]::Round($_.Used / 1GB,2)}}, @{Name="FreeSpace (GB)";Expression={[math]::Round($_.Free / 1GB,2)}}, @{Name="PercentFree";Expression={[math]::Round(($_.Free / ($_.Used + $_.Free)) * 100,2)}} | Format-Table -AutoSize

# --- Network Information ---
Write-Host "`n--- Network Configuration (Primary Interface) ---"
Get-NetAdapter -Physical | Where-Object {$_.Status -eq "Up"} | Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer | Format-Table -AutoSize

# --- Check for recent system errors (Event Log - System, last 5 errors) ---
Write-Host "`n--- Recent System Errors (Last 5 from System Event Log) ---"
Get-WinEvent -LogName System -MaxEvents 50 | Where-Object {$_.LevelDisplayName -eq "Error"} | Select-Object -First 5 TimeCreated, ID, Message | Format-Table -AutoSize

Write-Host "`n--------------------------------------------------"
Write-Host "Health Check Complete."
Write-Host "--------------------------------------------------"