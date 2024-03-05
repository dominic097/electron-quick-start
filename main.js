// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron')
const { autoUpdater } = require('electron-updater');
const _package = require("./package.json");

const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


autoUpdater.setFeedURL({
  provider: 'github',
  repo: 'electron-quick-start',
  owner: 'dominic097',
  token: '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',
  url:"https://github.com/dominic097/electron-quick-start/releases/latest",
  private: true, // Set to false if your repo is public
});

autoUpdater.autoDownload = false; // Disable auto download to control the update process
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'debug'; // Set log level to debug
autoUpdater.allowPrerelease = true; 

// Log events from autoUpdater
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  autoUpdater.downloadUpdate();

});

autoUpdater.on('update-not-available', () => {
  console.log('No update available.');
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err.message);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  // Perform actions after the update has been downloaded, e.g., show a prompt to install
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: 'A new version has been downloaded. Restart the application to apply the updates.',
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});


autoUpdater.checkForUpdatesAndNotify();

setTimeout(()=>{
  dialog.showMessageBox({
    type: 'info',
    message: `version : ${_package.version}`
  })
  },2000);
