import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      icon: path.join(__dirname, "../public/flint.png"),
      backgroundThrottling: false,
    },
  });

  // win.webContents.on("did-finish-load", () => {
  //   win.webContents.setZoomFactor(0.9); // Set zoom ke 90%
  // });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173"); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html")); // Production build
  }
}

app.whenReady().then(() => {
  lyricsCache();
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

function lyricsCache() {
  const db = new Database(path.join(app.getPath("userData"), "flint.db"));

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS lyrics (
      song_id TEXT PRIMARY KEY,
      lyrics TEXT
    )
  `,
  ).run();

  // Listener buat insert/update lirik
  ipcMain.handle("save-lyrics", (event, songId, lyrics) => {
    const stmt = db.prepare(`
      INSERT INTO lyrics (song_id, lyrics)
      VALUES (?, ?)
      ON CONFLICT(song_id) DO UPDATE SET lyrics=excluded.lyrics
    `);
    stmt.run(songId, lyrics);
  });

  // Listener buat ambil lirik
  ipcMain.handle("get-lyrics", (event, songId) => {
    const stmt = db.prepare(`SELECT lyrics FROM lyrics WHERE song_id = ?`);
    const row = stmt.get(songId);
    return row ? row.lyrics : null;
  });

  // Listener buat edit lirik (spesifik untuk update)
  ipcMain.handle("edit-lyrics", (event, songId, lyrics) => {
    const stmt = db.prepare(`UPDATE lyrics SET lyrics = ? WHERE song_id = ?`);
    const result = stmt.run(lyrics, songId);
    return result.changes > 0; // Return true if a row was updated
  });

  // Listener buat delete lirik
  ipcMain.handle("delete-lyrics", (event, songId) => {
    const stmt = db.prepare(`DELETE FROM lyrics WHERE song_id = ?`);
    const result = stmt.run(songId);
    return result.changes > 0; // Return true if a row was deleted
  });

  // Listener buat ambil semua lirik
  ipcMain.handle("get-all-lyrics", () => {
    const stmt = db.prepare(`SELECT * FROM lyrics`);
    return stmt.all();
  });
}
