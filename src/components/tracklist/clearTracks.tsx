import { Trash } from "@phosphor-icons/react";
import { useTrack } from "../../context/TrackContext";

function ClearTracks() {
    const { setTracks } = useTrack();

    const clearTracks = () => {
        setTracks([]);
    };

    return (
        <button className="cursor-pointer text-white hover:bg-[#00000038] rounded-lg p-2" onClick={clearTracks}>
            <Trash size={24} />
        </button>
    );
}

export default ClearTracks;