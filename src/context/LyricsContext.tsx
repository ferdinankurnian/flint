import { createContext, useContext, useState, ReactNode } from "react";

export interface Lyric {
    text: string;
    time?: number;
    inactive?: boolean;
    instrumental?: boolean;
    endMarker?: boolean;
}

type LyricsContextType = {
  lyrics: Lyric[];
  setLyrics: (lyrics: Lyric[]) => void;
  activeLyricIndex: number;
  setActiveLyricIndex: (index: number) => void;
};

const LyricsContext = createContext<LyricsContextType | undefined>(undefined);

export function LyricsProvider({ children }: { children: ReactNode }) {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);

  return (
    <LyricsContext.Provider value={{ lyrics, setLyrics, activeLyricIndex, setActiveLyricIndex }}>
      {children}
    </LyricsContext.Provider>
  );
}

export function useLyrics() {
  const context = useContext(LyricsContext);
  if (!context) throw new Error("useLyrics should be used on LyricsProvider");
  return context;
}
