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
      summary: "Gathers essential system information and health metrics for quick diagnostics.",
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
  }
];