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

    _init: function (metadata, orientation, panel_height, instance_id) {
        Applet.TextApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this._updateLoop = 0;

        // Default settings
        this.drivePath = "/";
        this.updateInterval = 60;
        this.showPercentage = true;
        this.showDriveName = true;
        this.showFreeText = false;
        this.customLabel = "";
        this.lowSpaceWarningEnabled = true;
        this.lowSpaceThreshold = 10;
        this.lowSpaceColor = "#ff0000ff";
        this.openFileManagerOnClick = true;

        // Settings menu
        this.settings = new Settings.AppletSettings(this, metadata.uuid, instance_id);
        this.settings.bind("drive-path", "drivePath", () => this._onSettingsChanged());
        this.settings.bind("update-interval", "updateInterval", () => this._onSettingsChanged());
        this.settings.bind("show-percentage", "showPercentage", () => this._onSettingsChanged());
        this.settings.bind("show-drive-name", "showDriveName", () => this._onSettingsChanged());
        this.settings.bind("show-free-text", "showFreeText", () => this._onSettingsChanged());
        this.settings.bind("custom-label", "customLabel", () => this._onSettingsChanged());
        this.settings.bind("low-space-warning-enabled", "lowSpaceWarningEnabled", () => this._onSettingsChanged());
        this.settings.bind("low-space-threshold", "lowSpaceThreshold", () => this._onSettingsChanged());
        this.settings.bind("low-space-color", "lowSpaceColor", () => this._onSettingsChanged());

        this.set_applet_tooltip("Simple Storage Monitor");
        this.set_applet_label("Loading...");

        // Context menu
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);
        this._createContextMenu();

        this._startUpdateLoop();
    },

    _onSettingsChanged: function () {
        if (this.drivePath && this.drivePath.startsWith("file://")) {
            this.drivePath = GLib.filename_from_uri(this.drivePath, null)[0];
        }

        this._startUpdateLoop();
    },

    _startUpdateLoop: function () {
        this._stopUpdateLoop();
        this._update();
        this._updateLoop = Mainloop.timeout_add_seconds(this.updateInterval, () => {
            this._update();
            return true;
        });
    },

    _stopUpdateLoop: function () {
        if (this._updateLoop > 0) {
            Mainloop.source_remove(this._updateLoop);
            this._updateLoop = 0;
        }
    },

    _createContextMenu: function () {
        let configureItem = new PopupMenu.PopupMenuItem("Configure...");
        configureItem.connect('activate', () => this.settings.openSettings());
        this.menu.addMenuItem(configureItem);

        let selectFolderItem = new PopupMenu.PopupMenuItem("Select Folder...");
        selectFolderItem.connect('activate', () => this.settings.openSettings());
        this.menu.addMenuItem(selectFolderItem);
    },

    _getDriveSpace: function () {
        try {
            let path = this.drivePath || "/";
            if (path.startsWith("file://")) {
                path = GLib.filename_from_uri(path, null)[0];
            }

            const [ok, out, err, exit] = GLib.spawn_command_line_sync(
                "df -h " + GLib.shell_quote(path)
            );

            if (!ok || exit !== 0) return { available: "Error", used: "", total: "", percent: 0 };

            const output = imports.byteArray.toString(out);
            const lines = output.split("\n");
            if (lines.length < 2) return { available: "N/A", used: "", total: "", percent: 0 };

            const parts = lines[1].trim().split(/\s+/);
            if (parts.length < 5) return { available: "N/A", used: "", total: "", percent: 0 };

            return {
                total: parts[1],
                used: parts[2],
                available: parts[3],
                percent: parseInt(parts[4].replace("%", ""))
            };
        } catch (e) {
            return { available: "Error", used: "", total: "", percent: 0 };
        }
    },

    _getDriveName: function () {
        let path = this.drivePath || "/";
        if (path.startsWith("file://")) path = GLib.filename_from_uri(path, null)[0];

        path = path.replace(/\/$/, "");
        if (path === "/") return "Root";

        const parts = path.split("/");
        return parts.pop() || parts.pop() || "Root";
    },

    _update: function () {

        const space = this._getDriveSpace();

        const name = this.customLabel.trim() !== "" ?
            this.customLabel.trim() :
            (this.showDriveName ? this._getDriveName() : "");

        let label = name ? name + ": " : "";
        label += space.available;

        if (this.showFreeText) label += " free";
        if (this.showPercentage && !isNaN(space.percent)) label += " (" + space.percent + "%)";

        this.set_applet_label(label);

        // Low space color
        let freePercent = 100 - space.percent;
        if (this.lowSpaceWarningEnabled && freePercent < this.lowSpaceThreshold) {
            this.actor.style = `color: ${this.lowSpaceColor};`;
        } else {
            this.actor.style = "";
        }

        // Tooltip
        let displayPath = this.drivePath;
        if (displayPath.startsWith("file://"))
            displayPath = GLib.filename_from_uri(displayPath, null)[0];

        this.set_applet_tooltip(
            `${displayPath}\nTotal: ${space.total}\nUsed: ${space.used}\nAvailable: ${space.available}`
        );
    },

    on_applet_clicked: function () {
        if (this.openFileManagerOnClick) {
            let path = this.drivePath;
            if (path.startsWith("file://")) path = GLib.filename_from_uri(path, null)[0];
            Util.spawnCommandLine("xdg-open " + GLib.shell_quote(path));
        }
    },

    on_applet_middle_clicked: function () {
        let path = this.drivePath;
        if (path.startsWith("file://")) path = GLib.filename_from_uri(path, null)[0];
        Util.spawnCommandLine("xdg-open " + GLib.shell_quote(path));
    },

    on_applet_context_menu: function () {
        if (this.menu) this.menu.toggle();
    },

    on_applet_removed_from_panel: function () {
        this._stopUpdateLoop();
        if (this.settings) this.settings.finalize();
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new DriveSpaceApplet(metadata, orientation, panel_height, instance_id);
}
