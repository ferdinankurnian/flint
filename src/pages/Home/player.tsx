import {
  Rewind,
  Play,
  Pause,
  FastForward,
  Playlist,
  Quotes,
  SpeakerHigh,
  SpeakerLow,
  SpeakerX,
} from "@phosphor-icons/react";
import { usePlayer } from "../../context/PlayerContext";
import { useTrack } from "../../context/TrackContext";
import { useLyrics } from "../../context/LyricsContext";
import { useEffect, useState, useRef } from "react";
import { useViewSection } from "../../context/ViewSectionContext";
import { VolumeSlider } from "../../components/VolumeSlider";

function Player() {
  const {
    isPlaying,
    currentTime,
    duration,
    audioRef,
    setIsPlaying,
    setCurrentTime,
  } = usePlayer();
  const { tracks, currentTrack, currentIndex, setCurrentTrack } = useTrack();
  const { setActiveLyricIndex } = useLyrics();
  const { toggleTracklist, toggleLyrics, isLyricsVisible, isTracklistVisible } =
    useViewSection();
  const [volume, setVolume] = useState(70);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const volumeButtonRef = useRef<HTMLButtonElement>(null);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Add your actual volume change logic here
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5,
      );
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 5,
      );
    }
  };

  const handlePrevTrack = () => {
    if (currentIndex > 0) {
      const prevTrack = tracks[currentIndex - 1];
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
    } else {
      const lastTrack = tracks[tracks.length - 1];
      setCurrentTrack(lastTrack);
      setIsPlaying(true);
    }
    // setLyrics([]);
    setActiveLyricIndex(-1);
  };

  const handleNextTrack = () => {
    if (currentIndex < tracks.length - 1) {
      const nextTrack = tracks[currentIndex + 1];
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
    } else {
      const firstTrack = tracks[0];
      setCurrentTrack(firstTrack);
      setIsPlaying(true);
    }
    // setLyrics([]);
    setActiveLyricIndex(-1);
  };

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    // 1️⃣ Update Media Session API
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.artworkUrl
          ? [
              // Provide multiple sizes for better compatibility
              {
                src: currentTrack.artworkUrl,
                sizes: "512x512",
                type: "image/jpeg",
              },
            ]
          : [],
      });

      navigator.mediaSession.setActionHandler("play", () =>
        audioRef.current?.play(),
      );
      navigator.mediaSession.setActionHandler("pause", () =>
        audioRef.current?.pause(),
      );
    }

    // 2️⃣ Update Audio Source & Play/Pause
    if (audioRef.current.src !== currentTrack.url) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
    }

    if (isPlaying) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback failed:", err));
      document.title = `${currentTrack.title} - ${currentTrack.artist}`;
    } else {
      audioRef.current.pause();
      document.title = "Flint";
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePlayPause();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        handleRewind();
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        handleFastForward();
      }
      // else if (event.code === "Comma") {
      //     event.preventDefault();
      //     handlePrevTrack();
      // } else if (event.code === "Period") {
      //     event.preventDefault();
      //     handleNextTrack();
      // }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentTrack, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="player-view grow flex flex-col items-center justify-between relative">
      <div className="player-view-controls grow flex flex-col items-center justify-center">
        <div className="w-72 flex flex-col items-center justify-center">
          <div
            className={`${isPlaying ? "scale-100" : "scale-85"} np-artwork w-72 h-72 rounded-lg mb-4 transition-transform duration-300 ease-in-out ring-2 ring-inset ring-[#ffffff17]`}
            style={{
              backgroundImage: currentTrack?.artworkUrl
                ? `url(${currentTrack.artworkUrl})`
                : "none",
              backgroundSize: "cover",
              backgroundColor: currentTrack?.artworkUrl
                ? "transparent"
                : "#4b5563",
            }}
          ></div>
          <div className="flex flex-col items-center justify-between w-full">
            <div className="flex-1 w-full relative">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime || 0}
                onChange={(e) => {
                  if (audioRef.current) {
                    const time = parseFloat(e.target.value);
                    audioRef.current.currentTime = time;
                    setCurrentTime(time);
                  }
                }}
                className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${(currentTime / duration) * 100}%, #6b7280 ${(currentTime / duration) * 100}%)`,
                }}
              />
            </div>
            <div className="flex justify-between w-full my-1">
              <span className="text-white text-xs select-none">
                {formatTime(currentTime)}
              </span>
              <span className="text-white text-xs select-none">
                {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="np-title text-white text-lg font-bold truncate max-w-72">
              {currentTrack?.title || "No Track"}
            </h2>
            <p className="np-artists text-gray-300 text-xs font-normal truncate max-w-72">
              {currentTrack?.artist || "Unknown"}
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
              onClick={handlePrevTrack}
            >
              <Rewind size={38} weight="fill" />
            </button>
            <button
              className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={38} weight="fill" />
              ) : (
                <Play size={38} weight="fill" />
              )}
            </button>
            <button
              className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
              onClick={handleNextTrack}
            >
              <FastForward size={38} weight="fill" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 m-4 absolute bottom-0">
        <div className="relative">
          <button
            className="text-[#ffffff8f] cursor-pointer p-2 rounded-lg hover:text-[#fff] hover:bg-[#00000038]"
            onClick={toggleTracklist}
          >
            <Playlist size={24} weight="regular" />
          </button>
          <div
            className={`absolute ${isTracklistVisible ? "" : "hidden"} bottom-1 left-1/2 transform -translate-x-1/2 w-[3px] h-[3px] bg-[#ffffff8f] rounded-full`}
          ></div>
        </div>
        <div className="relative">
          <button
            ref={volumeButtonRef}
            className="text-[#ffffff8f] cursor-pointer p-2 rounded-lg hover:text-[#fff] hover:bg-[#00000038]"
            onClick={() => setIsVolumeOpen(!isVolumeOpen)}
          >
            {volume === 0 ? (
              <SpeakerX size={24} weight="regular" />
            ) : volume < 50 ? (
              <SpeakerLow size={24} weight="regular" />
            ) : (
              <SpeakerHigh size={24} weight="regular" />
            )}
          </button>
          <div
            className={`absolute ${isVolumeOpen ? "" : "hidden"} bottom-1 left-1/2 transform -translate-x-1/2 w-[3px] h-[3px] bg-[#ffffff8f] rounded-full`}
          ></div>
          <VolumeSlider
            volume={volume}
            onVolumeChange={handleVolumeChange}
            isOpen={isVolumeOpen}
            onClose={() => setIsVolumeOpen(false)}
            buttonRef={volumeButtonRef}
          />
        </div>
        <div className="relative">
          <button
            className="text-[#ffffff8f] cursor-pointer p-2 rounded-lg hover:text-[#fff] hover:bg-[#00000038]"
            onClick={toggleLyrics}
          >
            <Quotes size={24} weight="regular" />
          </button>
          <div
            className={`absolute ${isLyricsVisible ? "" : "hidden"} bottom-1 left-1/2 transform -translate-x-1/2 w-[3px] h-[3px] bg-[#ffffff8f] rounded-full`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Player;
