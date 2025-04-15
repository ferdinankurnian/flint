import { useTrack } from "../../context/TrackContext";

function MusicItem() {
    const { tracks, currentTrack, setCurrentTrack } = useTrack();

    return (
        <>
            {tracks.map((track, index) => (
                <div
                    key={index}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${currentTrack?.url === track.url
                        ? "bg-[#00000038]"
                        : "hover:bg-[#00000038]"
                    }`}
                    onClick={() => setCurrentTrack(track)}
                >
                    <img
                        alt="Album cover"
                        className="w-12 h-12 rounded-md"
                        src={track.artworkUrl || "https://placehold.co/50x50"}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">
                            {track.title}
                        </p>
                        <p className="text-gray-300 text-sm truncate">
                            {track.artist}
                        </p>
                        </div>
                </div>
            ))}
        </>
    );
};

export default MusicItem;
