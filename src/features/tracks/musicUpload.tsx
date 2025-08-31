import { useTrack, Track } from "../../context/TrackContext";
import AddTracksButton from "./AddTracksButton";
// import DragDropArea from "./DragDropArea";
import * as musicMetadata from "music-metadata";
import { generateSongId } from "../../context/TrackContext";

function MusicUpload() {
    const { setTracks, setCurrentTrack, currentTrack, tracks } = useTrack();

    const handleMusicUpload = async (input: React.ChangeEvent<HTMLInputElement> | FileList) => {
        const files = input instanceof FileList ? input : input.target.files;
        if (files) {
            const newTracks: Track[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const metadata = await musicMetadata.parseBlob(file);
                    const url = URL.createObjectURL(file);

                    const title = metadata.common.title || "Unknown Title";
                    const artist = metadata.common.artist || "Unknown Artist";
                    const album = metadata.common.album || "Unknown Album";
                    const year = metadata.common.year?.toString() || "";
                    const formatDuration = (seconds: number | undefined): string => {
                        if (!seconds) return "";
                        const minutes = Math.floor(seconds / 60);
                        const remainingSeconds = Math.floor(seconds % 60);
                        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                    };
                    const duration = formatDuration(metadata.format.duration);
                    const genre = metadata.common.genre?.[0] || "";

                    const picture = metadata.common.picture?.[0];
                    let artworkUrl = "";
                    if (picture) {
                        const blob = new Blob([picture.data], { type: picture.format });
                        artworkUrl = URL.createObjectURL(blob);
                    }

                    const newTrack: Track = {
                        song_id: "",
                        url,
                        title,
                        artist,
                        album,
                        artworkUrl,
                        year,
                        duration,
                        genre
                    };

                    newTrack.song_id = generateSongId(newTrack); // ⬅️ Generate song_id

                    // Cek apakah lagu ini sudah ada di daftar
                    if (!tracks.some(t => t.song_id === newTrack.song_id)) {
                        newTracks.push(newTrack);
                    } else {
                        URL.revokeObjectURL(url); // ⬅️ Hapus object URL kalau duplikat
                    }
                } catch (err) {
                    console.error("Failed to parse metadata for", file.name, err);
                }
            }
            setTracks((prevTracks) => [...prevTracks, ...newTracks]);
            if (!currentTrack && newTracks.length > 0) {
                setCurrentTrack(newTracks[0]);
            }
        }
    };

    // const handleFileDrop = (files: FileList) => {
    //     handleMusicUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    // };

    return (
        <>
            <AddTracksButton onFilesDropped={handleMusicUpload} />
            {/* <DragDropArea onFileDrop={handleFileDrop} /> */}
        </>
    );
}

export default MusicUpload;