#!/bin/bash

# Installation script for Simple Disk Monitor Applet

APPLET_NAME="simple-disk-monitor@jpbe28"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/.local/share/cinnamon/applets/$APPLET_NAME"

echo "Installing Simple Disk Monitor Applet..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy applet files
cp "$SOURCE_DIR/metadata.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/applet.js" "$TARGET_DIR/"
cp "$SOURCE_DIR/stylesheet.css" "$TARGET_DIR/"
cp "$SOURCE_DIR/settings-schema.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/icon.png" "$TARGET_DIR/" 2>/dev/null || true

echo "Applet installed successfully!"
echo ""
echo "To use the applet:"
echo "1. Reload Cinnamon (Alt+F2, type 'r', press Enter)"
echo "2. Right-click on the panel and select 'Add applets to the panel'"
echo "3. Find 'Simple Disk Monitor' and click 'Add'"
echo ""
echo "To configure the drive path:"
echo "  Right-click on the applet and select 'Configure...'"
echo "  Enter the drive path (e.g., /mnt/Media4, /mnt/driverName)"

