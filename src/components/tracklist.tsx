import { Plus, Repeat, RepeatOnce, Shuffle } from '@phosphor-icons/react';
import { useTrack } from '../context/TrackContext';
import { usePlayer } from '../context/PlayerContext';
import MusicItem from './tracklist/musicItem';
import ClearTracks from './tracklist/clearTracks';
import MusicUpload from './tracklist/musicUpload';

function Tracklist() {

    const { tracks, isShuffling, toggleShuffle } = useTrack();
    const { toggleRepeat, repeatMode } = usePlayer();

    return (
        <div className="w-xs bg-[#00000038] flex flex-col">
            <div className="flex justify-between items-center p-4">
                <div className="flex flex-col">
                    <h2 className="text-white text-sm">Tracks</h2>
                    <p className="text-white text-lg font-semibold">
                        {tracks.length} Songs
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={toggleShuffle} className={`${isShuffling ? "bg-[#00000038]" : ""} cursor-pointer text-white hover:bg-[#00000038] rounded-lg p-2`}>
                        <Shuffle size={24} />
                    </button>
                    <button onClick={toggleRepeat} className={`cursor-pointer text-white hover:bg-[#00000038] rounded-lg p-2 ${repeatMode !== "off" ? "bg-[#00000038]" : ""}`}>
                    {repeatMode === "one" ? (
                        <RepeatOnce size={24} />
                    ) : (
                        <Repeat size={24} />
                    )}
                    </button>
                </div>
            </div>
            <div className="grow space-y-2 overflow-y-auto px-4">
                <MusicItem />
            </div>
            <div className="flex justify-between items-center p-4 py-2">
                <label
                    htmlFor="music-upload"
                    className="rounded-lg hover:bg-[#00000038] p-2 flex flex-row gap-2 font-semibold text-white cursor-pointer"
                >
                    <Plus size={24} /> Upload Music
                </label>
                <MusicUpload />
                <ClearTracks />
            </div>
        </div>
    );
};

export default Tracklist;
