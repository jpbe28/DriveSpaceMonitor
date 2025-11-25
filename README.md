# Drive Space Monitor Applet

A Cinnamon panel applet that displays the available space on a specific mounted drive.

## Features

- Shows available disk space in human-readable format (e.g., "50G free")
- Displays usage percentage
- Updates automatically every 60 seconds
- Click to open the drive in file manager
- Detailed tooltip showing total, used, and available space

## Installation

1. Copy the applet directory to your Cinnamon applets folder:
   ```bash
   cp -r /mnt/Media4/Work/apps/DiskSpaceApplet ~/.local/share/cinnamon/applets/drive-space@diskmonitor
   ```

2. Reload Cinnamon:
   - Press `Alt+F2`, type `r`, and press Enter
   - Or restart Cinnamon from the system settings

3. Add the applet to your panel:
   - Right-click on the panel
   - Select "Add applets to the panel"
   - Find "Drive Space Monitor" and click "Add"

## Configuration

The applet includes a built-in settings UI. To configure it:

1. Right-click on the applet in the panel
2. Select "Configure..." or "Settings"
3. Adjust the following settings:
   - **Drive Path**: Enter the mount point of the drive to monitor (e.g., `/mnt/Media4`, `/mnt/driverName`)
   - **Update Interval**: How often to update the disk space (in seconds, default: 60)
   - **Show Percentage**: Toggle to show/hide the usage percentage

### Configuration Options

- **Drive Path**: The mount point of the drive to monitor (e.g., `/mnt/Media4`, `/mnt/driverName`, `/home`)
- **Update Interval**: Update interval in seconds (default: 60, range: 5-3600)
- **Show Percentage**: Whether to display the usage percentage next to the available space (default: enabled)

## Development

This applet is written in JavaScript using the Cinnamon applet API. The main files are:

- `metadata.json`: Applet metadata and configuration
- `applet.js`: Main applet logic
- `stylesheet.css`: Styling for the applet

## Requirements

- Linux Mint with Cinnamon desktop environment
- Cinnamon version 3.0 or higher

