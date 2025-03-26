import { usePlayer } from "../context/PlayerContext";
import { useLyrics } from "../context/LyricsContext";
import { useTrack } from "../context/TrackContext";

function Audio() {

    const { audioRef, setCurrentTime, setDuration, setIsPlaying, repeatMode } = usePlayer();
    const { tracks, setCurrentTrack, currentIndex, currentTrack } = useTrack();
    const { lyrics, setActiveLyricIndex } = useLyrics();

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
    
        if (repeatMode === "one") {
            // Ulang lagu yang sama
            audioRef.current?.play();
            return;
        }
    
        if (repeatMode === "all" && currentIndex === tracks.length - 1) {
            // Kalau repeat all dan lagu terakhir, mulai dari awal
            setCurrentTrack(tracks[0]);
            setIsPlaying(true);
        } else if (currentIndex < tracks.length - 1) {
            // Lanjut ke lagu berikutnya kalau masih ada
            setCurrentTrack(tracks[currentIndex + 1]);
            setIsPlaying(true);
        } else {
            // Kalau repeat off, stop playback
            const firstTrack = tracks[0];
            setCurrentTrack(firstTrack);
            setIsPlaying(false);
        }
    
        // Reset lyrics-related states
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