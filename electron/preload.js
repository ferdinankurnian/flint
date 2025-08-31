const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveLyrics: (songId, lyrics) => ipcRenderer.invoke('save-lyrics', songId, lyrics),
  getLyrics: (songId) => ipcRenderer.invoke('get-lyrics', songId),
  editLyrics: (songId, lyrics) => ipcRenderer.invoke('edit-lyrics', songId, lyrics),
  deleteLyrics: (songId) => ipcRenderer.invoke('delete-lyrics', songId),
  getAllLyrics: () => ipcRenderer.invoke('get-all-lyrics'),
});