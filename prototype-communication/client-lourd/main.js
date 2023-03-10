const {
    app,
    BrowserWindow
  } = require('electron')
  const url = require("url");
  const path = require("path");

  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']=true
  let appWindow

  function initWindow() {
    appWindow = new BrowserWindow({
      // fullscreen: true,
      height: 800,
      width: 1000,
      backgroundColor: '#bebebe',
      webPreferences: {
        nodeIntegration: true
      }
    })
    console.log(app.getAppPath());


    // Electron Build Path
    appWindow.loadURL(
      url.format({
        //pathname: path.join(__dirname, `/src/index.html`),
        pathname: path.join(__dirname, `/dist/client-lourd/index.html`),
        // pathname: path.join(__dirname, `/src/index.html`),
        protocol: "file:",
        slashes: true
      })
    );

    //appWindow.setMenuBarVisibility(false)

    // Initialize the DevTools.
    appWindow.webContents.openDevTools()

    appWindow.on('closed', function () {
      appWindow = null
    })

    appWindow.webContents.on('did-fail-load', () => {
      appWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/dist/client-lourd/index.html'),
        protocol: 'file:',
        slashes: true
      }));
      // REDIRECT TO FIRST WEBPAGE AGAIN
        });
  }

  app.on('ready', initWindow)

  // Close when all windows are closed.
  app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (win === null) {
      initWindow()
    }
  })
