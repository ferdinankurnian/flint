const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveLyrics: (songId, lyrics) => ipcRenderer.invoke('save-lyrics', songId, lyrics),
  getLyrics: (songId) => ipcRenderer.invoke('get-lyrics', songId),
});
