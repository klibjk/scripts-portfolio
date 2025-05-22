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
      readme: `# System Information & Health Check Script Documentation

This script provides a quick overview of system status, gathering essential hardware and software information along with basic health metrics.

## Purpose
Gathers key system information and performs basic health checks on Linux and macOS systems for troubleshooting, inventory, and routine monitoring.

## Compatibility
- Linux (Debian/Ubuntu, RHEL/CentOS)
- macOS

## Usage
1. Save as system_health_check.sh
2. Make executable: chmod +x system_health_check.sh
3. Run: ./system_health_check.sh

## Output
- Operating System details
- Hostname and uptime
- Top 5 CPU processes
- Memory usage
- Disk usage
- Network configuration
- Recent system errors (Linux only)`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Linux (All distributions), macOS",
      requiredModules: "Standard Unix utilities",
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

# --- Check for recent system errors ---
Write-Host "\`n--- Recent System Errors (Last 5 from System Event Log) ---"
Get-WinEvent -LogName System -MaxEvents 50 | Where-Object {$_.LevelDisplayName -eq "Error"} | Select-Object -First 5 TimeCreated, ID, Message | Format-Table -AutoSize

Write-Host "\`n--------------------------------------------------"
Write-Host "Health Check Complete."
Write-Host "--------------------------------------------------"`,
      readme: `# System Information & Health Check Script Documentation

PowerShell script for gathering system information and health metrics on Windows systems.

## Purpose
Provides a quick snapshot of Windows machine configuration and operational status for troubleshooting and monitoring.

## Compatibility
- Windows 10, Windows 11
- Windows Server 2016+

## Usage
1. Save as System-Health-Check.ps1
2. Run in PowerShell: .\\System-Health-Check.ps1
3. Run as Administrator for full access

## Output
- Operating System details
- Hostname and uptime
- Top 5 CPU processes
- Memory usage statistics
- Disk usage for C: drive
- Network configuration
- Recent system errors from Event Log`,
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
  },
  {
    script: {
      key: "SH-02",
      language: "Bash",
      title: "Security-Baseline-Check.sh",
      summary: "Checks basic security configurations on Linux/macOS systems for compliance with security best practices.",
      code: `#!/bin/bash

# Script to check some basic security baseline settings

echo "--------------------------------------------------"
echo "Security Baseline Check - $(date)"
echo "--------------------------------------------------"

# --- Check if UFW (Uncomplicated Firewall) is active (Linux specific) ---
if [[ "$(uname)" == "Linux" ]] && command -v ufw &> /dev/null; then
    echo -e "\\n--- Firewall (UFW) Status ---"
    ufw_status=$(sudo ufw status | head -n 1)
    if [[ "$ufw_status" == "Status: active" ]]; then
        echo "OK: UFW is active."
    else
        echo "WARNING: UFW is inactive. Consider enabling it: sudo ufw enable"
    fi
