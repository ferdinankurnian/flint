import { ReactNode } from "react";
import { TrackProvider } from "./TrackContext";
import { PlayerProvider } from "./PlayerContext";
import { LyricsProvider } from "./LyricsContext";
import { ViewSectionProvider } from "./ViewSectionContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TrackProvider>
      <PlayerProvider>
        <LyricsProvider>
          <ViewSectionProvider>
            {children}
          </ViewSectionProvider>
        </LyricsProvider>
      </PlayerProvider>
    </TrackProvider>
  );
}
