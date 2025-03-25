import { useTrack, Track } from "../../context/TrackContext";
import * as musicMetadata from "music-metadata";

function MusicUpload() {
    const { setTracks, setCurrentTrack, currentTrack } = useTrack();

    const handleMusicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newTracks: Track[] = []; // ⬅️ Ini array untuk menyimpan track baru
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const metadata = await musicMetadata.parseBlob(file);
                    const url = URL.createObjectURL(file);
                    const title = metadata.common.title || "Unknown Title";
                    const artist = metadata.common.artist || "Unknown Artist";
                    const picture = metadata.common.picture?.[0];
                    let artworkUrl = "";
                    if (picture) {
                        const blob = new Blob([picture.data], { type: picture.format });
                        artworkUrl = URL.createObjectURL(blob);
                    }
                    newTracks.push({ url, title, artist, artworkUrl });
                } catch (err) {
                    console.error("Failed to parse metadata for", file.name, err);
                }
            }
            setTracks((prevTracks) => [...prevTracks, ...newTracks]); // ⬅️ Tambahkan ke context
            if (!currentTrack && newTracks.length > 0) {
                setCurrentTrack(newTracks[0]); // ⬅️ Atur track pertama sebagai yang diputar
            }
        }
    };

    return (
        <input
            id="music-upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={handleMusicUpload}
            className="hidden"
        />
    );
}

export default MusicUpload;
