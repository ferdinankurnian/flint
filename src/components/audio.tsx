import { usePlayer } from "../context/PlayerContext";
import { useLyrics } from "../context/LyricsContext";
import { useTrack } from "../context/TrackContext";

function Audio() {

    const { audioRef, setCurrentTime, setDuration, setIsPlaying } = usePlayer();
    const { tracks, currentTrack, setCurrentTrack } = useTrack();
    const { lyrics, setActiveLyricIndex, setLyrics } = useLyrics();

    const updateActiveLyric = (time: number) => {
        const endMarker = lyrics.find((lyric) => lyric.endMarker);
        if (endMarker && time >= endMarker.time!) {
            setActiveLyricIndex(-1); // Reset after end marker
        } else {
            const activeIndex = lyrics.findIndex((lyric, index) => {
                const nextLyric = lyrics[index + 1];
                const isInstrumental = lyric.instrumental;
                const isLyric = !lyric.inactive && !lyric.endMarker && !lyric.instrumental;
                const isWithinTime =
                    lyric.time! <= time && (!nextLyric || nextLyric.time! > time);
                return (isLyric || isInstrumental) && isWithinTime;
            });
            setActiveLyricIndex(activeIndex);
        }
    };

    const handleTrackEnded = () => {
        if (!currentTrack) return;
        const currentIndex = tracks.findIndex(
            (track) => track.url === currentTrack.url,
        );
        if (currentIndex < tracks.length - 1) {
            const nextTrack = tracks[currentIndex + 1];
            setCurrentTrack(nextTrack);
            setIsPlaying(true);
        } else {
            const firstTrack = tracks[0];
            setCurrentTrack(firstTrack);
            setIsPlaying(false);
        }
        setLyrics([]);
        setActiveLyricIndex(-1);
    };

    return (
        <audio
                ref={audioRef}
                onTimeUpdate={() => {
                    if (audioRef.current) {
                        setCurrentTime(audioRef.current.currentTime);
                        updateActiveLyric(audioRef.current.currentTime);
                    }
                }}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }}
                onEnded={handleTrackEnded}
            />
    );
}

export default Audio;