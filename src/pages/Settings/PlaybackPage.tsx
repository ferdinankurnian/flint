import { Switch } from "../../components/Switch";

const PlaybackPage = () => {
  return (
    <div>
      <h1 className="text-white text-xl font-semibold mb-4">
        Playback Settings
      </h1>
      <div className="flex flex-col space-y-4">
        <div className="crossfade flex justify-between items-center">
          <p className="text-sm">Turn on Crossfade</p>
          <Switch />
        </div>
        <div className="crossfade flex justify-between items-center">
          <p className="text-sm">Crossfade</p>
          <Switch />
        </div>
        <div className="crossfade flex justify-between items-center">
          <p className="text-sm">Crossfade</p>
          <Switch />
        </div>
      </div>
      {/* Add your playback settings components here */}
    </div>
  );
};

export default PlaybackPage;
