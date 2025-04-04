import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from "url";
import { app } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'flint.db');
console.log("Database path:", dbPath); // Debugging

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS lyrics (
    song_id TEXT PRIMARY KEY,
    lrc TEXT
  )
`);

const saveLrc = (song_id, lrcContent) => {
  const stmt = db.prepare(`
    INSERT INTO lyrics (song_id, lrc)
    VALUES (?, ?)
    ON CONFLICT(song_id) DO UPDATE SET lrc = excluded.lrc
  `);
  stmt.run(song_id, lrcContent);
};

const getLrc = (song_id) => {
  const stmt = db.prepare('SELECT lrc FROM lyrics WHERE song_id = ?');
  const row = stmt.get(song_id);
  return row ? row.lrc : null;
};

const getAllLyrics = () => {
  const stmt = db.prepare('SELECT * FROM lyrics');
  return stmt.all();
};

const deleteLrc = (song_id) => {
  const stmt = db.prepare('DELETE FROM lyrics WHERE song_id = ?');
  stmt.run(song_id);
};

// ✅ Pakai export default buat bisa di-import di ESM
export default { saveLrc, getLrc, getAllLyrics, deleteLrc };
