#!/bin/bash

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
past_epoch=$(date -d "$TIME_WINDOW_MINUTES minutes ago" +%s 2>/dev/null || date -v-${TIME_WINDOW_MINUTES}M +%s) # GNU || BSD

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
        ip_address=$(echo "$line" | grep -oP 'from \K[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' || echo "unknown_ip")
        if [[ ! " ${offending_ips[@]} " =~ " ${ip_address} " ]]; then
            offending_ips+=("$ip_address")
        fi
    fi
done

# --- Output Results ---
echo -e "\n--- Results for the last $TIME_WINDOW_MINUTES minutes ---"
if [ "$failed_attempts" -ge "$FAILED_ATTEMPT_THRESHOLD" ]; then
    echo "ALERT: $failed_attempts failed login attempts detected!"
    echo "Potential source IPs (if found): ${offending_ips[*]}"
    echo "Consider checking the log file ($LOG_FILE) for details and potentially blocking IPs."
else
    echo "OK: No significant failed login activity detected (found $failed_attempts attempts)."
fi

echo -e "\n--------------------------------------------------"
echo "Monitoring Complete."
echo "--------------------------------------------------"