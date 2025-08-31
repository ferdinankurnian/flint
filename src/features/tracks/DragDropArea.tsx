import { useState } from "react";
import { Upload } from "@phosphor-icons/react";

export default function DragDropArea({ onFileDrop }: { onFileDrop: (files: FileList) => void }) {
  const [isDragging, setIsDragging] = useState(false);

const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
};

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files); // Kirim files ke MusicUpload
    }
  };

  return (
    <div
      className="absolute w-full h-full top-0 left-0 z-100 border-2 border-dashed border-neutral-400 rounded-lg"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white rounded-lg">
          <Upload size={48} />
          <p className="mt-2 text-lg">Drop Here</p>
        </div>
      )}
      {/* <div className="flex items-center justify-center h-full text-neutral-500">
        Drag & Drop your music files here
      </div> */}
    </div>
  );
}
