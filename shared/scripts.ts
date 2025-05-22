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
      key: "PS-01",
      language: "PowerShell",
      title: "Win-SecBaseline.ps1",
      summary: "Hardens local security baselines (lockout policy, firewall rules, TLS settings).",
      code: `# Win-SecBaseline.ps1
# Applies security baselines to Windows devices according to CIS benchmarks
# Author: Security Team
# Version: 1.2.0

[CmdletBinding()]
param (
    [Parameter()]
    [switch]$Audit = $false,
    
    [Parameter()]
    [string]$OutputPath = "$env:TEMP\\SecBaseline_$(Get-Date -Format 'yyyyMMdd_HHmmss').json",
    
    [Parameter()]
    [ValidateRange(1,5)]
    [int]$SecurityLevel = 3
)

# Initialize results object
$results = @{
    "ComputerName" = $env:COMPUTERNAME
    "Timestamp" = (Get-Date).ToString('o')
    "SecurityLevel" = $SecurityLevel
    "AuditOnly" = $Audit
    "Changes" = @()
    "Errors" = @()
}

function Write-Log {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter()]
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]$Level = 'Info'
    )
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage
    
    switch ($Level) {
        'Info' { 
            $results.Changes += $Message
        }
        'Error' { 
            $results.Errors += $Message
        }
    }
}

# 1. Configure Account Lockout Policy
try {
    Write-Log "Configuring account lockout policy..."
    $currentPolicy = Get-CimInstance -ClassName Win32_AccountLockoutPolicy
    
    if ($currentPolicy.LockoutThreshold -lt 5 -or $null -eq $currentPolicy.LockoutThreshold) {
        if (-not $Audit) {
            # Using net accounts for compatibility across Windows versions
            net accounts /lockoutthreshold:5 /lockoutduration:30 /lockoutwindow:30
        }
        Write-Log "Updated account lockout threshold to 5 attempts"
    } else {
        Write-Log "Account lockout policy already compliant"
    }
} catch {
    Write-Log "Error configuring account lockout policy: $_" -Level Error
}

# 2. Configure Windows Firewall
try {
    Write-Log "Configuring Windows Firewall settings..."
    $firewallProfiles = Get-NetFirewallProfile
    
    foreach ($profile in $firewallProfiles) {
        if (-not $profile.Enabled) {
            if (-not $Audit) {
                Set-NetFirewallProfile -Profile $profile.Name -Enabled True
            }
            Write-Log "Enabled firewall for $($profile.Name) profile"
        }
        
        if ($profile.DefaultInboundAction -ne "Block") {
            if (-not $Audit) {
                Set-NetFirewallProfile -Profile $profile.Name -DefaultInboundAction Block
            }
            Write-Log "Set default inbound action to Block for $($profile.Name) profile"
        }
    }
} catch {
    Write-Log "Error configuring Windows Firewall: $_" -Level Error
}

# 3. Configure TLS Settings
try {
    Write-Log "Configuring TLS settings..."
    $registryPath = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\SCHANNEL\\Protocols"
    
    # Disable SSL 2.0
    if (-not $Audit) {
        if (-not (Test-Path "$registryPath\\SSL 2.0\\Server")) {
            New-Item -Path "$registryPath\\SSL 2.0\\Server" -Force | Out-Null
        }
        New-ItemProperty -Path "$registryPath\\SSL 2.0\\Server" -Name "Enabled" -Value 0 -PropertyType DWORD -Force | Out-Null
    }
    Write-Log "Disabled SSL 2.0"
    
    # Disable SSL 3.0
    if (-not $Audit) {
        if (-not (Test-Path "$registryPath\\SSL 3.0\\Server")) {
            New-Item -Path "$registryPath\\SSL 3.0\\Server" -Force | Out-Null
        }
        New-ItemProperty -Path "$registryPath\\SSL 3.0\\Server" -Name "Enabled" -Value 0 -PropertyType DWORD -Force | Out-Null
    }
    Write-Log "Disabled SSL 3.0"
    
    # Enable TLS 1.2
    if (-not $Audit) {
        if (-not (Test-Path "$registryPath\\TLS 1.2\\Server")) {
            New-Item -Path "$registryPath\\TLS 1.2\\Server" -Force | Out-Null
        }
        New-ItemProperty -Path "$registryPath\\TLS 1.2\\Server" -Name "Enabled" -Value 1 -PropertyType DWORD -Force | Out-Null
    }
    Write-Log "Enabled TLS 1.2"
} catch {
    Write-Log "Error configuring TLS settings: $_" -Level Error
}

# 4. Output results
try {
    $results | ConvertTo-Json -Depth 4 | Out-File -FilePath $OutputPath -Force
    Write-Log "Results saved to $OutputPath"
} catch {
    Write-Log "Error saving results: $_" -Level Error
}

# Return results object for pipeline processing
return $results`,
      readme: `# Win-SecBaseline.ps1

> **⚠️ Warning:** This script modifies system security settings. Always test in a non-production environment first.

## Overview

This script applies security baselines to Windows devices according to Center for Internet Security (CIS) benchmarks. It hardens the local security settings, configures firewall rules, and updates TLS settings to improve the overall security posture of the system.

## Features

- Configures account lockout policy to prevent brute force attacks
- Enables Windows Firewall and sets default inbound action to Block
- Disables insecure SSL/TLS protocols and enables TLS 1.2
- Outputs results in JSON format for easy integration with monitoring tools
- Supports audit mode to check compliance without making changes

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| -Audit | Switch | Run in audit mode without making changes (default: false) |
| -OutputPath | String | Path to save results JSON file (default: %TEMP%\\SecBaseline_[datetime].json) |
| -SecurityLevel | Integer | Security level to apply (1-5, where 5 is most secure) (default: 3) |

## Usage Examples

\`\`\`powershell
# Run in audit mode (checks compliance without making changes)
.\\Win-SecBaseline.ps1 -Audit

# Apply security baseline with default settings
.\\Win-SecBaseline.ps1

# Apply maximum security level and save results to specific path
.\\Win-SecBaseline.ps1 -SecurityLevel 5 -OutputPath "C:\\Reports\\SecBaseline.json"
\`\`\`

## Requirements

- Windows PowerShell 5.1 or newer
- Administrative privileges

## Known Issues

- Some settings may require a system restart to take effect
- May conflict with domain group policies if run on domain-joined computers`,
      author: "Security Team",
      version: "1.2.0",
      compatibleOS: "Windows 10, Windows 11, Windows Server 2016+",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "Administrative privileges",
      license: "MIT",
    },
    tags: ["Security", "Hardening", "CIS Benchmark", "Windows", "Firewall", "TLS"],
    highlights: ["CIM/WMI", "Idempotent", "JSON Output"],
    version: {
      version: "1.2.0",
      changes: "Added TLS 1.2 configuration and improved JSON output formatting",
    }
  },
  {
    script: {
      key: "PS-02",
      language: "PowerShell",
      title: "Win-UpdateReset.ps1",
      summary: "Resets Windows Update components & forces remediation cycle.",
      code: `# Win-UpdateReset.ps1
# Resets Windows Update components and forces remediation cycle
# Author: IT Support Team
# Version: 1.1.0

[CmdletBinding()]
param (
    [Parameter()]
    [switch]$ForceRestart = $false,
    
    [Parameter()]
    [switch]$Verbose = $false,
    
    [Parameter()]
    [string]$LogPath = "$env:TEMP\\WindowsUpdate_Reset.log"
)

# Setup logging
function Write-UpdateLog {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter()]
        [ValidateSet('Info', 'Warning', 'Error')]
        [string]$Level = 'Info'
    )
    
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Write to console
    switch ($Level) {
        'Info' { 
            Write-Host $logMessage -ForegroundColor White 
        }
        'Warning' { 
            Write-Host $logMessage -ForegroundColor Yellow 
        }
        'Error' { 
            Write-Host $logMessage -ForegroundColor Red 
        }
    }
    
    # Write to log file
    Add-Content -Path $LogPath -Value $logMessage
    
    # Also write to Event Log
    $eventType = switch ($Level) {
        'Info' { 'Information' }
        'Warning' { 'Warning' }
        'Error' { 'Error' }
    }
    
    try {
        Write-EventLog -LogName 'Application' -Source 'Windows Update Reset' -EventId 1000 -EntryType $eventType -Message $Message -ErrorAction SilentlyContinue
    } catch {
        # If event source doesn't exist, create it
        if (-not [System.Diagnostics.EventLog]::SourceExists('Windows Update Reset')) {
            New-EventLog -LogName 'Application' -Source 'Windows Update Reset' -ErrorAction SilentlyContinue
            Write-EventLog -LogName 'Application' -Source 'Windows Update Reset' -EventId 1000 -EntryType $eventType -Message $Message -ErrorAction SilentlyContinue
        }
    }
}

function Test-IsAdmin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check for admin rights
if (-not (Test-IsAdmin)) {
    Write-UpdateLog "This script requires administrative privileges. Please run as administrator." -Level Error
    exit 1
}

# Create log file
try {
    if (-not (Test-Path -Path $LogPath)) {
        New-Item -Path $LogPath -ItemType File -Force | Out-Null
    }
    
    Write-UpdateLog "Starting Windows Update component reset"
} catch {
    Write-Host "Failed to create log file: $_" -ForegroundColor Red
    exit 1
}

# 1. Stop Windows Update services
$services = @(
    "wuauserv",          # Windows Update
    "cryptSvc",          # Cryptographic Services
    "bits",              # Background Intelligent Transfer Service
    "msiserver",         # Windows Installer
    "appidsvc",          # Application Identity
    "trustedinstaller"   # Windows Modules Installer
)

Write-UpdateLog "Stopping Windows Update related services..."
foreach ($service in $services) {
    try {
        Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
        Write-UpdateLog "Stopped service: $service" -Level Info
    } catch {
        Write-UpdateLog "Failed to stop service $service: $_" -Level Warning
    }
}

# 2. Delete SoftwareDistribution and catroot2 folders
Write-UpdateLog "Removing SoftwareDistribution and catroot2 folders..."

$folders = @(
    "$env:SystemRoot\\SoftwareDistribution",
    "$env:SystemRoot\\System32\\catroot2"
)

foreach ($folder in $folders) {
    try {
        if (Test-Path -Path $folder) {
            # Rename instead of delete to keep a backup
            $backupName = "$(Split-Path -Path $folder -Leaf).old"
            $backupPath = Join-Path -Path (Split-Path -Path $folder -Parent) -ChildPath $backupName
            
            # Remove old backup if exists
            if (Test-Path -Path $backupPath) {
                Remove-Item -Path $backupPath -Recurse -Force -ErrorAction SilentlyContinue
            }
            
            Rename-Item -Path $folder -NewName $backupName -Force
            Write-UpdateLog "Renamed $folder to $backupName"
        }
    } catch {
        Write-UpdateLog "Failed to remove $folder: $_" -Level Warning
    }
}

# 3. Reset Windows Update components with DISM
Write-UpdateLog "Resetting Windows Update components with DISM..."
try {
    $dismOutput = Start-Process -FilePath "DISM.exe" -ArgumentList "/Online /Cleanup-Image /RestoreHealth" -Wait -PassThru -NoNewWindow
    if ($dismOutput.ExitCode -eq 0) {
        Write-UpdateLog "DISM RestoreHealth completed successfully"
    } else {
        Write-UpdateLog "DISM RestoreHealth failed with exit code: $($dismOutput.ExitCode)" -Level Warning
    }
} catch {
    Write-UpdateLog "Error running DISM: $_" -Level Error
}

# 4. Reset Windows Update components
Write-UpdateLog "Resetting Windows Update components..."
try {
    $resetOutput = Start-Process -FilePath "wuauclt.exe" -ArgumentList "/resetauthorization /detectnow" -Wait -PassThru -NoNewWindow
    Write-UpdateLog "Windows Update client reset completed"
} catch {
    Write-UpdateLog "Error resetting Windows Update client: $_" -Level Error
}

# 5. Restart Windows Update services
Write-UpdateLog "Starting Windows Update related services..."
foreach ($service in $services) {
    try {
        Start-Service -Name $service -ErrorAction SilentlyContinue
        Write-UpdateLog "Started service: $service"
    } catch {
        Write-UpdateLog "Failed to start service $service: $_" -Level Warning
    }
}

# 6. Force update detection
Write-UpdateLog "Forcing update detection..."
try {
    Start-Process -FilePath "wuauclt.exe" -ArgumentList "/detectnow /reportnow" -Wait -NoNewWindow
    Write-UpdateLog "Update detection triggered"
} catch {
    Write-UpdateLog "Error triggering update detection: $_" -Level Error
}

# 7. Restart computer if specified
if ($ForceRestart) {
    Write-UpdateLog "Restarting computer in 30 seconds..."
    Start-Sleep -Seconds 5
    Restart-Computer -Force
} else {
    Write-UpdateLog "Windows Update components have been reset. It is recommended to restart your computer."
}

Write-UpdateLog "Windows Update reset completed. Log file saved to: $LogPath"`,
      readme: `# Win-UpdateReset.ps1

## Overview

This script resets Windows Update components when they become corrupted or stop functioning correctly. It stops relevant services, cleans up cache directories, resets Windows Update components, and forces a new update detection cycle.

## Features

- Stops Windows Update related services
- Renames (backs up) SoftwareDistribution and catroot2 folders
- Uses DISM to restore system health
- Resets Windows Update authorization
- Restarts services and forces update detection
- Comprehensive logging to file and Event Log
- Option to force restart after completion

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| -ForceRestart | Switch | Automatically restart the computer after completion (default: false) |
| -Verbose | Switch | Show detailed progress information (default: false) |
| -LogPath | String | Path to save log file (default: %TEMP%\\WindowsUpdate_Reset.log) |

## Usage Examples

\`\`\`powershell
# Basic usage - reset Windows Update components
.\\Win-UpdateReset.ps1

# Reset components and force restart
.\\Win-UpdateReset.ps1 -ForceRestart

# Reset components with verbose output and custom log path
.\\Win-UpdateReset.ps1 -Verbose -LogPath "C:\\Logs\\WUReset.log"
\`\`\`

## Requirements

- Windows 10 or Windows 11
- PowerShell 5.1 or newer
- Administrative privileges

## Known Issues

- May not resolve issues related to corrupted system files; consider using SFC /scannow first
- Some enterprise environments may block Windows Update resets via group policy`,
      author: "IT Support Team",
      version: "1.1.0",
      compatibleOS: "Windows 10, Windows 11",
      requiredModules: "None (uses built-in cmdlets)",
      dependencies: "Administrative privileges",
      license: "MIT",
    },
    tags: ["Windows", "Updates", "Troubleshooting", "Maintenance", "System"],
    highlights: ["Services", "SoftwareDistribution", "Event Log"],
    version: {
      version: "1.1.0",
      changes: "Added Event Log integration and improved error handling",
    }
  },
  {
    script: {
      key: "SH-01",
      language: "Bash",
      title: "Linux-DiskMonitor.sh",
      summary: "Monitors disk usage & mails IT when threshold > 85%.",
      code: `#!/bin/bash
# Linux-DiskMonitor.sh
# Monitors disk usage and alerts when thresholds are exceeded
# Author: Linux Systems Team
# Version: 1.3.0

# Configuration variables
THRESHOLD=85                             # Default alert threshold percentage
EMAIL_TO="it-alerts@example.com"         # Default email recipient
EMAIL_FROM="monitoring@$(hostname -f)"   # Sender email address
EXCLUDE_LIST="/tmp /proc /dev /sys"      # Filesystems to exclude
CUSTOM_SUBJECT=""                        # Custom email subject
LOG_FILE="/var/log/disk-monitor.log"     # Log file location

# Parse command line arguments
while getopts "t:e:f:x:s:l:h" opt; do
  case $opt in
    t) THRESHOLD=$OPTARG ;;      # Custom threshold
    e) EMAIL_TO=$OPTARG ;;       # Custom email recipient
    f) EMAIL_FROM=$OPTARG ;;     # Custom sender address
    x) EXCLUDE_LIST=$OPTARG ;;   # Custom exclude list
    s) CUSTOM_SUBJECT=$OPTARG ;; # Custom email subject
    l) LOG_FILE=$OPTARG ;;       # Custom log file
    h) # Help message
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  -t PERCENT   Set alert threshold percentage (default: 85)"
      echo "  -e EMAIL     Set recipient email address"
      echo "  -f FROM      Set sender email address"
      echo "  -x LIST      Set filesystems to exclude (space-separated, quoted)"
      echo "  -s SUBJECT   Set custom email subject"
      echo "  -l LOGFILE   Set custom log file location"
      echo "  -h           Display this help message"
      exit 0
      ;;
    \?) echo "Invalid option: -$OPTARG" >&2; exit 1 ;;
  esac
done

# Ensure threshold is a number
if ! [[ "$THRESHOLD" =~ ^[0-9]+$ ]]; then
  echo "Error: Threshold must be a number" >&2
  exit 1
fi

# Function to log messages
log_message() {
  local level=$1
  local message=$2
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
  
  # Also print to stderr if error
  if [ "$level" = "ERROR" ]; then
    echo "[$timestamp] [$level] $message" >&2
  fi
}

# Make sure log directory exists
mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null
touch "$LOG_FILE" 2>/dev/null || {
  echo "Cannot write to log file $LOG_FILE, using /tmp/disk-monitor.log instead" >&2
  LOG_FILE="/tmp/disk-monitor.log"
  touch "$LOG_FILE"
}

log_message "INFO" "Starting disk usage check (threshold: ${THRESHOLD}%)"

# Create temporary files
TMP_USAGE=$(mktemp)
TMP_EMAIL=$(mktemp)

# Clean up temporary files on exit
trap 'rm -f "$TMP_USAGE" "$TMP_EMAIL"; log_message "INFO" "Finished disk usage check"' EXIT

# Create exclude pattern for grep
EXCLUDE_PATTERN=""
for mount in $EXCLUDE_LIST; do
  EXCLUDE_PATTERN="${EXCLUDE_PATTERN:-}|^${mount}"
done
EXCLUDE_PATTERN=${EXCLUDE_PATTERN#|}

# Get disk usage and filter out excluded filesystems
if [ -n "$EXCLUDE_PATTERN" ]; then
  df -h | grep -v "$EXCLUDE_PATTERN" | grep -v "^Filesystem" > "$TMP_USAGE"
else
  df -h | grep -v "^Filesystem" > "$TMP_USAGE"
fi

# Check if any filesystems exceed threshold
ALERT_NEEDED=0
while read -r line; do
  # Extract usage percentage without % sign
  USAGE_PCT=$(echo "$line" | awk '{print $5}' | sed 's/%//')
  
  if [ "$USAGE_PCT" -ge "$THRESHOLD" ]; then
    FILESYSTEM=$(echo "$line" | awk '{print $1}')
    MOUNTPOINT=$(echo "$line" | awk '{print $6}')
    USAGE_HUMAN=$(echo "$line" | awk '{print $3}')
    TOTAL_HUMAN=$(echo "$line" | awk '{print $2}')
    
    log_message "WARNING" "Disk usage alert: ${MOUNTPOINT} (${FILESYSTEM}) is at ${USAGE_PCT}% (${USAGE_HUMAN}/${TOTAL_HUMAN})"
    ALERT_NEEDED=1
  fi
done < "$TMP_USAGE"

# Send email alert if needed
if [ $ALERT_NEEDED -eq 1 ]; then
  # Create email body
  {
    echo "DISK USAGE ALERT for $(hostname -f)"
    echo "The following filesystems have exceeded the ${THRESHOLD}% threshold:"
    echo ""
    echo "FILESYSTEM                SIZE      USED     AVAIL    USE%     MOUNTED ON"
    echo "--------------------------------------------------------------------------------"
    
    while read -r line; do
      USAGE_PCT=$(echo "$line" | awk '{print $5}' | sed 's/%//')
      if [ "$USAGE_PCT" -ge "$THRESHOLD" ]; then
        echo "$line"
      fi
    done < "$TMP_USAGE"
    
    echo ""
    echo "--------------------------------------------------------------------------------"
    echo "Full disk usage report:"
    echo ""
    cat "$TMP_USAGE"
    echo ""
    echo "This alert was generated at $(date) by the disk monitoring script."
  } > "$TMP_EMAIL"

  # Set email subject
  if [ -z "$CUSTOM_SUBJECT" ]; then
    SUBJECT="[ALERT] High Disk Usage on $(hostname -s) ($(date '+%Y-%m-%d %H:%M'))"
  else
    SUBJECT="$CUSTOM_SUBJECT"
  fi

  # Send email using mail command
  if command -v mail >/dev/null 2>&1; then
    log_message "INFO" "Sending email alert to ${EMAIL_TO}"
    mail -s "$SUBJECT" -r "$EMAIL_FROM" "$EMAIL_TO" < "$TMP_EMAIL"
    if [ $? -eq 0 ]; then
      log_message "INFO" "Email alert sent successfully"
    else
      log_message "ERROR" "Failed to send email alert"
    fi
  else
    log_message "ERROR" "Mail command not found, cannot send alert"
    # Write to syslog as a fallback
    logger -p user.warning -t disk-monitor "Disk usage alert: Threshold exceeded on one or more filesystems. Check $LOG_FILE for details."
  fi
  
  # Exit with status 1 to indicate alert was triggered
  exit 1
else
  log_message "INFO" "No filesystems exceeded threshold of ${THRESHOLD}%"
  # Exit with status 0 to indicate normal operation
  exit 0
fi`,
      readme: `# Linux-DiskMonitor.sh

## Overview

This script monitors disk usage on Linux systems and sends email alerts when filesystem usage exceeds a specified threshold. It's designed to be run from cron and provides early warning before filesystems reach capacity.

## Features

- Customizable threshold percentage (default: 85%)
- Email alerts with detailed filesystem information
- Exclude specific filesystems from monitoring
- Comprehensive logging
- POSIX-compliant for maximum compatibility
- Exit codes for integration with monitoring systems

## Parameters

| Parameter | Description |
|-----------|-------------|
| -t PERCENT | Set alert threshold percentage (default: 85) |
| -e EMAIL | Set recipient email address |
| -f FROM | Set sender email address |
| -x LIST | Set filesystems to exclude (space-separated, quoted) |
| -s SUBJECT | Set custom email subject |
| -l LOGFILE | Set custom log file location |
| -h | Display help message |

## Usage Examples

\`\`\`bash
# Basic usage with default settings
./Linux-DiskMonitor.sh

# Custom threshold and email recipient
./Linux-DiskMonitor.sh -t 90 -e admin@example.com

# Exclude multiple filesystems
./Linux-DiskMonitor.sh -x "/tmp /dev/shm /backup"

# Custom log location and email settings
./Linux-DiskMonitor.sh -l /var/log/custom/disk.log -s "URGENT: Disk Space Low"
\`\`\`

## Cron Setup

Add to crontab to run every hour:

\`\`\`
0 * * * * /path/to/Linux-DiskMonitor.sh -t 85 -e it-team@example.com
\`\`\`

## Requirements

- Bash shell
- df command (part of coreutils)
- mail command for sending alerts

## Exit Codes

- 0: No filesystems exceeded threshold
- 1: One or more filesystems exceeded threshold
- Other: Script error`,
      author: "Linux Systems Team",
      version: "1.3.0",
      compatibleOS: "Linux (all distributions)",
      requiredModules: "mail (mailutils or mailx package)",
      dependencies: "coreutils",
      license: "MIT",
    },
    tags: ["Linux", "Monitoring", "Disk Usage", "Alert", "Sysadmin"],
    highlights: ["POSIX", "Cron", "Alert"],
    version: {
      version: "1.3.0",
      changes: "Added support for custom email subjects and improved logging",
    }
  },
  {
    script: {
      key: "SH-02",
      language: "Bash",
      title: "Linux-BaselineAudit.sh",
      summary: "Generates CIS-style audit of SSH, firewall, users/groups.",
      code: `#!/bin/bash
# Linux-BaselineAudit.sh
# Generates CIS-style security audit of SSH, firewall, and users/groups
# Author: Security Compliance Team
# Version: 2.1.0

# Exit on error
set -e

# Script variables
AUDIT_DATE=$(date +"%Y-%m-%d")
HOSTNAME=$(hostname -f)
OUTPUT_DIR="/tmp/security-audit-$AUDIT_DATE"
REPORT_PREFIX="security-audit-$HOSTNAME"
CSV_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.csv"
JSON_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.json"
TXT_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.txt"
VERBOSE=0
JSON_ONLY=0
CSV_ONLY=0
TXT_ONLY=0
CHECKS_TOTAL=0
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Functions for output formatting
print_banner() {
  echo "============================================================"
  echo "  Linux Security Baseline Audit Tool"
  echo "  Version: 2.1.0"
  echo "  Date: $AUDIT_DATE"
  echo "  Host: $HOSTNAME"
  echo "============================================================"
  echo ""
}

log_verbose() {
  if [ $VERBOSE -eq 1 ]; then
    echo "[INFO] $1"
  fi
}

log_info() {
  echo "[INFO] $1"
}

log_warning() {
  echo "[WARNING] $1"
}

log_error() {
  echo "[ERROR] $1" >&2
}

# Initialize audit results arrays
declare -a CHECK_IDS
declare -a CHECK_DESCRIPTIONS
declare -a CHECK_CATEGORIES
declare -a CHECK_RESULTS
declare -a CHECK_VALUES
declare -a CHECK_NOTES

# Function to add check result
add_check_result() {
  local id="$1"
  local description="$2"
  local category="$3"
  local result="$4"
  local value="$5"
  local note="$6"
  
  CHECK_IDS+=("$id")
  CHECK_DESCRIPTIONS+=("$description")
  CHECK_CATEGORIES+=("$category")
  CHECK_RESULTS+=("$result")
  CHECK_VALUES+=("$value")
  CHECK_NOTES+=("$note")
  
  CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
  case "$result" in
    "PASS") CHECKS_PASSED=$((CHECKS_PASSED + 1)) ;;
    "FAIL") CHECKS_FAILED=$((CHECKS_FAILED + 1)) ;;
    "WARNING") CHECKS_WARNING=$((CHECKS_WARNING + 1)) ;;
  esac
}

# Function to escape JSON strings
escape_json_string() {
  local s="$1"
  s="${s//\\/\\\\}"  # Escape backslashes
  s="${s//\"/\\\"}"  # Escape double quotes
  s="${s//	/\\t}"    # Escape tabs
  s="${s//\n/\\n}"   # Escape newlines
  s="${s//\r/\\r}"   # Escape carriage returns
  echo "$s"
}

# Function to escape CSV values
escape_csv_value() {
  local s="$1"
  # If value contains comma, double quote, or newline, wrap in quotes and escape internal quotes
  if [[ "$s" =~ [,"\n] ]]; then
    s="${s//\"/\"\"}"  # Double up any quotes
    s="\"$s\""         # Wrap in quotes
  fi
  echo "$s"
}

# Parse command line arguments
while getopts "o:jctvh" opt; do
  case $opt in
    o) OUTPUT_DIR="$OPTARG" ;;
    j) JSON_ONLY=1 ;;
    c) CSV_ONLY=1 ;;
    t) TXT_ONLY=1 ;;
    v) VERBOSE=1 ;;
    h)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  -o DIR    Set output directory (default: /tmp/security-audit-YYYY-MM-DD)"
      echo "  -j        Output JSON format only"
      echo "  -c        Output CSV format only"
      echo "  -t        Output text format only"
      echo "  -v        Verbose output"
      echo "  -h        Display this help message"
      exit 0
      ;;
    \?) log_error "Invalid option: -$OPTARG"; exit 1 ;;
  esac
done

# Create output directory
mkdir -p "$OUTPUT_DIR"
if [ ! -d "$OUTPUT_DIR" ]; then
  log_error "Failed to create output directory: $OUTPUT_DIR"
  exit 1
fi

# Update output paths based on directory
CSV_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.csv"
JSON_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.json"
TXT_OUTPUT="$OUTPUT_DIR/$REPORT_PREFIX.txt"

# Display banner if not in JSON/CSV only mode
if [ $JSON_ONLY -eq 0 ] && [ $CSV_ONLY -eq 0 ] && [ $TXT_ONLY -eq 0 ]; then
  print_banner
fi

log_verbose "Starting security audit..."
log_verbose "Output will be saved to: $OUTPUT_DIR"

# Check for root/sudo
if [ "$(id -u)" -ne 0 ]; then
  log_warning "This script is not running as root. Some checks may fail due to insufficient permissions."
  add_check_result "PERM-1" "Script running with root permissions" "Permissions" "WARNING" "Non-root user" "Some checks may be incomplete"
else
  add_check_result "PERM-1" "Script running with root permissions" "Permissions" "PASS" "Root user" "Full system access available"
fi

#
# 1. SSH Configuration Checks
#
log_verbose "Checking SSH configuration..."

if [ -f "/etc/ssh/sshd_config" ]; then
  # Check SSH Protocol version
  SSH_PROTOCOL=$(grep -i "^Protocol" /etc/ssh/sshd_config | awk '{print $2}')
  if [ -z "$SSH_PROTOCOL" ]; then
    SSH_PROTOCOL="2" # Default is 2 if not specified in newer OpenSSH
    add_check_result "SSH-1" "SSH Protocol Version" "SSH" "PASS" "$SSH_PROTOCOL" "Using default value (Protocol 2)"
  elif [ "$SSH_PROTOCOL" -eq 2 ]; then
    add_check_result "SSH-1" "SSH Protocol Version" "SSH" "PASS" "$SSH_PROTOCOL" "Protocol 2 configured"
  else
    add_check_result "SSH-1" "SSH Protocol Version" "SSH" "FAIL" "$SSH_PROTOCOL" "Protocol should be set to 2"
  fi
  
  # Check PermitRootLogin
  SSH_PERMIT_ROOT=$(grep -i "^PermitRootLogin" /etc/ssh/sshd_config | awk '{print $2}')
  if [ -z "$SSH_PERMIT_ROOT" ]; then
    SSH_PERMIT_ROOT="yes" # Default is yes if not specified
    add_check_result "SSH-2" "SSH Root Login" "SSH" "FAIL" "$SSH_PERMIT_ROOT" "Using default value (permitted)"
  elif [[ "$SSH_PERMIT_ROOT" == "no" || "$SSH_PERMIT_ROOT" == "prohibit-password" ]]; then
    add_check_result "SSH-2" "SSH Root Login" "SSH" "PASS" "$SSH_PERMIT_ROOT" "Root login restricted"
  else
    add_check_result "SSH-2" "SSH Root Login" "SSH" "FAIL" "$SSH_PERMIT_ROOT" "Root login should be disabled"
  fi
  
  # Check PasswordAuthentication
  SSH_PASSWORD_AUTH=$(grep -i "^PasswordAuthentication" /etc/ssh/sshd_config | awk '{print $2}')
  if [ -z "$SSH_PASSWORD_AUTH" ]; then
    SSH_PASSWORD_AUTH="yes" # Default is yes if not specified
    add_check_result "SSH-3" "SSH Password Authentication" "SSH" "WARNING" "$SSH_PASSWORD_AUTH" "Using default value (enabled)"
  elif [ "$SSH_PASSWORD_AUTH" == "no" ]; then
    add_check_result "SSH-3" "SSH Password Authentication" "SSH" "PASS" "$SSH_PASSWORD_AUTH" "Password authentication disabled"
  else
    add_check_result "SSH-3" "SSH Password Authentication" "SSH" "WARNING" "$SSH_PASSWORD_AUTH" "Consider disabling password authentication"
  fi
else
  log_verbose "SSH configuration file not found, skipping SSH checks"
  add_check_result "SSH-0" "SSH Configuration File Exists" "SSH" "FAIL" "Not found" "Could not find /etc/ssh/sshd_config"
fi

#
# 2. Firewall Checks
#
log_verbose "Checking firewall configuration..."

# Check if firewall is installed and running
if command -v ufw >/dev/null 2>&1; then
  UFW_STATUS=$(ufw status | grep "Status:" | awk '{print $2}')
  if [ "$UFW_STATUS" == "active" ]; then
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "PASS" "UFW active" "UFW firewall is enabled"
  else
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "FAIL" "UFW inactive" "UFW is installed but not active"
  fi
elif command -v firewalld >/dev/null 2>&1; then
  FIREWALLD_STATUS=$(systemctl is-active firewalld)
  if [ "$FIREWALLD_STATUS" == "active" ]; then
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "PASS" "firewalld active" "firewalld is enabled"
  else
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "FAIL" "firewalld inactive" "firewalld is installed but not active"
  fi
elif command -v iptables >/dev/null 2>&1; then
  IPTABLES_RULES=$(iptables -L -n | grep -v "Chain" | grep -v "target" | grep -c .)
  if [ "$IPTABLES_RULES" -gt 0 ]; then
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "PASS" "iptables configured" "iptables has rules configured"
  else
    add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "FAIL" "iptables empty" "No iptables rules found"
  fi
else
  add_check_result "FW-1" "Firewall Installed and Running" "Firewall" "FAIL" "No firewall" "No firewall software detected"
fi

#
# 3. User and Group Checks
#
log_verbose "Checking users and groups..."

# Check for users with UID 0 other than root
UID0_USERS=$(awk -F: '($3 == 0 && $1 != "root") {print $1}' /etc/passwd)
if [ -z "$UID0_USERS" ]; then
  add_check_result "USR-1" "Users with UID 0" "Users" "PASS" "Only root" "No users with UID 0 other than root"
else
  add_check_result "USR-1" "Users with UID 0" "Users" "FAIL" "$UID0_USERS" "Users with UID 0 other than root detected"
fi

# Check accounts with empty passwords
EMPTY_PASSWORDS=$(awk -F: '($2 == "" || $2 == "!!" || $2 == "!") {print $1}' /etc/shadow 2>/dev/null || echo "Could not check (insufficient permissions)")
if [ "$EMPTY_PASSWORDS" == "Could not check (insufficient permissions)" ]; then
  add_check_result "USR-2" "Accounts with Empty Passwords" "Users" "WARNING" "Unknown" "Could not check (insufficient permissions)"
elif [ -z "$EMPTY_PASSWORDS" ]; then
  add_check_result "USR-2" "Accounts with Empty Passwords" "Users" "PASS" "None" "No accounts with empty passwords detected"
else
  add_check_result "USR-2" "Accounts with Empty Passwords" "Users" "FAIL" "$EMPTY_PASSWORDS" "Accounts with empty passwords detected"
fi

#
# 4. System Configuration Checks
#
log_verbose "Checking system configuration..."

# Check if SELinux/AppArmor is enabled
if command -v getenforce >/dev/null 2>&1; then
  SELINUX_STATUS=$(getenforce 2>/dev/null)
  if [ "$SELINUX_STATUS" == "Enforcing" ]; then
    add_check_result "SYS-1" "Mandatory Access Control" "System" "PASS" "SELinux Enforcing" "SELinux is enabled and enforcing"
  elif [ "$SELINUX_STATUS" == "Permissive" ]; then
    add_check_result "SYS-1" "Mandatory Access Control" "System" "WARNING" "SELinux Permissive" "SELinux is in permissive mode"
  else
    add_check_result "SYS-1" "Mandatory Access Control" "System" "FAIL" "SELinux Disabled" "SELinux is disabled"
  fi
elif command -v aa-status >/dev/null 2>&1; then
  APPARMOR_STATUS=$(aa-status --enabled 2>/dev/null; echo $?)
  if [ "$APPARMOR_STATUS" -eq 0 ]; then
    add_check_result "SYS-1" "Mandatory Access Control" "System" "PASS" "AppArmor Enabled" "AppArmor is enabled"
  else
    add_check_result "SYS-1" "Mandatory Access Control" "System" "FAIL" "AppArmor Disabled" "AppArmor is disabled"
  fi
else
  add_check_result "SYS-1" "Mandatory Access Control" "System" "FAIL" "None" "No MAC system (SELinux/AppArmor) detected"
fi

#
# Generate Reports
#
log_verbose "Generating reports..."

# Generate CSV report
if [ $JSON_ONLY -eq 0 ] && [ $TXT_ONLY -eq 0 ]; then
  log_verbose "Writing CSV report to $CSV_OUTPUT"
  echo "ID,Category,Description,Result,Value,Notes" > "$CSV_OUTPUT"
  for i in "${!CHECK_IDS[@]}"; do
    echo "$(escape_csv_value "${CHECK_IDS[$i]}"),$(escape_csv_value "${CHECK_CATEGORIES[$i]}"),$(escape_csv_value "${CHECK_DESCRIPTIONS[$i]}"),$(escape_csv_value "${CHECK_RESULTS[$i]}"),$(escape_csv_value "${CHECK_VALUES[$i]}"),$(escape_csv_value "${CHECK_NOTES[$i]}")" >> "$CSV_OUTPUT"
  done
fi

# Generate JSON report
if [ $CSV_ONLY -eq 0 ] && [ $TXT_ONLY -eq 0 ]; then
  log_verbose "Writing JSON report to $JSON_OUTPUT"
  cat > "$JSON_OUTPUT" << EOF
{
  "audit_info": {
    "hostname": "$(escape_json_string "$HOSTNAME")",
    "date": "$(escape_json_string "$AUDIT_DATE")",
    "version": "2.1.0"
  },
  "summary": {
    "total_checks": $CHECKS_TOTAL,
    "passed": $CHECKS_PASSED,
    "failed": $CHECKS_FAILED,
    "warnings": $CHECKS_WARNING
  },
  "checks": [
EOF

  for i in "${!CHECK_IDS[@]}"; do
    comma=","
    if [ $i -eq $((${#CHECK_IDS[@]} - 1)) ]; then
      comma=""
    fi
    cat >> "$JSON_OUTPUT" << EOF
    {
      "id": "$(escape_json_string "${CHECK_IDS[$i]}")",
      "category": "$(escape_json_string "${CHECK_CATEGORIES[$i]}")",
      "description": "$(escape_json_string "${CHECK_DESCRIPTIONS[$i]}")",
      "result": "$(escape_json_string "${CHECK_RESULTS[$i]}")",
      "value": "$(escape_json_string "${CHECK_VALUES[$i]}")",
      "notes": "$(escape_json_string "${CHECK_NOTES[$i]}")"
    }$comma
EOF
  done

  cat >> "$JSON_OUTPUT" << EOF
  ]
}
EOF
fi

# Generate text report
if [ $JSON_ONLY -eq 0 ] && [ $CSV_ONLY -eq 0 ]; then
  log_verbose "Writing text report to $TXT_OUTPUT"
  {
    print_banner

    echo "SUMMARY:"
    echo "  Total checks: $CHECKS_TOTAL"
    echo "  Passed:       $CHECKS_PASSED"
    echo "  Failed:       $CHECKS_FAILED"
    echo "  Warnings:     $CHECKS_WARNING"
    echo ""
    
    echo "RESULTS:"
    echo "-----------------------------------------------------------------------------"
    printf "%-8s %-10s %-25s %-8s %-20s\n" "ID" "CATEGORY" "DESCRIPTION" "RESULT" "VALUE"
    echo "-----------------------------------------------------------------------------"
    
    for i in "${!CHECK_IDS[@]}"; do
      result_color=""
      end_color=""
      if [ -t 1 ]; then  # If writing to terminal
        case "${CHECK_RESULTS[$i]}" in
          "PASS") result_color="\e[32m"; end_color="\e[0m" ;;
          "FAIL") result_color="\e[31m"; end_color="\e[0m" ;;
          "WARNING") result_color="\e[33m"; end_color="\e[0m" ;;
        esac
      fi
      printf "%-8s %-10s %-25s ${result_color}%-8s${end_color} %-20s\n" "${CHECK_IDS[$i]}" "${CHECK_CATEGORIES[$i]}" "${CHECK_DESCRIPTIONS[$i]}" "${CHECK_RESULTS[$i]}" "${CHECK_VALUES[$i]}"
      if [ -n "${CHECK_NOTES[$i]}" ]; then
        printf "        Note: %s\n" "${CHECK_NOTES[$i]}"
      fi
    done
    
    echo "-----------------------------------------------------------------------------"
    echo ""
    echo "Report generated on $(date)"
    echo "Full reports saved to: $OUTPUT_DIR"
  } > "$TXT_OUTPUT"
  
  # Display text report if not in JSON/CSV only mode
  if [ $JSON_ONLY -eq 0 ] && [ $CSV_ONLY -eq 0 ] && [ $TXT_ONLY -eq 0 ]; then
    cat "$TXT_OUTPUT"
  fi
fi

# Print summary if not already displayed
if [ $JSON_ONLY -eq 1 ] || [ $CSV_ONLY -eq 1 ] || [ $TXT_ONLY -eq 1 ]; then
  log_info "Audit complete. Results:"
  log_info "  Total checks: $CHECKS_TOTAL"
  log_info "  Passed:       $CHECKS_PASSED"
  log_info "  Failed:       $CHECKS_FAILED"
  log_info "  Warnings:     $CHECKS_WARNING"
  
  if [ $JSON_ONLY -eq 1 ]; then
    log_info "JSON report saved to: $JSON_OUTPUT"
  elif [ $CSV_ONLY -eq 1 ]; then
    log_info "CSV report saved to: $CSV_OUTPUT"
  elif [ $TXT_ONLY -eq 1 ]; then
    log_info "Text report saved to: $TXT_OUTPUT"
  fi
else
  log_info "Reports saved to: $OUTPUT_DIR"
fi

# Set exit code based on results
if [ $CHECKS_FAILED -gt 0 ]; then
  exit 2  # Critical issues found
elif [ $CHECKS_WARNING -gt 0 ]; then
  exit 1  # Warnings found
else
  exit 0  # All checks passed
fi`,
      readme: `# Linux-BaselineAudit.sh

## Overview

This script performs a Center for Internet Security (CIS) style security audit of Linux systems. It checks SSH configuration, firewall settings, user/group security, and system hardening. The results are output in multiple formats for easy integration with compliance reporting tools.

## Features

- Comprehensive security checks based on CIS benchmarks
- SSH configuration analysis
- Firewall detection and rule verification
- User and group security assessment
- System security configuration evaluation
- Multiple output formats (JSON, CSV, text)
- Configurable output location
- Exit codes for integration with RMM tools

## Parameters

| Parameter | Description |
|-----------|-------------|
| -o DIR | Set output directory (default: /tmp/security-audit-YYYY-MM-DD) |
| -j | Output JSON format only |
| -c | Output CSV format only |
| -t | Output text format only |
| -v | Verbose output |
| -h | Display help message |

## Usage Examples

\`\`\`bash
# Basic usage
./Linux-BaselineAudit.sh

# Custom output directory
./Linux-BaselineAudit.sh -o /var/reports

# Generate JSON output only
./Linux-BaselineAudit.sh -j

# Verbose output with CSV format
./Linux-BaselineAudit.sh -v -c
\`\`\`

## Output Files

The script generates the following output files:

- security-audit-hostname.txt - Human-readable report
- security-audit-hostname.json - JSON-formatted data for automation
- security-audit-hostname.csv - CSV data for spreadsheet import

## Exit Codes

- 0: All checks passed
- 1: Warnings found
- 2: Critical issues found
- Other: Script error

## Requirements

- Bash shell
- Root/sudo access for complete results (will run with limited functionality as non-root)`,
      author: "Security Compliance Team",
      version: "2.1.0",
      compatibleOS: "Linux (all distributions)",
      requiredModules: "None",
      dependencies: "Root/sudo access for full functionality",
      license: "MIT",
    },
    tags: ["Linux", "Security", "Compliance", "Audit", "CIS", "Hardening"],
    highlights: ["CIS", "CSV/JSON", "RMM"],
    version: {
      version: "2.1.0",
      changes: "Added support for firewalld detection and improved JSON output formatting",
    }
  }
];
