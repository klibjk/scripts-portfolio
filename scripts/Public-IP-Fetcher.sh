#!/bin/bash

# Script to get the public IP address using an external API and parse JSON

echo "--------------------------------------------------"
echo "Public IP Address Fetcher - $(date)"
echo "--------------------------------------------------"

API_URL="https://ipinfo.io/json" # A common public IP API that returns JSON

echo "Fetching public IP from $API_URL..."

response=$(curl -sL "$API_URL")
curl_exit_code=$?

if [ $curl_exit_code -ne 0 ]; then
    echo "ERROR: curl command failed with exit code $curl_exit_code. Could not reach $API_URL."
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "WARNING: jq command could not be found. Please install jq to parse JSON."
    echo "Raw response: $response"
    fallback_ip=$(echo "$response" | grep -oP '"ip": "\K[^"]+')
    if [[ -n "$fallback_ip" ]]; then
        echo "INFO: Fallback Public IP: $fallback_ip (extracted with grep)"
    else
        echo "ERROR: Could not extract IP using fallback method."
    fi
    exit 1
fi

public_ip=$(echo "$response" | jq -r '.ip')
city=$(echo "$response" | jq -r '.city')
region=$(echo "$response" | jq -r '.region')
country=$(echo "$response" | jq -r '.country')
org=$(echo "$response" | jq -r '.org')

if [[ -z "$public_ip" || "$public_ip" == "null" ]]; then
    echo "ERROR: Could not parse IP address from the API response."
    echo "Raw response: $response"
else
    echo "OK: Public IP Address: $public_ip"
    echo "Location: $city, $region, $country"
    echo "Organization: $org"
fi

echo "--------------------------------------------------"
echo "Fetch Complete."
echo "--------------------------------------------------"