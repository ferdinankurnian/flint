import { AppProviders } from "./context/AppProvider";
import Player from "./components/player";
import TrackList from "./components/tracklist";
import Audio from "./components/audio";
import Lyrics from "./components/lyrics";
import { useTrack } from "./context/TrackContext";

function App() {

  return (
    <AppProviders>
      <MainContent />
    </AppProviders>
  );
}

function MainContent() {
  const { currentTrack } = useTrack(); // Sekarang berada dalam AppProviders

  return (
    <>
      <div
        className="h-screen w-screen flex relative"
        style={{
          backgroundImage: currentTrack?.artworkUrl
            ? `url(${currentTrack.artworkUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: currentTrack?.artworkUrl ? "transparent" : "#4b5563",
        }}>
        <div
          className="absolute inset-0 backdrop-blur-xl bg-black/30"
          style={{ backdropFilter: "blur(75px)" }}
        />
        <div className="relative z-10 flex w-full">
          {/* Left Section: Track List */}
          <TrackList />


          {/* Middle Section: Player */}
          <Player />

          {/* Right Section: Lyrics */}
          <Lyrics />

        </div>
      </div>
      <Audio />
    </>
  );
}

export default App;
