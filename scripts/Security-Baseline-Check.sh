#!/bin/bash

# Script to check some basic security baseline settings

echo "--------------------------------------------------"
echo "Security Baseline Check - $(date)"
echo "--------------------------------------------------"

# --- Check if UFW (Uncomplicated Firewall) is active (Linux specific) ---
if [[ "$(uname)" == "Linux" ]] && command -v ufw &> /dev/null; then
    echo -e "\n--- Firewall (UFW) Status ---"
    ufw_status=$(sudo ufw status | head -n 1)
    if [[ "$ufw_status" == "Status: active" ]]; then
        echo "OK: UFW is active."
    else
        echo "WARNING: UFW is inactive. Consider enabling it: sudo ufw enable"
    fi
elif [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\n--- Firewall (pf) Status ---"
    pf_status=$(sudo pfctl -s info | grep "Status:" | awk '{print $2}')
    if [[ "$pf_status" == "Enabled" ]]; then
        echo "OK: macOS Packet Filter (pf) is enabled."
    else
        echo "WARNING: macOS Packet Filter (pf) is disabled. Check System Settings > Network > Firewall."
    fi
else
    echo -e "\n--- Firewall Status (UFW/pf) ---"
    echo "INFO: UFW check skipped (not Linux) or pf check skipped (not macOS or pfctl not found)."
fi

# --- Check for listening SSH port (common target) ---
echo -e "\n--- SSH Port Status ---"
if ss -tulnp | grep ':22' | grep -q 'LISTEN'; then
    echo "OK: SSH daemon appears to be listening on port 22."
    # Further checks could include disallowing root login, password auth, etc.
elif nc -z localhost 22; then # Fallback for macOS or systems without ss
     echo "OK: SSH daemon appears to be listening on port 22."
else
    echo "INFO: SSH daemon does not appear to be listening on port 22, or port is firewalled."
fi

# --- Check for passwordless sudo (potential risk) ---
echo -e "\n--- Passwordless Sudo Check ---"
if sudo -nl | grep -q '(ALL) NOPASSWD: ALL'; then
    echo "WARNING: Found user(s) with passwordless sudo access for ALL commands. Review sudoers file."
else
    echo "OK: No users found with global passwordless sudo for ALL commands (basic check)."
fi

# --- macOS Specific: Gatekeeper Status ---
if [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\n--- macOS Gatekeeper Status ---"
    gatekeeper_status=$(spctl --status)
    if [[ "$gatekeeper_status" == "assessments enabled" ]]; then
        echo "OK: Gatekeeper is enabled."
    else
        echo "WARNING: Gatekeeper is disabled ($gatekeeper_status). Consider enabling: sudo spctl --master-enable"
    fi
fi

# --- macOS Specific: FileVault Status ---
if [[ "$(uname)" == "Darwin" ]]; then
    echo -e "\n--- macOS FileVault Status ---"
    filevault_status=$(fdesetup status)
    if [[ "$filevault_status" == "FileVault is On."* ]]; then
        echo "OK: FileVault is On."
    else
        echo "WARNING: FileVault is Off. Consider enabling for full disk encryption."
    fi
fi

echo -e "\n--------------------------------------------------"
echo "Security Baseline Check Complete. Review findings."
echo "--------------------------------------------------"