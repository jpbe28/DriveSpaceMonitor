const Applet = imports.ui.applet;
const Settings = imports.ui.settings;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const St = imports.gi.St;

function DriveSpaceApplet(metadata, orientation, panel_height, instance_id) {
    this._init(metadata, orientation, panel_height, instance_id);
}

DriveSpaceApplet.prototype = {
    __proto__: Applet.TextApplet.prototype,

    _init: function(metadata, orientation, panel_height, instance_id) {
        Applet.TextApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        
        this.metadata = metadata;
        this.instance_id = instance_id;
        
        // Initialize settings
        this.settings = new Settings.AppletSettings(this, metadata.uuid, instance_id);
        
        // Initialize properties with defaults (will be overridden by bind if saved values exist)
        this.drivePath = "/";
        this.updateInterval = 60;
        this.showPercentage = true;
        this.percentageType = "used";
        this.showDriveName = true;
        this.showFreeText = true;
        this.customLabel = "";
        this.lowSpaceWarningEnabled = true;
        this.lowSpaceThreshold = 10;
        this.lowSpaceColor = "#ff0000";
        this.openFileManagerOnClick = true;
        
        // Bind settings with callbacks - this will load saved values and override defaults
        let self = this;
        this.settings.bind("drive-path", "drivePath", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("update-interval", "updateInterval", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("show-percentage", "showPercentage", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("percentage-type", "percentageType", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("show-drive-name", "showDriveName", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("show-free-text", "showFreeText", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("custom-label", "customLabel", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("low-space-warning-enabled", "lowSpaceWarningEnabled", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("low-space-threshold", "lowSpaceThreshold", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("low-space-color", "lowSpaceColor", function() {
            self._onSettingsChanged();
        });
        this.settings.bind("open-file-manager-on-click", "openFileManagerOnClick", function() {
            // No need to update on this change
        });
        
        this.set_applet_tooltip("Drive Space Monitor");
        this.set_applet_label("Loading...");
        
        // Create context menu
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);
        
        // Add menu items
        this._createContextMenu();
        
        // Start monitoring
        this._update();
    },

    _createContextMenu: function() {
        // Configure menu item - opens settings dialog with file chooser
        let configureItem = new PopupMenu.PopupMenuItem("Configure...");
        let self = this;
        configureItem.connect('activate', function() {
            self.settings.openSettings();
        });
        this.menu.addMenuItem(configureItem);
        
        // Select Folder menu item - also opens settings
        let selectFolderItem = new PopupMenu.PopupMenuItem("Select Folder...");
        selectFolderItem.connect('activate', function() {
            self.settings.openSettings();
        });
        this.menu.addMenuItem(selectFolderItem);
    },

    _onSettingsChanged: function() {
        // Handle file chooser URI if needed
        if (this.drivePath && this.drivePath.startsWith("file://")) {
            this.drivePath = GLib.filename_from_uri(this.drivePath, null)[0];
        }
        // Restart update cycle when settings change
        this._update();
    },

    _getDriveSpace: function() {
        try {
            // Ensure we have a valid path
            let path = this.drivePath || "/";
            if (path.startsWith("file://")) {
                path = GLib.filename_from_uri(path, null)[0];
            }
            
            // Use df command to get disk space for the path
            // df will show the filesystem info for whatever filesystem contains this path
            let [ok, out, err, exit] = GLib.spawn_command_line_sync(
                "df -h " + GLib.shell_quote(path)
            );
            
            if (!ok || exit !== 0) {
                return { available: "Error", used: "", total: "", percent: 0 };
            }
            
            let output = imports.byteArray.toString(out);
            let lines = output.split("\n");
            
            if (lines.length < 2) {
                return { available: "N/A", used: "", total: "", percent: 0 };
            }
            
            // Parse df output
            // Format: Filesystem Size Used Avail Use% Mounted on
            let parts = lines[1].trim().split(/\s+/);
            
            if (parts.length < 5) {
                return { available: "N/A", used: "", total: "", percent: 0 };
            }
            
            let total = parts[1];
            let used = parts[2];
            let available = parts[3];
            let percent = parseInt(parts[4].replace("%", ""));
            
            return {
                available: available,
                used: used,
                total: total,
                percent: percent
            };
        } catch (e) {
            return { available: "Error", used: "", total: "", percent: 0 };
        }
    },

    _formatBytes: function(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return size.toFixed(1) + " " + units[unitIndex];
    },

    _getDriveName: function() {
        // Extract drive name from path
        let path = this.drivePath || "/";
        if (path.startsWith("file://")) {
            path = GLib.filename_from_uri(path, null)[0];
        }
        
        // Remove trailing slash
        path = path.replace(/\/$/, "");
        
        // Get the last component of the path
        if (path === "/") {
            return "Root";
        }
        
        let parts = path.split("/");
        let name = parts[parts.length - 1];
        
        // If empty, try the second-to-last part
        if (!name || name === "") {
            name = parts[parts.length - 2] || "Root";
        }
        
        return name;
    },

    _update: function() {
        let space = this._getDriveSpace();
        
        // Build label
        let label = "";
        
        // Determine what label to show
        // Custom label always overrides drive name if set
        let displayLabel = "";
        if (this.customLabel && this.customLabel.trim() !== "") {
            // Use custom label if provided (overrides drive name)
            displayLabel = this.customLabel.trim();
        } else if (this.showDriveName) {
            // Use drive name only if custom label is empty and drive name is enabled
            displayLabel = this._getDriveName();
        }
        
        // Add label with colon if we have a label
        if (displayLabel !== "") {
            label += displayLabel + ": ";
        }
        
        // Add available space
        label += space.available;
        
        // Add "free" text if enabled
        if (this.showFreeText) {
            label += " free";
        }
        
        // Add percentage if enabled and available
        if (this.showPercentage && space.percent > 0) {
            let percentValue;
            if (this.percentageType === "free") {
                // Show free percentage
                percentValue = 100 - space.percent;
            } else {
                // Show used percentage (default)
                percentValue = space.percent;
            }
            label += " (" + percentValue + "%)";
        }
        
        this.set_applet_label(label);
        
        // Apply low space warning color if enabled
        let availablePercent = 100 - space.percent;
        if (this.lowSpaceWarningEnabled && availablePercent < this.lowSpaceThreshold) {
            // Apply warning color
            this.actor.style = "color: " + this.lowSpaceColor + ";";
        } else {
            // Reset to default color
            this.actor.style = "";
        }
        
        // Update tooltip with more details
        let displayPath = this.drivePath || "/";
        if (displayPath.startsWith("file://")) {
            displayPath = GLib.filename_from_uri(displayPath, null)[0];
        }
        let tooltip = "Path: " + displayPath + "\n";
        tooltip += "Total: " + space.total + "\n";
        tooltip += "Used: " + space.used + "\n";
        tooltip += "Available: " + space.available;
        
        this.set_applet_tooltip(tooltip);
        
        // Schedule next update
        let self = this;
        Mainloop.timeout_add_seconds(this.updateInterval, function() {
            self._update();
            return false; // Don't repeat automatically
        });
    },

    on_applet_clicked: function(event) {
        // Left click behavior depends on setting
        if (this.openFileManagerOnClick) {
            // Open file manager to the path
            let path = this.drivePath || "/";
            if (path.startsWith("file://")) {
                path = GLib.filename_from_uri(path, null)[0];
            }
            Util.spawnCommandLine("xdg-open " + GLib.shell_quote(path));
        } else {
            // Open settings dialog
            if (this.settings) {
                this.settings.openSettings();
            }
        }
    },

    on_applet_middle_clicked: function(event) {
        // Middle click opens file manager to the path
        let path = this.drivePath || "/";
        if (path.startsWith("file://")) {
            path = GLib.filename_from_uri(path, null)[0];
        }
        Util.spawnCommandLine("xdg-open " + GLib.shell_quote(path));
    },

    on_applet_context_menu: function(event) {
        // Show context menu on right-click
        if (this.menu) {
            this.menu.toggle();
        }
    },

    on_applet_removed_from_panel: function() {
        // Clean up settings when applet is removed
        if (this.settings) {
            this.settings.finalize();
        }
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new DriveSpaceApplet(metadata, orientation, panel_height, instance_id);
}

