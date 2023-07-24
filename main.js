const { app, BrowserWindow, globalShortcut } = require("electron");
var server = require("../wep-api/server");
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 670,
    fullscreen: true,
    icon: `file://${__dirname}/dist/assets/logo.png`,
  });
  win.setFullScreen(true);
  //win.webContents.openDevTools();
  globalShortcut.register("ESC", () => {
    win.setFullScreen(false);
  });
  win.loadURL(`file://${__dirname}/dist/index.html`);

  win.setMenu(null);
  // uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on("closed", function () {
    win = null;
  });
}

// Create window on electron intialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});


