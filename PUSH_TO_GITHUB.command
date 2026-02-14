#!/bin/bash
cd "$(dirname "$0")"

clear
echo "========================================================"
echo "       PRISM 2.0 - GITHUB DEPLOYMENT WIZARD"
echo "========================================================"
echo ""
echo "STEP 1: Open your browser to: https://github.com/new"
echo "STEP 2: Name the repository: prism"
echo "STEP 3: Click 'Create repository'"
echo "STEP 4: Copy the HTTPS URL from the next page."
echo "        (It looks like: https://github.com/YOUR_NAME/prism.git)"
echo ""
echo "========================================================"

# Loop until we get a VALID GitHub URL
valid_url=false
repo_url=""

while [ "$valid_url" = false ]; do
    echo "PLEASE PASTE THE URL BELOW (starts with https://github.com...)"
    read -p "> " repo_url

    # Check if it starts with https://github.com
    if [[ "$repo_url" == https://github.com* ]]; then
        valid_url=true
    else
        echo ""
        echo "❌ ERROR: That doesn't look like a GitHub URL."
        echo "It should start with 'https://github.com' and end with '.git' (optional)."
        echo "Please try again."
        echo "--------------------------------------------------------"
    fi
done

echo ""
echo "✅ Valid URL detected: $repo_url"
echo "🚀 Deploying Prism 2.0..."
echo "--------------------------------------------------------"

# Reset origin
git remote remove origin 2>/dev/null
git remote add origin "$repo_url"

# FORCE PUSH to override any "Initialize with README" conflicts
echo "Pushing code to main branch (Overwriting remote if needed)..."
git branch -M main
git push -f -u origin main

echo ""
echo "========================================================"
echo "       SUCCESS! DEPLOYMENT COMPLETE."
echo "========================================================"
read -p "Press Enter to exit..."
