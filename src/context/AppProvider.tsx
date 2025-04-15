import { ReactNode } from "react";
import { TrackProvider } from "./TrackContext";
import { PlayerProvider } from "./PlayerContext";
import { LyricsProvider } from "./LyricsContext";
import { ViewSectionProvider } from "./ViewSectionContext";
import { ModalProvider } from "./ModalContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <TrackProvider>
        <PlayerProvider>
        <LyricsProvider>
          <ViewSectionProvider>
            {children}
          </ViewSectionProvider>
        </LyricsProvider>
      </PlayerProvider>
    </TrackProvider>
    </ModalProvider>
  );
}
