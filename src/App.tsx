import { AppProviders } from "./context/AppProvider";
import { useTrack } from "./context/TrackContext";
import Audio from "./components/audio";
import Home from "./pages/Home/home";
import Modal from "./components/modal/Modal";

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
      <Modal />
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
          <Home />
        </div>
      </div>
      <Audio />
    </>
  );
}

export default App;
