# Drive Space Monitor Applet

A Cinnamon panel applet that displays the available space on a selected folder or mounted drive.

![Drive Space Monitor Applet](demo.png)

## Features

- Shows available disk space in human-readable format (e.g., "50G free")
- Displays usage percentage (configurable: used or free)
- Updates automatically at configurable intervals (default: 60 seconds)
- Click to open the folder/drive in file manager (configurable)
- Detailed tooltip showing total, used, and available space
- Custom label support to override drive name
- Low space warning with customizable threshold and color
- Multiple instances supported (monitor different drives simultaneously)
- Configurable display options (drive name, "free" text, percentage type)

## Installation

### Method 1: Install from Cinnamon Spices (Easiest)

Install it directly from the Cinnamon applet menu:

1. Right-click on your Cinnamon panel
2. Select "Add applets to the panel"
3. Click on "Download" tab (or "Get more online")
4. Search for "Drive Space Monitor"
5. Click "Install" next to the applet
6. The applet will be automatically installed and ready to use

### Method 2: Using the Installation Script

1. Run the installation script:
   ```bash
   cd /path/to/DriveSpaceMonitor
   chmod +x install.sh
   ./install.sh
   ```

### Method 3: Manual Installation

1. Copy the applet directory to your Cinnamon applets folder:
   ```bash
   cp -r /path/to/DriveSpaceMonitor ~/.local/share/cinnamon/applets/drive-space@diskmonitor
   ```

2. Reload Cinnamon:
   - Press `Alt+F2`, type `r`, and press Enter
   - Or restart Cinnamon from the system settings

3. Add the applet to your panel:
   - Right-click on the panel
   - Select "Add applets to the panel"
   - Find "Drive Space Monitor" and click "Add"

**Note:** For Methods 2 and 3, you'll need to download the applet files manually (from GitHub releases or by cloning the repository).

## Configuration

The applet includes a built-in settings UI. To configure it:

1. Right-click on the applet in the panel
2. Select "Configure..." or "Settings"
3. Adjust the settings as needed

### Configuration Options

- **Mount point or folder to monitor**: Select the mounted drive or folder you want to monitor (e.g., `/mnt/Media4`, `/home`, `/`)
- **Update interval**: How often to update the disk space information (default: 60 seconds, range: 5-3600)
- **Show percentage**: Display the percentage next to the available space (default: enabled)
- **Percentage type**: Choose whether to show used or free percentage (default: used)
- **Show drive name**: Display the drive name before the free space (default: enabled)
- **Custom label**: Set a custom label that overrides the drive name. Leave empty to use drive name if enabled above
- **Show 'free' text**: Display the word "free" after the available space (default: enabled)
- **Enable low space warning**: Change text color when available space is below threshold (default: enabled)
- **Low space threshold**: Warning color will be applied when available space is below this percentage (default: 10%, range: 1-50%)
- **Low space warning color**: Color to display when available space is below threshold (default: red #ff0000)
- **Open file manager on click**: When enabled, clicking the applet opens the file manager to the monitored folder. When disabled, clicking opens settings (default: enabled)

## Usage Tips

- **Multiple Instances**: You can add multiple instances of this applet to monitor different drives/folders simultaneously
- **Middle Click**: Middle-clicking the applet always opens the file manager, regardless of the "Open file manager on click" setting
- **Right Click**: Right-clicking opens the context menu with configuration options
- **Low Space Warning**: When enabled, the applet text will change color when available space drops below the threshold

## Development

This applet is written in JavaScript using the Cinnamon applet API. The main files are:

- `metadata.json`: Applet metadata and configuration
- `applet.js`: Main applet logic
- `stylesheet.css`: Styling for the applet
- `settings-schema.json`: Settings UI definition
- `install.sh`: Installation script

## Requirements

- Any Linux distribution with Cinnamon desktop environment installed
  - Linux Mint (most common)
  - Fedora with Cinnamon
  - Arch Linux with Cinnamon
  - Debian/Ubuntu with Cinnamon
  - openSUSE with Cinnamon
  - Any other distribution with Cinnamon
- Cinnamon version 3.0 or higher (tested up to 6.0)

## License

MIT License - See LICENSE file for details

## Author

JP (jpbe28)

