import { Rewind, Play, Pause, FastForward } from "@phosphor-icons/react";
import { usePlayer } from "../context/PlayerContext";
import { useTrack } from "../context/TrackContext";
import { useLyrics } from "../context/LyricsContext";
import { useEffect } from "react";

function Player() {

    const { isPlaying, currentTime, duration, audioRef, setIsPlaying, setCurrentTime } = usePlayer();
    const { tracks, currentTrack, currentIndex, setCurrentTrack } = useTrack();
    const { setActiveLyricIndex } = useLyrics();
    
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
                audioRef.current.currentTime - 10,
            );
        }
    };

    const handleFastForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(
                duration,
                audioRef.current.currentTime + 10,
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
    }

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
    }

    useEffect(() => {
        if (!currentTrack || !audioRef.current) return;

        // 1️⃣ Update Media Session API
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                artwork: currentTrack.artworkUrl ? [
                    // Provide multiple sizes for better compatibility
                    { src: currentTrack.artworkUrl, sizes: "96x96", type: "image/jpeg" },
                    { src: currentTrack.artworkUrl, sizes: "128x128", type: "image/jpeg" },
                    { src: currentTrack.artworkUrl, sizes: "256x256", type: "image/jpeg" },
                    { src: currentTrack.artworkUrl, sizes: "512x512", type: "image/jpeg" }
                ] : [],
            });

            navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
            navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
        }

        // 2️⃣ Update Audio Source & Play/Pause
        if (audioRef.current.src !== currentTrack.url) {
            audioRef.current.src = currentTrack.url;
            audioRef.current.load();
        }

        if (isPlaying) {
            audioRef.current.play().catch((err) => console.error("Playback failed:", err));
        } else {
            audioRef.current.pause();
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
        };

        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };

    }, [currentTrack, isPlaying]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <div className="grow flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div
                    className="w-72 h-72 rounded-xl mb-4"
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
                        <span className="text-white text-sm">
                            {formatTime(currentTime)}
                        </span>
                        <span className="text-white text-sm">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h2 className="text-white text-xl font-bold truncate max-w-72">
                        {currentTrack?.title || "No Track"}
                    </h2>
                    <p className="text-gray-300 text-sm font-medium truncate max-w-72">
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
    );
}

export default Player;