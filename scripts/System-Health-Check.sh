#!/bin/bash

# Script to gather basic system information and health metrics

echo "--------------------------------------------------"
echo "System Health Check - $(date)"
echo "--------------------------------------------------"

# --- OS Information ---
echo -e "\n--- Operating System ---"
echo "OS: $(uname -s)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
if [[ "$(uname)" == "Linux" ]]; then
    if [ -f /etc/os-release ]; then
        source /etc/os-release
        echo "Distribution: $PRETTY_NAME"
    fi
elif [[ "$(uname)" == "Darwin" ]]; then
    echo "macOS Version: $(sw_vers -productVersion)"
fi

# --- Hostname & Uptime ---
echo -e "\n--- Hostname & Uptime ---"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"

# --- CPU Usage (Top 5 processes) ---
echo -e "\n--- CPU Usage (Top 5 processes) ---"
if [[ "$(uname)" == "Linux" ]]; then
    ps aux --sort=-%cpu | head -n 6
elif [[ "$(uname)" == "Darwin" ]]; then
    ps aux -r | head -n 6
fi

# --- Memory Usage ---
echo -e "\n--- Memory Usage ---"
if [[ "$(uname)" == "Linux" ]]; then
    free -h
elif [[ "$(uname)" == "Darwin" ]]; then
    echo "Total Memory: $(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 )) GB"
    vm_stat
fi

# --- Disk Usage ---
echo -e "\n--- Disk Usage ---"
df -h | head -n 10

# --- Network Configuration ---
echo -e "\n--- Network Configuration ---"
if command -v ip &> /dev/null; then
    ip addr show | grep -E '^[0-9]+: |inet ' | head -n 10
elif command -v ifconfig &> /dev/null; then
    ifconfig | grep -E '^[a-z]|inet ' | head -n 10
fi

# --- Recent System Errors (Linux) ---
if [[ "$(uname)" == "Linux" ]]; then
    echo -e "\n--- Recent System Errors (Last 5 from syslog) ---"
    if [ -f /var/log/syslog ]; then
        grep -i "error\|critical\|fail" /var/log/syslog | tail -n 5
    elif [ -f /var/log/messages ]; then
        grep -i "error\|critical\|fail" /var/log/messages | tail -n 5
    else
        echo "System log not accessible or not found."
    fi
fi

echo -e "\n--------------------------------------------------"
echo "Health Check Complete."
echo "--------------------------------------------------"