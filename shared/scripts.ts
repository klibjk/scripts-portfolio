import { InsertScript, InsertScriptVersion } from "./schema";

// Initial seed script data for the database
export const seedScripts: {
  script: InsertScript;
  tags: string[];
  highlights: string[];
  version: Omit<InsertScriptVersion, "scriptId">;
}[] = [
  {
    script: {
      key: "SH-01",
      language: "Bash",
      title: "System-Health-Check.sh",
      summary: "Gathers essential system information and health metrics for quick diagnostics on Linux/macOS.",
      code: `#!/bin/bash

# Script to gather basic system information and health metrics

echo "--------------------------------------------------"
echo "System Health Check - $(date)"
echo "--------------------------------------------------"

# --- OS Information ---
echo -e "\\n--- Operating System ---"
if [[ "$(uname)" == "Linux" ]]; then
    cat /etc/os-release | grep PRETTY_NAME
elif [[ "$(uname)" == "Darwin" ]]; then
    sw_vers
fi

# --- Hostname & Uptime ---
echo -e "\\n--- Hostname & Uptime ---"
hostname
uptime

# --- CPU Usage ---
echo -e "\\n--- CPU Usage (Top 5 processes) ---"
ps -eo pcpu,pid,user,args --sort=-pcpu | head -n 6

# --- Memory Usage ---
echo -e "\\n--- Memory Usage ---"
if [[ "$(uname)" == "Linux" ]]; then
    free -h
elif [[ "$(uname)" == "Darwin" ]]; then
    vm_stat | perl -ne '/page size of (\\d+)/ and $size=$1; /Pages free:\\s+(\\d+)/ and printf "Free RAM: %.2f MiB\\n", $1 * $size / 1048576'
    top -l 1 | head -n 10 | grep PhysMem
fi

# --- Disk Usage ---
echo -e "\\n--- Disk Usage (Root Filesystem) ---"
df -h /

# --- Network Information ---
echo -e "\\n--- Network Configuration (Primary Interface) ---"
if [[ "$(uname)" == "Linux" ]]; then
    ip addr show $(ip route | grep default | awk '{print $5}' | head -n1)
elif [[ "$(uname)" == "Darwin" ]]; then
    ifconfig $(route get default | grep interface | awk '{print $2}')
fi

# --- Check for recent system errors (Linux example) ---
if [[ "$(uname)" == "Linux" ]]; then
    echo -e "\\n--- Recent System Errors (last 10 lines of dmesg with 'error' or 'fail') ---"
    dmesg | grep -iE 'error|fail' | tail -n 10
fi

echo -e "\\n--------------------------------------------------"
echo "Health Check Complete."
echo "--------------------------------------------------"`,
      readme: `# Documentation: System Information & Health Check Script

This script is designed to provide a quick overview of a system's current status, gathering essential hardware and software information along with basic health metrics. It's a foundational tool for IT professionals and Managed Service Providers (MSPs) to perform initial assessments or routine checks on endpoints.

## System Information & Health Check - Bash Version

### Purpose:
This Bash script gathers key system information and performs basic health checks on Linux and macOS systems. It is designed to provide a quick snapshot of the machine's configuration and current operational status, useful for troubleshooting, inventory, and routine monitoring.

### Operating System Compatibility:
- Linux (tested on Debian/Ubuntu-based systems, RHEL/CentOS-based systems)
- macOS

### Prerequisites:
- Standard Unix/Linux command-line utilities (e.g., uname, hostname, uptime, ps, free, df, ip, ss, dmesg, sw_vers, vm_stat, ifconfig, route, perl). Most are pre-installed on target systems.
- perl is used for a specific memory calculation on macOS; if not available, that specific metric might not display.

### Usage:
1. Save the script to a file (e.g., system_health_check.sh).
2. Make the script executable: chmod +x system_health_check.sh
3. Run the script: ./system_health_check.sh

Some commands for specific information (like dmesg for recent errors on Linux) might produce more detailed output if run with sudo ./system_health_check.sh, but the script is generally designed to run as a standard user.

### Output:
The script outputs formatted information to the console, including:

- Operating System details (name, version)
- Hostname and system uptime
- Top 5 CPU-consuming processes
- Memory usage (total, used, free)
- Disk usage for the root filesystem
- Network configuration for the primary interface
- (Linux only) Recent system errors from dmesg (if any)

### Example Snippet of Output (will vary by system):

\`\`\`
--------------------------------------------------
System Health Check - Thu May 22 13:58:20 EDT 2025
--------------------------------------------------

--- Operating System ---
PRETTY_NAME="Ubuntu 22.04.3 LTS"

--- Hostname & Uptime ---
my-linux-server
 13:58:20 up 10 days,  2:17,  1 user,  load average: 0.05, 0.15, 0.10

--- CPU Usage (Top 5 processes) ---
%CPU   PID USER     COMMAND
 0.5  1234 myuser   /usr/bin/some_process -arg
 0.2   876 root     /usr/sbin/another_daemon
...

--- Memory Usage ---
              total        used        free      shared  buff/cache   available
Mem:          7.7Gi       1.2Gi       5.8Gi        12Mi       800Mi       6.3Gi
Swap:         2.0Gi          0B       2.0Gi
...
\`\`\`

### Notes:
- The accuracy and availability of some metrics (like specific memory stats on macOS or network interface detection) can vary slightly between OS versions and configurations.
- This script provides a baseline; it can be extended to gather more specific information (e.g., specific application versions, running services, detailed hardware inventory).
- For continuous monitoring, this script could be scheduled as a cron job, with output redirected to a file or a monitoring system.`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Linux (All distributions), macOS",
      requiredModules: "Standard Unix utilities, perl (for macOS memory calculation)",
      dependencies: "None",
      license: "MIT",
    },
    tags: ["Linux", "macOS", "System Health", "Monitoring", "Diagnostics"],
    highlights: ["Cross-Platform", "Comprehensive Output", "Easy to Use"],
    version: {
      version: "1.0.0",
      changes: "Initial release with cross-platform support for Linux and macOS",
    }
  },
  {
    script: {
      key: "PS-01",
      language: "PowerShell",
      title: "System-Health-Check.ps1",
      summary: "PowerShell script to gather system information and health metrics for Windows diagnostics.",
      code: `# Script to gather basic system information and health metrics

Write-Host "--------------------------------------------------"
Write-Host "System Health Check - $(Get-Date)"
Write-Host "--------------------------------------------------"

# --- OS Information ---
Write-Host "\`n--- Operating System ---"
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsArchitecture

# --- Hostname & Uptime ---
Write-Host "\`n--- Hostname & Uptime ---"
Write-Host "Hostname: $env:COMPUTERNAME"
$Uptime = (Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime
Write-Host "Uptime: $($Uptime.Days) days, $($Uptime.Hours) hours, $($Uptime.Minutes) minutes"

# --- CPU Usage ---
Write-Host "\`n--- CPU Usage (Top 5 processes) ---"
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | Format-Table Name, CPU, Id -AutoSize

# --- Memory Usage ---
Write-Host "\`n--- Memory Usage ---"
$Memory = Get-CimInstance Win32_OperatingSystem
$TotalMemory = [math]::Round($Memory.TotalVisibleMemorySize / 1MB, 2)
$FreeMemory = [math]::Round($Memory.FreePhysicalMemory / 1MB, 2)
$UsedMemory = $TotalMemory - $FreeMemory
$PercentFree = [math]::Round(($FreeMemory / $TotalMemory) * 100, 2)
Write-Host "Total Memory: $($TotalMemory) GB"
Write-Host "Used Memory: $($UsedMemory) GB"
Write-Host "Free Memory: $($FreeMemory) GB ($($PercentFree)%)"

# --- Disk Usage ---
Write-Host "\`n--- Disk Usage (C: Drive) ---"
Get-PSDrive C | Select-Object Name, @{Name="Size (GB)";Expression={[math]::Round($_.Used / 1GB,2)}}, @{Name="FreeSpace (GB)";Expression={[math]::Round($_.Free / 1GB,2)}}, @{Name="PercentFree";Expression={[math]::Round(($_.Free / ($_.Used + $_.Free)) * 100,2)}} | Format-Table -AutoSize

# --- Network Information ---
Write-Host "\`n--- Network Configuration (Primary Interface) ---"
Get-NetAdapter -Physical | Where-Object {$_.Status -eq "Up"} | Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer | Format-Table -AutoSize

# --- Check for recent system errors (Event Log - System, last 5 errors) ---
Write-Host "\`n--- Recent System Errors (Last 5 from System Event Log) ---"
Get-WinEvent -LogName System -MaxEvents 50 | Where-Object {$_.LevelDisplayName -eq "Error"} | Select-Object -First 5 TimeCreated, ID, Message | Format-Table -AutoSize


Write-Host "\`n--------------------------------------------------"
Write-Host "Health Check Complete."
Write-Host "--------------------------------------------------"`,
      readme: `# Documentation: System Information & Health Check Script

This script is designed to provide a quick overview of a system's current status, gathering essential hardware and software information along with basic health metrics. It's a foundational tool for IT professionals and system administrators to perform initial assessments or routine checks on endpoints.

## System Information & Health Check - PowerShell Version

### Purpose:
This PowerShell script gathers key system information and performs basic health checks on Windows systems. It is designed to provide a quick snapshot of the machine's configuration and current operational status, useful for troubleshooting, inventory, and routine monitoring.

### Operating System Compatibility:
- Windows 10, Windows 11
- Windows Server 2016 and newer

### Prerequisites:
- PowerShell 5.1 or higher (comes pre-installed on Windows 10 and newer)
- Administrative privileges for certain metrics (Event Log access, detailed system information)

### Usage:
1. Save the script to a file (e.g., System-Health-Check.ps1).
2. Run the script in a PowerShell console:
   - Regular execution: .\System-Health-Check.ps1
   - For full access to all system information: Run PowerShell as Administrator, then execute the script

### Output:
The script outputs formatted information to the console, including:

- Operating System details (Windows version and architecture)
- Hostname and system uptime
- Top 5 CPU-consuming processes
- Memory usage statistics (total, used, free)
- Disk usage for the C: drive
- Network configuration for connected adapters
- Recent system errors from the Windows Event Log

### Example Snippet of Output (will vary by system):

\`\`\`
--------------------------------------------------
System Health Check - 05/22/2025 14:10:22
--------------------------------------------------

--- Operating System ---
WindowsProductName       WindowsVersion OsArchitecture
------------------       -------------- --------------
Windows 10 Pro           21H2           64-bit        

--- Hostname & Uptime ---
Hostname: WORKSTATION-PC
Uptime: 5 days, 8 hours, 42 minutes

--- CPU Usage (Top 5 processes) ---
Name                        CPU    Id
----                        ---    --
Chrome                     243.12  4572
Teams                      147.85  2680
Code                        80.33  1520
Outlook                     42.76  3450
Explorer                    12.55  1640

--- Memory Usage ---
Total Memory: 15.94 GB
Used Memory: 8.56 GB
Free Memory: 7.38 GB (46.3%)

--- Disk Usage (C: Drive) ---
Name Size (GB) FreeSpace (GB) PercentFree
---- --------- -------------- -----------
C       465.76         128.35       27.56
\`\`\`

### Notes:
- Some commands might require administrative privileges to show complete information
- The script is non-invasive and only collects information without making any system changes
- This script provides a baseline; it can be extended to gather more specific information (e.g., specific application versions, services, detailed hardware inventory)
- For continuous monitoring, this script could be scheduled as a task to run periodically`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Windows 10, Windows 11, Windows Server 2016+",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "PowerShell 5.1+",
      license: "MIT",
    },
    tags: ["Windows", "PowerShell", "System Health", "Monitoring", "Diagnostics"],
    highlights: ["Comprehensive Output", "Windows Event Log", "WMI/CIM Integration"],
    version: {
      version: "1.0.0",
      changes: "Initial release with support for Windows systems",
    }
  }
];