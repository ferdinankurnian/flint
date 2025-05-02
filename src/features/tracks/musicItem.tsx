import { useTrack } from "../../context/TrackContext";
import { usePlayer } from "../../context/PlayerContext";
import { VinylRecord } from "@phosphor-icons/react";

function MusicItem() {
  const { tracks, currentTrack, setCurrentTrack } = useTrack();
  const { isPlaying } = usePlayer();

  return (
    <>
      {tracks.map((track) => (
        <div
          key={track.url}
          className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
            currentTrack?.url === track.url
              ? "bg-[#00000038]"
              : "hover:bg-[#00000038]"
          }`}
          onClick={() => setCurrentTrack(track)}
        >
          <img
            alt="Album cover"
            className="w-12 h-12 rounded-sm"
            src={track.artworkUrl || "https://placehold.co/50x50"}
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-semibold truncate">
              {track.title}
            </p>
            <p className="text-gray-300 text-xs truncate">{track.artist}</p>
          </div>
          {currentTrack?.url === track.url && (
            <VinylRecord
              size={24}
              weight="regular"
              className={`${isPlaying ? "animate-spin" : ""}`}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default MusicItem;
