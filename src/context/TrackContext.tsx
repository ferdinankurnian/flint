import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Track {
  url: string;
  title: string;
  artist: string;
  artworkUrl?: string;
}

type TrackContextType = {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  currentTrack: Track | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>;
  currentIndex: number;
};

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (!currentTrack) {
      setCurrentIndex(-1);
      return;
    }
    const index = tracks.findIndex((track) => track.url === currentTrack.url);
    setCurrentIndex(index);
  }, [currentTrack, tracks]);

  return (
    <TrackContext.Provider value={{ tracks, setTracks, currentTrack, setCurrentTrack, currentIndex }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (!context) throw new Error("useTrack should be used on TrackProvider");
  return context;
}
