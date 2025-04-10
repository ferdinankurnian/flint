import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";

export function generateSongId(track: Track): string {
  // Only use stable properties and normalize them to ensure consistent output
  const artist = track.artist?.trim().toLowerCase().replace(/\s/g, '') || '';
  const title = track.title?.trim().toLowerCase().replace(/\s/g, '') || '';
  const album = track.album?.trim().toLowerCase().replace(/\s/g, '') || '';
  
  // Create a stable identifier string without dynamic content like URLs
  const raw_id = `${artist}-${title}-${album}`;
  
  // Remove any non-alphanumeric characters that could cause inconsistency
  return raw_id.replace(/[^a-zA-Z0-9]/g, '');
}

export interface Track {
  song_id: string;
  url: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl?: string;
  year?: string;
  duration?: string;
  genre?: string;
  lyrics?: string;
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

  // **Gunakan useMemo untuk generate song_id sekali aja**
  const trackWithId = useMemo(() => {
    if (!currentTrack) return null;
    return {
      ...currentTrack,
      song_id: currentTrack.song_id || generateSongId(currentTrack),
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!trackWithId) {
      setCurrentIndex(-1);
      return;
    }
    setCurrentIndex(tracks.findIndex((t) => t.url === trackWithId.url));
  }, [trackWithId, tracks]);

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
    <TrackContext.Provider
      value={{
        tracks,
        setTracks,
        currentTrack: trackWithId,
        setCurrentTrack,
        currentIndex,
        isShuffling,
        toggleShuffle,
      }}
    >
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (!context) throw new Error("useTrack should be used on TrackProvider");
  return context;
}
