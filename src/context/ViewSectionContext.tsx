import { createContext, useContext, useState } from "react";

type ViewSectionContextType = {
  isTracklistVisible: boolean;
  isLyricsVisible: boolean;
  toggleTracklist: () => void;
  toggleLyrics: () => void;
};

const ViewSectionContext = createContext<ViewSectionContextType | undefined>(undefined);

export const ViewSectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTracklistVisible, setTracklistVisible] = useState(true);
  const [isLyricsVisible, setLyricsVisible] = useState(true);

  const toggleTracklist = () => setTracklistVisible((prev) => !prev);
  const toggleLyrics = () => setLyricsVisible((prev) => !prev);

  return (
    <ViewSectionContext.Provider value={{ isTracklistVisible, isLyricsVisible, toggleTracklist, toggleLyrics }}>
      {children}
    </ViewSectionContext.Provider>
  );
};

export const useViewSection = () => {
  const context = useContext(ViewSectionContext);
  if (!context) throw new Error("useViewSection must be used within a ViewSectionProvider");
  return context;
};
