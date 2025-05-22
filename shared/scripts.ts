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
        echo "WARNING: macOS Packet Filter (pf) is disabled. Check System Settings > Network > Firewall."
    fi
else
    echo -e "\\n--- Firewall Status (UFW/pf) ---"
    echo "INFO: UFW check skipped (not Linux) or pf check skipped (not macOS or pfctl not found)."
fi

# --- Check for listening SSH port (common target) ---
echo -e "\\n--- SSH Port Status ---"
if ss -tulnp | grep ':22' | grep -q 'LISTEN'; then
    echo "OK: SSH daemon appears to be listening on port 22."
    # Further checks could include disallowing root login, password auth, etc.
elif nc -z localhost 22; then # Fallback for macOS or systems without ss
     echo "OK: SSH daemon appears to be listening on port 22."
else
    echo "INFO: SSH daemon does not appear to be listening on port 22, or port is firewalled."
fi

# --- Check for passwordless sudo (potential risk) ---
echo -e "\\n--- Passwordless Sudo Check ---"
if sudo -nl | grep -q '(ALL) NOPASSWD: ALL'; then
    echo "WARNING: Found user(s) with passwordless sudo access for ALL commands. Review sudoers file."
else
    echo "OK: No users found with global passwordless sudo for ALL commands (basic check)."
fi

