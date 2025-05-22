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

# Function code would be here in the full script
Write-Host "Applying security baseline with level: $SecurityLevel"`,
      readme: `# Win-SecBaseline.ps1

> **⚠️ Warning:** This script modifies system security settings. Always test in a non-production environment first.

## Overview

This script applies security baselines to Windows devices according to Center for Internet Security (CIS) benchmarks. It hardens the local security settings, configures firewall rules, and updates TLS settings to improve the overall security posture of the system.

## Features

- Configures account lockout policy to prevent brute force attacks
- Enables Windows Firewall and sets default inbound action to Block
- Disables insecure SSL/TLS protocols and enables TLS 1.2
- Outputs results in JSON format for easy integration with monitoring tools
- Supports audit mode to check compliance without making changes`,
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

# Function code would be here in the full script
Write-Host "Resetting Windows Update components..."`,
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
- Option to force restart after completion`,
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
# Version: 1.0.0

# Configuration variables
THRESHOLD=85                             # Default alert threshold percentage
EMAIL_TO="it-alerts@example.com"         # Default email recipient

# Function code would be here in the full script
echo "Checking disk usage with threshold: $THRESHOLD%"`,
      readme: `# Linux-DiskMonitor.sh

## Overview

This Bash script monitors disk usage across all mounted filesystems and sends email alerts when usage exceeds defined thresholds. It's designed to run as a cron job for proactive disk space management.

## Features

- Monitors all mounted filesystems (or specific ones if configured)
- Configurable threshold for alerts (default: 85%)
- Email notifications with detailed disk usage information
- Supports exclusion of specific mount points
- Maintains a log of checks and alerts
- Customizable output formats (text, CSV, JSON)`,
      author: "Linux Systems Team",
      version: "1.0.0",
      compatibleOS: "Linux (All distributions)",
      requiredModules: "mailutils (for email alerts)",
      dependencies: "Access to mail server for notifications",
      license: "MIT",
    },
    tags: ["Linux", "Monitoring", "Disk Space", "Email Alerts", "Cron"],
    highlights: ["Portable", "Configurable", "Multiple Output Formats"],
    version: {
      version: "1.0.0",
      changes: "Initial release with basic monitoring and alert functionality",
    }
  }
];