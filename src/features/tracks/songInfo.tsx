import React from "react";
import { useTrack } from "../../context/TrackContext";
import { useModal } from "../../context/ModalContext";

function SongInfoModal() {
  const { currentTrack } = useTrack();
  const { openModal, setContentModal } = useModal();

  const handleOpen = () => {
    setContentModal(
      <div className="flex flex-col sm:flex-row h-full overflow-y-auto sm:overflow-hidden">
        <div className="w-full md:w-1/2 p-4">
          <img
            src={currentTrack?.artworkUrl || ""}
            alt="Artwork"
            className="w-full rounded-lg shadow-md"
          />
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{currentTrack?.title || "No Tracks"}</h2>
            <p className="text-sm text-neutral-400">{currentTrack?.artist || "Unknown"}</p>
            <p className="text-sm text-neutral-400">{currentTrack?.album || "Unknown"}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Tabs>
            <Tab label="Details">
              <Details song={currentTrack} />
            </Tab>
            <Tab label="Lyrics">
              <Lyrics lyrics={currentTrack?.lyrics || ""} />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
    openModal();
  };

  return handleOpen;
}

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
            className={`px-3 py-1 -mb-px w-full sm:w-auto font-semibold cursor-pointer rounded-md ${
              activeTab === (child as React.ReactElement<{ label: string }>).props.label
                ? "bg-neutral-800"
                : "text-neutral-500 hover:text-neutral-300"
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
    <div className="flex flex-col space-y-2">
      <div><h1 className="font-semibold text-lg">Song Name:</h1> <p className="text-neutral-300 text-md">{song.title || "-"}</p></div>
      <div><h1 className="font-semibold text-lg">Artist/Band:</h1> <p className="text-neutral-300 text-md">{song.artist || "-"}</p></div>
      <div><h1 className="font-semibold text-lg">Album:</h1> <p className="text-neutral-300 text-md">{song.album || "-"}</p></div>
      <div><h1 className="font-semibold text-lg">Release Year:</h1> <p className="text-neutral-300 text-md">{song.year || "-"}</p></div>
      <div><h1 className="font-semibold text-lg">Duration:</h1> <p className="text-neutral-300 text-md">{song.duration || "-"}</p></div>
      <div><h1 className="font-semibold text-lg">Genre:</h1> <p className="text-neutral-300 text-md">{song.genre || "-"}</p></div>
    </div>
  );
};

const Lyrics = ({ lyrics }: { lyrics?: string }) => {
  return (
    <textarea
      className="w-full h-100 p-2 rounded outline-0"
      value={lyrics || ""}
      readOnly
    />
  );
};

export default SongInfoModal;
