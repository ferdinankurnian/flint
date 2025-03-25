import { ReactNode } from "react";
import { TrackProvider } from "./TrackContext";
import { PlayerProvider } from "./PlayerContext";
import { LyricsProvider } from "./LyricsContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TrackProvider>
      <PlayerProvider>
        <LyricsProvider>
          {children}
        </LyricsProvider>
      </PlayerProvider>
    </TrackProvider>
  );
}
