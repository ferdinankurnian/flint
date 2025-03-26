import { createContext, useContext, useState, useRef, ReactNode } from "react";

type RepeatMode = "off" | "all" | "one";

type PlayerContextType = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  repeatMode: RepeatMode;
  toggleRepeat: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev === "off" ? "all" : prev === "all" ? "one" : "off"));
  };

  return (
    <PlayerContext.Provider value={{ isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioRef, repeatMode, toggleRepeat }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer should be used on PlayerProvider");
  return context;
}
