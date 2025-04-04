const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electron', {
  // saveLrc: (song_id, lrcContent) => ipcRenderer.invoke('save-lrc', song_id, lrcContent),
  // getLrc: (song_id) => ipcRenderer.invoke('get-lrc', song_id),
  // getAllLyrics: () => ipcRenderer.invoke('get-all-lyrics'),
  // deleteLrc: (song_id) => ipcRenderer.invoke('delete-lrc', song_id)
});