# --- macOS Specific: Gatekeeper Status ---
if [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\\n--- macOS Gatekeeper Status ---"
    gatekeeper_status=$(spctl --status)
    if [[ "$gatekeeper_status" == "assessments enabled" ]]; then
        echo "OK: Gatekeeper is enabled."
    else
        echo "WARNING: Gatekeeper is disabled ($gatekeeper_status). Consider enabling: sudo spctl --master-enable"
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
      readme: `# Security Baseline Checker Script - Bash Version

This script aims to verify common security configurations on a system, helping to ensure it adheres to basic security best practices. It's intended to identify potential misconfigurations that could increase a system's attack surface.

## Purpose
This Bash script performs checks for several common security baseline settings on Linux and macOS systems. It's designed to help administrators quickly identify potential deviations from recommended security configurations.

## Operating System Compatibility
- Linux (tested on Debian/Ubuntu-based and RHEL/CentOS-based systems)
- macOS

## Prerequisites
- Standard Unix/Linux command-line utilities (e.g., ufw, pfctl, ss, nc, sudo, find, spctl, fdesetup)
- sudo access is required for some checks (e.g., firewall status, reading sudoers configuration)
- ss (socket statistics) is preferred for network checks on Linux; nc (netcat) is used as a fallback or for macOS

## Usage
1. Save the script to a file (e.g., security_baseline_check.sh)
2. Make the script executable: chmod +x security_baseline_check.sh
3. Run the script, preferably with sudo for comprehensive checks: sudo ./security_baseline_check.sh

## Output
The script outputs its findings to the console, indicating whether certain security settings are in place or if potential issues are detected:
- Firewall status (UFW on Linux, pf on macOS)
- SSH port listening status
- Presence of passwordless sudo configurations
- (macOS only) Gatekeeper status
- (macOS only) FileVault (full disk encryption) status

The output uses "OK:" for checks that pass or confirm a secure setting and "WARNING:" for warnings or potential issues.

## Notes
- This script performs basic checks and is not a substitute for a comprehensive security audit or dedicated security scanning tools
- "Passwordless sudo check" is a simplified check; complex sudoers configurations might require more detailed analysis
- The world-writable files check in /tmp is commented out by default as it can be noisy and context-dependent
- Security best practices evolve; this script should be reviewed and updated periodically`,
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

# --- Check Windows Firewall Status (Domain, Private, Public profiles) ---
Write-Host "\`n--- Windows Firewall Status ---"
$FirewallProfiles = Get-NetFirewallProfile -Profile Domain, Private, Public | Select-Object Name, Enabled
foreach ($Profile in $FirewallProfiles) {
    if ($Profile.Enabled) {
        Write-Host "OK: $($Profile.Name) Firewall Profile is Enabled."
    } else {
        Write-Host "WARNING: $($Profile.Name) Firewall Profile is Disabled. Consider enabling it."
    }
}

# --- Check if UAC (User Account Control) is enabled ---
Write-Host "\`n--- User Account Control (UAC) Status ---"
$UACEnabled = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" -Name "EnableLUA").EnableLUA
if ($UACEnabled -eq 1) {
    Write-Host "OK: User Account Control (UAC) is Enabled."
} else {
    Write-Host "WARNING: User Account Control (UAC) is Disabled. This is a security risk."
}

# --- Check for Automatic Updates ---
Write-Host "\`n--- Automatic Updates Status ---"
try {
    $AUService = Get-Service wuauserv
    $AUManager = New-Object -ComObject "Microsoft.Update.AutoUpdate"
    if ($AUService.Status -ne "Running") {
        Write-Host "WARNING: Windows Update service (wuauserv) is not running."
    }
    if ($AUManager.Settings.NotificationLevel -lt 3) { # 2 = Notify for download and install, 3 = Auto download and notify for install, 4 = Auto download and schedule install
        Write-Host "WARNING: Automatic Updates may not be fully enabled (NotificationLevel: $($AUManager.Settings.NotificationLevel)). Review Group Policy or Settings."
    } else {
        Write-Host "OK: Automatic Updates appear to be configured to download and/or install."
    }
} catch {
    Write-Host "INFO: Could not retrieve full Automatic Update settings (COM object error or service issue)."
}

# --- Check for Antivirus Status (via Security Center) ---
Write-Host "\`n--- Antivirus Status ---"
try {
    $AntivirusProduct = Get-CimInstance -Namespace root\\SecurityCenter2 -ClassName AntiVirusProduct
    if ($AntivirusProduct) {
        foreach ($AV in $AntivirusProduct) {
            $AVStatus = switch ($AV.productState) {
                "262144" { "Up to date, Disabled" }
                "262160" { "Out of date, Disabled" }
                "266240" { "Up to date, Enabled" } # Good
                "266256" { "Out of date, Enabled" } # Not good
                "393216" { "Up to date, Disabled" }
                "393232" { "Out of date, Disabled" }
                "393472" { "N/A, Snoozed" }
                "393488" { "N/A, Snoozed" }
                "397312" { "Up to date, Enabled" } # Good
                "397328" { "Out of date, Enabled" } # Not good
                "397568" { "Up to date, Snoozed" }
                "397584" { "Out of date, Snoozed" }
                default { "Unknown state: $($AV.productState)" }
            }
            Write-Host "Product: $($AV.displayName)"
            if ($AV.productState -eq "266240" -or $AV.productState -eq "397312") {
                 Write-Host "Status: OK - Enabled and Up to Date."
            } elseif ($AV.productState -eq "266256" -or $AV.productState -eq "397328") {
                 Write-Host "Status: WARNING - Enabled but Out of Date."
            } else {
                 Write-Host "Status: WARNING - $AVStatus. Action may be required."
            }
        }
    } else {
        Write-Host "WARNING: No Antivirus product detected via WMI SecurityCenter2."
    }
} catch {
    Write-Host "INFO: Could not query Antivirus status via WMI SecurityCenter2. Ensure the service is running or try another method."
}

# --- Check BitLocker Encryption Status for OS Drive ---
Write-Host "\`n--- BitLocker Status (OS Drive) ---"
try {
    $OSVolume = Get-BitLockerVolume -MountPoint $env:SystemDrive
    if ($OSVolume.ProtectionStatus -eq "On") {
        Write-Host "OK: BitLocker is ON for the OS Drive ($($env:SystemDrive)). Status: $($OSVolume.VolumeStatus)"
    } else {
        Write-Host "WARNING: BitLocker is OFF for the OS Drive ($($env:SystemDrive)). Protection Status: $($OSVolume.ProtectionStatus)"
    }
} catch {
    Write-Host "INFO: Could not retrieve BitLocker status for $($env:SystemDrive). Ensure BitLocker cmdlets are available or BitLocker is installed."
}

Write-Host "\`n--------------------------------------------------"
Write-Host "Security Baseline Check Complete. Review findings."
Write-Host "--------------------------------------------------"`,
      readme: `# Security Baseline Checker Script - PowerShell Version

This PowerShell script checks several common security baseline settings on Windows systems. It helps administrators and MSPs verify that essential security configurations are in place, aligning with industry best practices to reduce system vulnerabilities.

## Purpose
This PowerShell script checks several common security baseline settings on Windows systems. It helps administrators and MSPs verify that essential security configurations are in place, aligning with industry best practices to reduce system vulnerabilities.

## Operating System Compatibility
- Windows 10, Windows 11
- Windows Server 2016, 2019, 2022
- (Requires PowerShell 5.1 or later)

## Prerequisites
- PowerShell 5.1 or higher
- Administrator privileges are generally required to accurately query all security settings (e.g., UAC, BitLocker, Antivirus status via WMI)

## Usage
1. Save the script to a file (e.g., Security-BaselineCheck.ps1)
2. Open PowerShell as an Administrator
3. Navigate to the directory where you saved the script
4. Run the script: .\\Security-BaselineCheck.ps1
5. If script execution is disabled, you may need to adjust the execution policy (e.g., Set-ExecutionPolicy RemoteSigned -Scope Process for the current session)

## Output
The script outputs its findings to the PowerShell console, indicating the status of various security settings:
- Windows Firewall status for Domain, Private, and Public profiles
- User Account Control (UAC) enabled status
- Automatic Updates configuration status
- Antivirus product status (via WMI SecurityCenter2)
- BitLocker Drive Encryption status for the OS drive

The output uses "OK:" for checks that confirm a generally secure setting and "WARNING:" for warnings or configurations that may require review.

## Notes
- This script provides a snapshot of common security settings. It is not exhaustive and should be part of a broader security assessment strategy
- Antivirus status detection relies on WMI's SecurityCenter2 namespace, which should be available and accurate on most modern Windows systems with a compatible AV product
- BitLocker status check requires the BitLocker cmdlets to be available
- Configuration for items like "Automatic Updates" can be complex (e.g., Group Policy controlled); this script provides a high-level check`,
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
      summary: "Simple log watcher that monitors SSH authentication logs for failed login attempts and alerts when threshold is exceeded.",
      code: `#!/bin/bash

# Simple log watcher for failed SSH login attempts
# This is a basic example; for production, use tools like fail2ban or centralized logging.

# --- Configuration ---
LOG_FILE=""
# Detect common auth log files
if [ -f "/var/log/auth.log" ]; then # Debian/Ubuntu
    LOG_FILE="/var/log/auth.log"
elif [ -f "/var/log/secure" ]; then # RHEL/CentOS/Fedora
    LOG_FILE="/var/log/secure"
else
    echo "WARNING: Could not find a common SSH authentication log file. Exiting."
    exit 1
fi

SEARCH_PATTERN="Failed password for" # Common pattern for failed SSH logins
TIME_WINDOW_MINUTES=5 # Check for attempts in the last X minutes
FAILED_ATTEMPT_THRESHOLD=3 # Alert if more than X attempts

echo "--------------------------------------------------"
echo "Failed Login Attempt Monitor - $(date)"
echo "Monitoring log: $LOG_FILE"
echo "Alert threshold: $FAILED_ATTEMPT_THRESHOLD failed attempts in $TIME_WINDOW_MINUTES minutes."
echo "--------------------------------------------------"

# --- Get current time and time X minutes ago for log filtering ---
# Note: 'date -d' syntax varies between GNU date (Linux) and BSD date (macOS)
current_epoch=$(date +%s)
past_epoch=$(date -d "$TIME_WINDOW_MINUTES minutes ago" +%s 2>/dev/null || date -v-\${TIME_WINDOW_MINUTES}M +%s) # GNU || BSD

# --- Function to parse log entries (very basic, adjust based on log format) ---
failed_attempts=0
offending_ips=()

# Read the log file line by line
# Using 'sudo' as auth logs often require root privileges
sudo grep "$SEARCH_PATTERN" "$LOG_FILE" | while IFS= read -r line; do
    log_timestamp_str=$(echo "$line" | awk '{print $1 " " $2 " " $3}')
    log_epoch=$(date -d "$log_timestamp_str" +%s 2>/dev/null)

    if [[ -z "$log_epoch" ]]; then
        continue
    fi

    if [[ "$log_epoch" -ge "$past_epoch" ]]; then
        failed_attempts=$((failed_attempts + 1))
        ip_address=$(echo "$line" | grep -oP 'from \\K[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+' || echo "unknown_ip")
        if [[ ! " \${offending_ips[@]} " =~ " \${ip_address} " ]]; then
            offending_ips+=("$ip_address")
        fi
    fi
done

# --- Output Results ---
echo -e "\\n--- Results for the last $TIME_WINDOW_MINUTES minutes ---"
if [ "$failed_attempts" -ge "$FAILED_ATTEMPT_THRESHOLD" ]; then
    echo "ALERT: $failed_attempts failed login attempts detected!"
    echo "Potential source IPs (if found): \${offending_ips[*]}"
    echo "Consider checking the log file ($LOG_FILE) for details and potentially blocking IPs."
else
    echo "OK: No significant failed login activity detected (found $failed_attempts attempts)."
fi

echo -e "\\n--------------------------------------------------"
echo "Monitoring Complete."
echo "--------------------------------------------------"`,
      readme: `# Simple Log Watcher & Alerter Script - Bash Version

This Bash script provides a basic mechanism to monitor Linux authentication logs for a configurable number of "Failed password" attempts within a recent time window. It's a simplified example for identifying potential brute-force attacks or unauthorized access attempts.

## Purpose
This script demonstrates a basic approach to monitoring log files for specific patterns, such as repeated failed login attempts, which can be an indicator of a security event.

## Operating System Compatibility
- Linux (Debian/Ubuntu, RHEL/CentOS/Fedora, and other distributions that use /var/log/auth.log or /var/log/secure for SSH login attempts)
- Less effective on macOS for this specific log file; macOS uses a different logging system (log show) for detailed SSHD events

## Prerequisites
- Standard Unix/Linux command-line utilities (grep, date, awk, sudo)
- sudo access is required to read authentication logs, which are typically restricted
- The date command's ability to parse relative times (e.g., "5 minutes ago") is used. GNU date (common on Linux) and BSD date (common on macOS) have different syntaxes, and the script attempts to accommodate both

## Configuration
- LOG_FILE: Automatically detected (auth.log or secure)
- SEARCH_PATTERN: The text pattern to search for (default: "Failed password for")
- TIME_WINDOW_MINUTES: How far back to check in the logs (default: 5 minutes)
- FAILED_ATTEMPT_THRESHOLD: Number of matches to trigger an alert (default: 3)

## Usage
1. Save the script to a file (e.g., log_watcher_ssh.sh)
2. Make the script executable: chmod +x log_watcher_ssh.sh
3. Run the script with sudo: sudo ./log_watcher_ssh.sh

## Output
The script outputs:
- Its configuration (log file, threshold, time window)
- A summary of findings for the specified time window
- If the threshold is met or exceeded, it prints an "ALERT" message, including the count of failed attempts and any extracted IP addresses
- If the threshold is not met, it prints a "No significant failed login activity detected" message

## Notes
- This is a simple log watcher and not a replacement for robust intrusion detection systems like fail2ban or centralized logging solutions
- Timestamp parsing from logs can be fragile; this script uses a basic approach
- IP address extraction is based on a common pattern and might not capture IPs in all log message formats
- For production use, consider actions beyond printing to console, such as sending email alerts or integrating with a ticketing system
- For macOS, a different approach using log show would be more accurate for SSHD logs`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Linux (Debian/Ubuntu, RHEL/CentOS/Fedora)",
      requiredModules: "Standard Unix utilities (grep, awk, date)",
      dependencies: "sudo access for reading authentication logs",
      license: "MIT",
    },
    tags: ["Security", "Monitoring", "SSH", "Log Analysis", "Linux"],
    highlights: ["Real-time Monitoring", "Configurable Thresholds", "IP Detection"],
    version: {
      version: "1.0.0",
      changes: "Initial release with SSH failed login monitoring",
    }
  },
  {
    script: {
      key: "PS-03",
      language: "PowerShell",
      title: "Failed-Login-Monitor.ps1",
      summary: "PowerShell script that monitors the Windows Security Event Log for failed login attempts (Event ID 4625) and alerts when threshold is exceeded.",
      code: `<#
.SYNOPSIS
    Monitors the Windows Security Event Log for multiple failed login attempts (Event ID 4625).
.DESCRIPTION
    This script queries the Security event log for Event ID 4625 (An account failed to log on)
    within a specified time window. If the number of failed attempts exceeds a threshold,
    it outputs an alert.
.NOTES
    Author: David Povis
    Date: $(Get-Date)
    Requires Administrator privileges to read the Security Event Log.
#>

[CmdletBinding()]
param (
    [int]$TimeWindowMinutes = 15, # Check for attempts in the last X minutes
    [int]$FailedAttemptThreshold = 5 # Alert if more than X attempts
)

Write-Host "--------------------------------------------------"
Write-Host "Failed Login Attempt Monitor (Event ID 4625) - $(Get-Date)"
Write-Host "Monitoring Security Event Log."
Write-Host "Alert threshold: $FailedAttemptThreshold failed attempts in $TimeWindowMinutes minutes."
Write-Host "--------------------------------------------------"

# --- Calculate the start time for the event log query ---
$StartTime = (Get-Date).AddMinutes(-$TimeWindowMinutes)

# --- Query the Security Event Log ---
Write-Host "Querying events since $StartTime..."
try {
    $FailedLogins = Get-WinEvent -FilterHashtable @{
        LogName   = 'Security'
        ID        = 4625 # Event ID for "An account failed to log on"
        StartTime = $StartTime
    } -ErrorAction Stop

    $FailedLoginCount = ($FailedLogins | Measure-Object).Count

    # --- Output Results ---
    Write-Host "\`n--- Results for the last $TimeWindowMinutes minutes ---"
    if ($FailedLoginCount -ge $FailedAttemptThreshold) {
        Write-Warning "ALERT: $FailedLoginCount failed login attempts (Event ID 4625) detected!" # Write-Warning itself is fine

        # Display details of the failed logins
        Write-Host "Details of failed attempts:"
        $FailedLogins | Select-Object -First 10 TimeCreated, \`
            @{Name='TargetUserName';Expression={$_.Properties[5].Value}}, \`
            @{Name='WorkstationName';Expression={$_.Properties[11].Value}}, \`
            @{Name='SourceNetworkAddress';Expression={$_.Properties[19].Value}}, \`
            @{Name='LogonType';Expression={$_.Properties[8].Value}}, \`
            @{Name='Status';Expression={$_.Properties[6].Value}} | Format-Table -AutoSize

        Write-Host "Consider investigating these attempts."
    } else {
        Write-Host "OK: No significant failed login activity detected (found $FailedLoginCount attempts)."
    }

} catch {
    Write-Error "Error querying the Security Event Log: $($_.Exception.Message)"
    Write-Host "Please ensure you are running this script with Administrator privileges."
}

Write-Host "\`n--------------------------------------------------"
Write-Host "Monitoring Complete."
Write-Host "--------------------------------------------------"`,
      readme: `# Simple Log Watcher & Alerter Script - PowerShell Version

This PowerShell script monitors the Windows Security Event Log for multiple failed login attempts (Event ID 4625) within a specified time window. It aims to provide an early warning for potential brute-force attacks or unauthorized access attempts against Windows systems.

## Purpose
This script demonstrates a basic approach to monitoring log files for specific patterns, such as repeated failed login attempts, which can be an indicator of a security event.

## Operating System Compatibility
- Windows 10, Windows 11
- Windows Server 2016, 2019, 2022
- (Requires PowerShell 5.1 or later)

## Prerequisites
- PowerShell 5.1 or higher
- Administrator privileges are required to read the Security Event Log
- Ensure "Audit Logon Events" (specifically "Audit Account Logon Events" and "Audit Logon") policies are enabled in Windows to generate Event ID 4625. Success and Failure should be audited for "Audit Logon"

## Configuration (parameters when running the script)
- TimeWindowMinutes: How far back to check in the event log (default: 15 minutes)
- FailedAttemptThreshold: Number of Event ID 4625 occurrences to trigger an alert (default: 5)

## Usage
1. Save the script to a file (e.g., Watch-FailedLogins.ps1)
2. Open PowerShell as an Administrator
3. Navigate to the directory where you saved the script
4. Run the script: .\\Watch-FailedLogins.ps1
5. To use custom parameters: .\\Watch-FailedLogins.ps1 -TimeWindowMinutes 10 -FailedAttemptThreshold 3
6. If script execution is disabled, you may need to adjust the execution policy

## Output
The script outputs:
- Its configuration parameters
- A status message indicating it's querying events
- If the number of detected failed logins meets or exceeds the threshold, it displays an "ALERT" message along with details of the first 10 detected failed attempts (Time, Target User, Workstation, Source IP, Logon Type, Status Code)
- If the threshold is not met, it indicates that no significant failed login activity was detected
- Error messages if it cannot query the Security Event Log (e.g., due to lack of permissions)

## Notes
- This script focuses specifically on Event ID 4625 ("An account failed to log on"). Other event IDs might also be relevant for comprehensive security monitoring
- The effectiveness depends on proper audit policies being configured on the Windows system
- For real-time alerting or integration with other systems (e.g., SIEM, ticketing), the script would need to be extended
- This script provides a reactive alert; proactive measures like strong password policies, account lockout policies, and multi-factor authentication are crucial`,
      author: "David Povis",
      version: "1.0.0",
      compatibleOS: "Windows 10, Windows 11, Windows Server 2016+",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "PowerShell 5.1+, Administrator privileges required",
      license: "MIT",
    },
    tags: ["Security", "Windows", "Event Log", "Monitoring", "Failed Logins"],
    highlights: ["Event Log Analysis", "Configurable Parameters", "Detailed Reporting"],
    version: {
      version: "1.0.0",
      changes: "Initial release with Windows Event Log monitoring for failed logins",
    }
  }
];