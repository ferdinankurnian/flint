interface Window {
  electron: {
    saveLyrics: (songId: string, lyrics: any) => Promise<any>;
    getLyrics: (songId: string) => Promise<any>;
    editLyrics: (songId: string, lyrics: any) => Promise<any>;
  }
}
