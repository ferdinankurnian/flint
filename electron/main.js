import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
// import db from "../src/db.js"; // Import database module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      icon: path.join(__dirname, "public/flint.png"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomFactor(0.9); // Set zoom ke 90%
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173"); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html")); // Production build
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// // Event buat nyimpen lirik
// ipcMain.handle('save-lrc', (event, song_id, lrcContent) => {
//   db.saveLrc(song_id, lrcContent);
// });

// // Event buat ngambil lirik
// ipcMain.handle('get-lrc', (event, song_id) => {
//   return db.getLrc(song_id);
// });

// // Event buat ngambil semua lirik buat settings
// ipcMain.handle('get-all-lyrics', () => {
//   return db.getAllLyrics();
// });

// // Event buat hapus lirik
// ipcMain.handle('delete-lrc', (event, song_id) => {
//   db.deleteLrc(song_id);
// });