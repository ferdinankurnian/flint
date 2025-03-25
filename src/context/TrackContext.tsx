import { createContext, useContext, useState, ReactNode } from "react";

export interface Track {
  url: string;
  title: string;
  artist: string;
  artworkUrl?: string;
}

type TrackContextType = {
  tracks: Track[];
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>; // ✅ FIXED
  currentTrack: Track | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<Track | null>>; // ✅ FIXED
};

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <TrackContext.Provider value={{ tracks, setTracks, currentTrack, setCurrentTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (!context) throw new Error("useTrack should be used on TrackProvider");
  return context;
}
