# Scripts Directory

This directory contains all the system administration and automation scripts in the David Povis Script Portfolio.

## Script Categories

### 1. System Health Monitoring
- **System-Health-Check.sh** - Comprehensive system health monitoring for Linux/macOS
- **System-Health-Check.ps1** - Windows system health and performance monitoring

### 2. Security Baseline Auditing  
- **Security-Baseline-Check.sh** - Security configuration verification for Linux/macOS
- **Security-Baseline-Check.ps1** - Windows security baseline compliance checking

### 3. Log Monitoring & Alerting
- **Failed-Login-Monitor.sh** - SSH authentication log monitoring for failed login attempts
- **Failed-Login-Monitor.ps1** - Windows Event Log monitoring for failed logon events (Event ID 4625)

### 4. REST API Integration
- **Public-IP-Fetcher.sh** - Public IP and geolocation data retrieval using REST APIs
- **Public-IP-Fetcher.ps1** - PowerShell-native REST API integration for IP geolocation

## Usage Instructions

### Linux/macOS Scripts (.sh)
1. Make the script executable: `chmod +x script-name.sh`
2. Run the script: `./script-name.sh`
3. Some scripts may require sudo privileges: `sudo ./script-name.sh`

### Windows Scripts (.ps1)
1. Open PowerShell (as Administrator for some scripts)
2. Set execution policy if needed: `Set-ExecutionPolicy RemoteSigned -Scope Process`
3. Run the script: `.\script-name.ps1`

## Prerequisites

### For Bash Scripts
- Standard Unix/Linux utilities (grep, awk, date, etc.)
- curl for API scripts
- jq for JSON parsing (recommended)
- sudo access for system monitoring and security scripts

### For PowerShell Scripts  
- PowerShell 5.1 or higher
- Administrator privileges for comprehensive system access
- Windows 10/11 or Windows Server 2016+

## Professional Features

- **Cross-Platform Compatibility**: Each script type available for both Unix-like and Windows systems
- **Error Handling**: Comprehensive error checking and user-friendly output
- **Configurable Parameters**: Customizable thresholds and settings
- **Production Ready**: Following best practices for system administration use
- **Detailed Documentation**: Each script includes inline comments and usage instructions

---

*These scripts demonstrate professional system administration expertise and are suitable for production environments.*