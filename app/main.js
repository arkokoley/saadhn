(function(scope) {
    "use strict";

    var app = require('app');
    var AppMenu = require('menu');
    var MenuItem = require('menu-item');
    var AppTray = require('tray');
    var fileSystem = require('fs');
    var NativeImage = require('native-image');
    var BrowserWindow = require('browser-window');

    var join = require('path').join;
    const globalShortcut = require('electron').globalShortcut

    global.onlyOSX = function(callback) {
        if (process.platform === 'darwin') {
            return Function.bind.apply(callback, this, [].slice.call(arguments, 0));
        }
        return function() {};
    };

    global.onlyLinux = function(callback) {
        if (process.platform === 'linux') {
            return Function.bind.apply(callback, this, [].slice.call(arguments, 0));
        }
        return function() {};
    };

    global.onlyWin = function(callback) {
        if (process.platform === 'win32' || process.platform === 'win64') {
            return Function.bind.apply(callback, this, [].slice.call(arguments, 0));
        }
        return function() {};
    };


    global.config = {
        defaultSettings: {
            width: 1000,
            height: 720,
            thumbSize: 0
        },

        currentSettings: {},

        init() {
            config.loadConfiguration();
        },

        loadConfiguration() {
            var settingsFile = app.getPath('userData') +"/settings.json";
            try {
                var data = fileSystem.readFileSync(settingsFile);
                config.currentSettings = JSON.parse(data);
            } catch (e) {
                config.currentSettings = config.defaultSettings;
            }
        },

        applyConfiguration() {
            saadhn.window.webContents.on('dom-ready', function (event, two) {
                var noAvatar = '.chat-avatar{display: none}';
                var noPreview = '.chat-secondary .chat-status{z-index: -999;}';

                var thumbSize = '.image-thumb { width: '+ config.currentSettings.thumbSize + 'px  !important;' +
                'height: '+ config.currentSettings.thumbSize + 'px !important;}' +
                '.image-thumb img.image-thumb-body { width: auto !important;' +
                'height: '+ config.currentSettings.thumbSize + 'px !important;}';

                if (config.currentSettings.hideAvatars) {
                    this.insertCSS(noAvatar);
                }
                if (config.currentSettings.hidePreviews){
                    this.insertCSS(noPreview);
                }

                if (config.currentSettings.thumbSize) {
                    this.insertCSS(thumbSize);
                }
            });

            if (config.get("useProxy")) {
                var session = saadhn.window.webContents.session;
                var httpProxy = config.get("httpProxy");
                var httpsProxy = config.get("httpsProxy") || httpProxy;
                if(httpProxy) {
                  session.setProxy("http="+ httpProxy +";https=" + httpsProxy, function(){});
                }
            }
        },

        saveConfiguration() {
            fileSystem.writeFileSync(app.getPath('userData') + "/settings.json", JSON.stringify(config.currentSettings) , 'utf-8');
        },

        get (key) {
            return config.currentSettings[key];
        },

        set (key, value) {
            config.currentSettings[key] = value;
        },

        unSet (key) {
            if (config.currentSettings.hasOwnProperty(key)) {
                delete config.currentSettings[key];
            }
        }
    };

    global.saadhn = {
        init() {
            saadhn.createMenu();
            saadhn.createTray();

            saadhn.clearCache();
            config.init();
            saadhn.openWindow();
            config.applyConfiguration();
        },

        createMenu() {
            saadhn.menu =
                AppMenu.buildFromTemplate(require('./menu'));
                AppMenu.setApplicationMenu(saadhn.menu);
        },

        createTray() {
            saadhn.tray = new AppTray(__dirname + '/assets/icon.png');

            saadhn.tray.on('clicked', () => {
                saadhn.window.show();
            });

            saadhn.tray.setToolTip('Saavn Desktop');
        },

        clearCache() {
            try {
                fileSystem.unlinkSync(app.getPath('appData') + '/Application Cache/Index');
            } catch(e) {}
        },

        openWindow() {
            saadhn.window = new BrowserWindow({
                "y": config.get("posY"),
                "x": config.get("posX"),
                "width": config.get("width"),
                "height": config.get("height"),
                "minWdth": 600,
                "minHeight": 600,
                "icon": __dirname + 'assets/icon.png',
                //"type": "toolbar",
                "title": "Saadhn",
                "webPreferences": {
                  "nodeIntegration": false,
                  "webSecurity": false,
                  "sandbox": true,
                  "preload": join(__dirname, 'js', 'injected.js')
                }
            });

            saadhn.window.loadURL('https://www.jiosaavn.com', {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.52 Safari/537.36'
            });

            // Bind Media Shortcuts - This wouldn't have been required if the
            // client side code listened to these keys along with KEY_NEXT, KEY_SPACE etc.
            // For now trigger functionality by remapping the keys
            globalShortcut.register('MediaPlayPause', function () {
              saadhn.window.webContents.sendInputEvent({
                type: 'keyDown',
                keyCode: 'Space'
              })
            })

            globalShortcut.register('MediaNextTrack', function () {
              saadhn.window.webContents.sendInputEvent({
                type: 'keyDown',
                keyCode: 'Right'
              })
            })

            globalShortcut.register('MediaPreviousTrack', function () {
              saadhn.window.webContents.sendInputEvent({
                type: 'keyDown',
                keyCode: 'Left'
              })
            })

            if (config.get("useProxy")) {
                var session = saadhn.window.webContents.session;
                var httpProxy = config.get("httpProxy");
                var httpsProxy = config.get("httpsProxy") || httpProxy;
                if (httpProxy) {
                    session.setProxy("http="+ httpProxy +";https=" + httpsProxy, () => {});
                }
            }

            saadhn.window.show();

            saadhn.window.on('page-title-updated', onlyOSX((event, title) => {
                var count = title.match(/\((\d+)\)/);
                    count = count ? count[1] : '';

                app.dock.setBadge(count);
                // if (parseInt(count) > 0)
                //     app.dock.bounce('informational');
            }));

            // Navigation restricted to mainWindow only
            var handleUrl = function (e, url) {
              e.preventDefault()

              // Opening saadhn urls
              if (url.replace('https://', '').replace('http://', '').indexOf('www.jiosaavn.com') == 0)
                saadhn.window.loadURL(url)
              else
                // Open External URLs in the default web browser
                require('shell').openExternal(url)
            }
            saadhn.window.webContents.on("will-navigate", handleUrl);
            saadhn.window.webContents.on("new-window", handleUrl);

            saadhn.window.on('close', onlyOSX((e) => {
                if (saadhn.window.forceClose !== true) {
                    e.preventDefault();
                    saadhn.window.hide();
                }
            }));

            saadhn.window.on("close", function(){
                if (settings.window) {
                    settings.window.close();
                    settings.window = null;
                }

                // save the window position
                config.set("posX", this.getBounds().x);
                config.set("posY", this.getBounds().y);
                config.set("width", this.getBounds().width);
                config.set("height", this.getBounds().height);
                config.saveConfiguration();
            });

            app.on('before-quit', onlyOSX(() => {
                saadhn.window.forceClose = true;
                globalShortcut.unregisterAll();
            }));

            app.on('before-quit', onlyLinux(() => {
                saadhn.window.forceClose = true;
                globalShortcut.unregisterAll();
            }));

            app.on('activate-with-no-open-windows', onlyOSX(() => {
                saadhn.window.show();
            }));

            app.on('window-all-closed', onlyWin(() => {
                app.quit();
                globalShortcut.unregisterAll();
            }));
        }
    };

    global.settings = {
        init() {
            // if there is already one instance of the window created show that one
            if (settings.window){
                settings.window.show();
            } else {
                settings.openWindow();
                settings.createMenu();
            }
        },

        createMenu() {
            settings.menu = new AppMenu();
            settings.menu.append(new MenuItem(
                {
                    label: "close",
                    visible: false,
                    accelerator: "esc",
                    click() {settings.window.close();}
                })
            );
            settings.menu.append(new MenuItem(
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+CmdOrCtrl+O',
                    visible: false,
                    click() {  settings.window.toggleDevTools(); }
                })
            );
            settings.menu.append(new MenuItem(
                {
                    label: 'Reload settings view',
                    accelerator: 'CmdOrCtrl+r',
                    visible: false,
                    click() { settings.window.reload();}
                })
            );
            settings.window.setMenu(settings.menu);
            settings.window.setMenuBarVisibility(false);
        },

        openWindow() {
            settings.window = new BrowserWindow(
                {
                    "width": 500,
                    "height": 500,
                    "resizable": true,
                    "center": true,
                    "frame": true,
                    "webPreferences": {
                      "nodeIntegration": true,
                      "sandbox": true,
                    }
                }
            );

            settings.window.loadURL("file://" + __dirname + "/html/settings.html");
            settings.window.show();

            settings.window.on("close", () => {
                settings.window = null;
            });
        }
    };

    app.on('ready', () => {
        saadhn.init();
    });
})(this);
