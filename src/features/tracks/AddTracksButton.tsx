function AddTracksButton({ onFilesDropped }: { onFilesDropped: (files: FileList) => void }) {
    return (
        <input
            id="music-upload"
            type="file"
            accept="audio/*"
            multiple
            onChange={(e) => {
                if (e.target.files) {
                    onFilesDropped(e.target.files);
                }
            }}
            className="hidden"
        />
    );
}

export default AddTracksButton;
