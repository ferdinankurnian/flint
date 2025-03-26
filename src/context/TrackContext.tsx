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
  isShuffling: boolean;
  toggleShuffle: () => void;
};

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [originalTracks, setOriginalTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (!currentTrack) {
      setCurrentIndex(-1);
      return;
    }
    const index = tracks.findIndex((track) => track.url === currentTrack.url);
    setCurrentIndex(index);
  }, [currentTrack, tracks]);

  const toggleShuffle = () => {
    if (!isShuffling) {
      setOriginalTracks(tracks);
      const shuffledTracks = [...tracks];
      for (let i = shuffledTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
      }
      setTracks(shuffledTracks);
    } else {
      setTracks(originalTracks);
    }
    setIsShuffling(!isShuffling);
  };

  return (
    <TrackContext.Provider value={{ tracks, setTracks, currentTrack, setCurrentTrack, currentIndex, isShuffling, toggleShuffle }}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (!context) throw new Error("useTrack should be used on TrackProvider");
  return context;
}