elif [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\\n--- Firewall (pf) Status ---"
    pf_status=$(sudo pfctl -s info | grep "Status:" | awk '{print $2}')
    if [[ "$pf_status" == "Enabled" ]]; then
        echo "OK: macOS Packet Filter (pf) is enabled."
    else
        echo "WARNING: macOS Packet Filter (pf) is disabled."
    fi
else
    echo -e "\\n--- Firewall Status ---"
    echo "INFO: Firewall check skipped (unsupported OS or tool not found)."
fi

# --- Check for listening SSH port ---
echo -e "\\n--- SSH Port Status ---"
if ss -tulnp | grep ':22' | grep -q 'LISTEN'; then
    echo "OK: SSH daemon appears to be listening on port 22."
elif nc -z localhost 22; then
     echo "OK: SSH daemon appears to be listening on port 22."
else
    echo "INFO: SSH daemon not listening on port 22, or port is firewalled."
fi

# --- Check for passwordless sudo ---
echo -e "\\n--- Passwordless Sudo Check ---"
if sudo -nl | grep -q '(ALL) NOPASSWD: ALL'; then
    echo "WARNING: Found user(s) with passwordless sudo access."
else
    echo "OK: No global passwordless sudo found (basic check)."
fi

# --- macOS Specific: Gatekeeper Status ---
if [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\\n--- macOS Gatekeeper Status ---"
    gatekeeper_status=$(spctl --status)
    if [[ "$gatekeeper_status" == "assessments enabled" ]]; then
        echo "OK: Gatekeeper is enabled."
    else
        echo "WARNING: Gatekeeper is disabled."
    fi
fi

# --- macOS Specific: FileVault Status ---
if [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\\n--- macOS FileVault Status ---"
    filevault_status=$(fdesetup status)
    if [[ "$filevault_status" == "FileVault is On."* ]]; then
        echo "OK: FileVault is On."
    else
        echo "WARNING: FileVault is Off. Consider enabling for full disk encryption."
    fi
fi

echo -e "\\n--------------------------------------------------"
echo "Security Baseline Check Complete. Review findings."
echo "--------------------------------------------------"`,
      readme: `# Security Baseline Checker Script Documentation

Verifies common security configurations on Linux and macOS systems to ensure adherence to basic security best practices.

## Purpose
Performs checks for several common security baseline settings to help administrators identify potential security configuration issues.

## Compatibility
- Linux (Debian/Ubuntu, RHEL/CentOS)
- macOS

## Usage
1. Save as security_baseline_check.sh
2. Make executable: chmod +x security_baseline_check.sh
3. Run with sudo: sudo ./security_baseline_check.sh

## Checks Performed
- Firewall status (UFW on Linux, pf on macOS)
- SSH port listening status
- Passwordless sudo configurations
- macOS Gatekeeper status
- macOS FileVault encryption status`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Linux (All distributions), macOS",
      requiredModules: "Standard Unix utilities, ufw (Linux), pfctl (macOS)",
      dependencies: "sudo access for comprehensive checks",
      license: "MIT",
    },
    tags: ["Security", "Baseline", "Firewall", "SSH", "Linux", "macOS"],
    highlights: ["Security Audit", "Cross-Platform", "Configurable Checks"],
    version: {
      version: "1.0.0",
      changes: "Initial release with security baseline checks for Linux and macOS",
    }
  },
  {
    script: {
      key: "PS-02",
      language: "PowerShell",
      title: "Security-Baseline-Check.ps1",
      summary: "PowerShell script to verify Windows security configurations and compliance with security best practices.",
      code: `# Script to check some basic Windows security baseline settings

Write-Host "--------------------------------------------------"
Write-Host "Security Baseline Check - $(Get-Date)"
Write-Host "--------------------------------------------------"

# --- Check Windows Firewall Status ---
Write-Host "\`n--- Windows Firewall Status ---"
$FirewallProfiles = Get-NetFirewallProfile -Profile Domain, Private, Public | Select-Object Name, Enabled
foreach ($Profile in $FirewallProfiles) {
    if ($Profile.Enabled) {
        Write-Host "OK: $($Profile.Name) Firewall Profile is Enabled."
    } else {
        Write-Host "WARNING: $($Profile.Name) Firewall Profile is Disabled."
    }
}

# --- Check if UAC is enabled ---
Write-Host "\`n--- User Account Control (UAC) Status ---"
$UACEnabled = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "EnableLUA").EnableLUA
if ($UACEnabled -eq 1) {
    Write-Host "OK: User Account Control (UAC) is Enabled."
} else {
    Write-Host "WARNING: User Account Control (UAC) is Disabled."
}

# --- Check for Automatic Updates ---
Write-Host "\`n--- Automatic Updates Status ---"
try {
    $AUService = Get-Service wuauserv
    if ($AUService.Status -eq "Running") {
        Write-Host "OK: Windows Update service is running."
    } else {
        Write-Host "WARNING: Windows Update service is not running."
    }
} catch {
    Write-Host "INFO: Could not retrieve Windows Update service status."
}

# --- Check for Antivirus Status ---
Write-Host "\`n--- Antivirus Status ---"
try {
    $AntivirusProduct = Get-CimInstance -Namespace root\\SecurityCenter2 -ClassName AntiVirusProduct
    if ($AntivirusProduct) {
        foreach ($AV in $AntivirusProduct) {
            Write-Host "Product: $($AV.displayName)"
            if ($AV.productState -eq "266240" -or $AV.productState -eq "397312") {
                 Write-Host "Status: OK - Enabled and Up to Date."
            } else {
                 Write-Host "Status: WARNING - May require attention."
            }
        }
    } else {
        Write-Host "WARNING: No Antivirus product detected."
    }
} catch {
    Write-Host "INFO: Could not query Antivirus status."
}

# --- Check BitLocker Status ---
Write-Host "\`n--- BitLocker Status (OS Drive) ---"
try {
    $OSVolume = Get-BitLockerVolume -MountPoint $env:SystemDrive
    if ($OSVolume.ProtectionStatus -eq "On") {
        Write-Host "OK: BitLocker is ON for the OS Drive ($($env:SystemDrive))."
    } else {
        Write-Host "WARNING: BitLocker is OFF for the OS Drive ($($env:SystemDrive))."
    }
} catch {
    Write-Host "INFO: Could not retrieve BitLocker status."
}

Write-Host "\`n--------------------------------------------------"
Write-Host "Security Baseline Check Complete. Review findings."
Write-Host "--------------------------------------------------"`,
      readme: `# Security Baseline Checker Script Documentation

PowerShell script to verify Windows security configurations and compliance with security best practices.

## Purpose
Checks several common security baseline settings on Windows systems to verify essential security configurations are in place.

## Compatibility
- Windows 10, Windows 11
- Windows Server 2016, 2019, 2022

## Usage
1. Save as Security-BaselineCheck.ps1
2. Open PowerShell as Administrator
3. Run: .\\Security-BaselineCheck.ps1

## Checks Performed
- Windows Firewall status for all profiles
- User Account Control (UAC) status
- Automatic Updates configuration
- Antivirus product status
- BitLocker Drive Encryption status`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Windows 10, Windows 11, Windows Server 2016+",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "PowerShell 5.1+, Administrator privileges recommended",
      license: "MIT",
    },
    tags: ["Security", "Windows", "Firewall", "UAC", "BitLocker", "Antivirus"],
    highlights: ["Security Audit", "WMI Integration", "Comprehensive Checks"],
    version: {
      version: "1.0.0",
      changes: "Initial release with Windows security baseline checks",
    }
  },
  {
    script: {
      key: "SH-03",
      language: "Bash",
      title: "Failed-Login-Monitor.sh",
      summary: "Monitors Linux authentication logs for failed login attempts and alerts on suspicious activity.",
      code: `#!/bin/bash

# Simple log watcher for failed SSH login attempts

# --- Configuration ---
LOG_FILE=""
if [ -f "/var/log/auth.log" ]; then
    LOG_FILE="/var/log/auth.log"
elif [ -f "/var/log/secure" ]; then
    LOG_FILE="/var/log/secure"
else
    echo "WARNING: Could not find authentication log file. Exiting."
    exit 1
fi

SEARCH_PATTERN="Failed password for"
TIME_WINDOW_MINUTES=5
FAILED_ATTEMPT_THRESHOLD=3

echo "--------------------------------------------------"
echo "Failed Login Attempt Monitor - $(date)"
echo "Monitoring log: $LOG_FILE"
echo "Alert threshold: $FAILED_ATTEMPT_THRESHOLD failed attempts in $TIME_WINDOW_MINUTES minutes."
echo "--------------------------------------------------"

# --- Get time window ---
current_epoch=$(date +%s)
past_epoch=$(date -d "$TIME_WINDOW_MINUTES minutes ago" +%s 2>/dev/null || date -v-${TIME_WINDOW_MINUTES}M +%s)

# --- Parse log entries ---
failed_attempts=0
declare -a offending_ips

while IFS= read -r line; do
    log_timestamp_str=$(echo "$line" | awk '{print $1 " " $2 " " $3}')
    log_epoch=$(date -d "$log_timestamp_str" +%s 2>/dev/null)

    if [[ -n "$log_epoch" ]] && [[ "$log_epoch" -ge "$past_epoch" ]]; then
        failed_attempts=$((failed_attempts + 1))
        ip_address=$(echo "$line" | grep -o '[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}\\.[0-9]\\{1,3\\}' | head -1)
        if [[ -n "$ip_address" ]]; then
            offending_ips+=("$ip_address")
        fi
    fi
done < <(sudo grep "$SEARCH_PATTERN" "$LOG_FILE" 2>/dev/null || true)

# --- Output Results ---
echo -e "\\n--- Results for the last $TIME_WINDOW_MINUTES minutes ---"
if [ "$failed_attempts" -ge "$FAILED_ATTEMPT_THRESHOLD" ]; then
    echo "ALERT: $failed_attempts failed login attempts detected!"
    if (offending_ips.length > 0) {
        echo "Potential source IPs: $(printf '%s ' "${offending_ips[@]}")"
    fi
    echo "Consider checking the log file for details."
else
    echo "OK: No significant failed login activity detected (found $failed_attempts attempts)."
fi

echo -e "\\n--------------------------------------------------"
echo "Monitoring Complete."
echo "--------------------------------------------------"`,
      readme: `# Failed Login Attempt Monitor Script Documentation

Monitors Linux authentication logs for failed login attempts and provides alerts on suspicious activity.

## Purpose
Provides basic monitoring of authentication logs for failed SSH login attempts to identify potential brute-force attacks.

## Compatibility
- Linux (Debian/Ubuntu, RHEL/CentOS/Fedora)

## Usage
1. Save as log_watcher_ssh.sh
2. Make executable: chmod +x log_watcher_ssh.sh
3. Run with sudo: sudo ./log_watcher_ssh.sh

## Configuration
- TIME_WINDOW_MINUTES: How far back to check (default: 5 minutes)
- FAILED_ATTEMPT_THRESHOLD: Alert threshold (default: 3 attempts)
- Automatically detects auth.log or secure log files

## Features
- Configurable time window and threshold
- IP address extraction from log entries
- Cross-platform date handling (GNU/BSD)`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Linux (All distributions)",
      requiredModules: "Standard Unix utilities",
      dependencies: "sudo access for reading auth logs",
      license: "MIT",
    },
    tags: ["Security", "Monitoring", "SSH", "Log Analysis", "Linux"],
    highlights: ["Real-time Monitoring", "IP Extraction", "Configurable Thresholds"],
    version: {
      version: "1.0.0",
      changes: "Initial release with failed login monitoring for Linux systems",
    }
  },
  {
    script: {
      key: "PS-03",
      language: "PowerShell",
      title: "Failed-Login-Monitor.ps1",
      summary: "PowerShell script to monitor Windows Security Event Log for failed login attempts and security alerts.",
      code: `<#
.SYNOPSIS
    Monitors Windows Security Event Log for failed login attempts (Event ID 4625).
.DESCRIPTION
    Queries the Security event log for failed logon events within a specified time window
    and alerts if the number exceeds a threshold.
.NOTES
    Author: David Povis
    Requires Administrator privileges to read the Security Event Log.
#>

[CmdletBinding()]
param (
    [int]$TimeWindowMinutes = 15,
    [int]$FailedAttemptThreshold = 5
)

Write-Host "--------------------------------------------------"
Write-Host "Failed Login Attempt Monitor (Event ID 4625) - $(Get-Date)"
Write-Host "Monitoring Security Event Log."
Write-Host "Alert threshold: $FailedAttemptThreshold failed attempts in $TimeWindowMinutes minutes."
Write-Host "--------------------------------------------------"

# --- Calculate start time ---
$StartTime = (Get-Date).AddMinutes(-$TimeWindowMinutes)

# --- Query Security Event Log ---
Write-Host "Querying events since $StartTime..."
try {
    $FailedLogins = Get-WinEvent -FilterHashtable @{
        LogName   = 'Security'
        ID        = 4625
        StartTime = $StartTime
    } -ErrorAction Stop

    $FailedLoginCount = ($FailedLogins | Measure-Object).Count

    # --- Output Results ---
    Write-Host "\`n--- Results for the last $TimeWindowMinutes minutes ---"
    if ($FailedLoginCount -ge $FailedAttemptThreshold) {
        Write-Warning "ALERT: $FailedLoginCount failed login attempts (Event ID 4625) detected!"

        Write-Host "Details of failed attempts:"
        $FailedLogins | Select-Object -First 10 TimeCreated, \`
            @{Name='TargetUserName';Expression={$_.Properties[5].Value}}, \`
            @{Name='WorkstationName';Expression={$_.Properties[11].Value}}, \`
            @{Name='SourceIP';Expression={$_.Properties[19].Value}}, \`
            @{Name='LogonType';Expression={$_.Properties[8].Value}} | Format-Table -AutoSize

        Write-Host "Consider investigating these attempts."
    } else {
        Write-Host "OK: No significant failed login activity detected (found $FailedLoginCount attempts)."
    }

} catch {
    Write-Error "Error querying Security Event Log: $($_.Exception.Message)"
    Write-Host "Please ensure you are running this script with Administrator privileges."
}

Write-Host "\`n--------------------------------------------------"
Write-Host "Monitoring Complete."
Write-Host "--------------------------------------------------"`,
      readme: `# Failed Login Attempt Monitor Script Documentation

PowerShell script to monitor Windows Security Event Log for failed login attempts and provide security alerts.

## Purpose
Monitors Windows Security Event Log for Event ID 4625 (failed logon attempts) to provide early warning of potential brute-force attacks.

## Compatibility
- Windows 10, Windows 11
- Windows Server 2016, 2019, 2022

## Usage
1. Save as Watch-FailedLogins.ps1
2. Open PowerShell as Administrator
3. Run: .\\Watch-FailedLogins.ps1
4. Custom parameters: .\\Watch-FailedLogins.ps1 -TimeWindowMinutes 10 -FailedAttemptThreshold 3

## Parameters
- TimeWindowMinutes: How far back to check (default: 15 minutes)
- FailedAttemptThreshold: Alert threshold (default: 5 attempts)

## Requirements
- Administrator privileges for Security Event Log access
- Audit policies enabled for logon events`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Windows 10, Windows 11, Windows Server 2016+",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "PowerShell 5.1+, Administrator privileges, Audit policies enabled",
      license: "MIT",
    },
    tags: ["Security", "Windows", "Event Log", "Login Monitoring", "Threat Detection"],
    highlights: ["Event Log Analysis", "Configurable Parameters", "Detailed Reporting"],
    version: {
      version: "1.0.0",
      changes: "Initial release with Windows failed login monitoring",
    }
  }
];