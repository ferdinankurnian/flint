import React from "react";
import { useTrack } from "../../context/TrackContext";
import { X } from "@phosphor-icons/react";

// Definisikan type props
interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SongInfoModal: React.FC<SongInfoModalProps> = ({ isOpen, onClose }) => {
  const { currentTrack } = useTrack();

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed top-0 left-0 z-100 w-full h-full bg-transparent flex justify-center items-center backdrop-blur-sm">
      <div className="bg-[#131313] rounded-lg shadow-lg w-full h-full md:w-2xl md:h-auto">
        <div className="p-4 h-full relative">
          <button
            className="absolute right-4 hover:text-gray-200"
            onClick={onClose}
          >
            <X size={24} weight="bold" />
          </button>
          <div className="flex flex-col sm:flex-row h-full overflow-y-auto sm:overflow-hidden">
            <div className="w-full md:w-1/2 p-4">
              <img
                src={currentTrack.artworkUrl}
                alt="Artwork"
                className="w-full rounded-lg shadow-md"
              />
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">{currentTrack.title}</h2>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
                <p className="text-sm text-gray-400">{currentTrack.album}</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <Tabs>
                <Tab label="Details">
                  <Details song={currentTrack} />
                </Tab>
                <Tab label="Lyrics">
                  <Lyrics lyrics={currentTrack.lyrics} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tabs = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = React.useState(
    (React.Children.toArray(children)[0] as React.ReactElement<{ label: string }>).props.label
  );

  return (
    <div>
      <div className="flex space-x-2">
        {React.Children.map(children, (child) => (
          <button
            key={(child as React.ReactElement<{ label: string }>).props.label}
            className={`px-3 py-1 -mb-px w-full sm:w-auto font-semibold rounded-md ${
              activeTab === (child as React.ReactElement<{ label: string }>).props.label
                ? "bg-gray-800"
                : "text-gray-500"
            }`}
            onClick={() =>
              setActiveTab((child as React.ReactElement<{ label: string }>).props.label)
            }
          >
            {(child as React.ReactElement<{ label: string }>).props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {React.Children.map(children, (child) => {
          if ((child as React.ReactElement<{ label: string }>).props.label !== activeTab)
            return undefined;
          return child;
        })}
      </div>
    </div>
  );
};

const Tab = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return <div data-label={label}>{children}</div>;
};

const Details = ({ song }: { song: any }) => {
  return (
    <div className="flex flex-col space-y-1">
      <div><h1 className="font-semibold text-lg">Judul Lagu:</h1> <p>{song.title}</p></div>
      <div><h1 className="font-semibold text-lg">Artis/Band:</h1> <p>{song.artist}</p></div>
      <div><h1 className="font-semibold text-lg">Album:</h1> <p>{song.album}</p></div>
      <div><h1 className="font-semibold text-lg">Tahun Rilis:</h1> <p>{song.year}</p></div>
      <div><h1 className="font-semibold text-lg">Durasi:</h1> <p>{song.duration}</p></div>
      <div><h1 className="font-semibold text-lg">Genre:</h1> <p>{song.genre}</p></div>
    </div>
  );
};

const Lyrics = ({ lyrics }: { lyrics?: string }) => {
  return (
    <textarea
      className="w-full h-48 p-2 border rounded"
      value={lyrics || ""}
      readOnly
    />
  );
};

export default SongInfoModal;
