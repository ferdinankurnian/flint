import { Rewind, Play, Pause, FastForward } from "@phosphor-icons/react";
import { usePlayer } from "../context/PlayerContext";
import { useTrack } from "../context/TrackContext";
import { useEffect } from "react";

function Player() {

    const { isPlaying, currentTime, duration, audioRef, setIsPlaying } = usePlayer();

    const { currentTrack } = useTrack();

    useEffect(() => {
        if (!currentTrack || !audioRef.current) return;
    
        // 1️⃣ Update Media Session API
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                artwork: currentTrack.artworkUrl
                    ? [{ src: currentTrack.artworkUrl, sizes: "512x512", type: "image/jpeg" }]
                    : [],
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
    
    }, [currentTrack, isPlaying]);
    

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
                    <div className="flex-1 h-1 bg-gray-500 rounded-full w-full">
                        <div
                            className="h-1 bg-white rounded-full"
                            style={{
                                width: `${(currentTime / duration) * 100 || 0}%`,
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between w-full my-2">
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
                        onClick={handleRewind}
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
                        onClick={handleFastForward}
                    >
                        <FastForward size={38} weight="fill" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Player;