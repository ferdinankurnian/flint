import { Switch } from "../../../components/Switch";

const LyricPage = () => {
  return (
    <div>
      <h1 className="text-white text-xl font-semibold mb-4">Lyrics Settings</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm">Stored Lyrics (.lrc)</p>
            <p className="text-xs opacity-60">
              See all stored lyrics in the database storage.
            </p>
          </div>
          <button className="text-sm bg-neutral-700 p-1 px-2 rounded">Open</button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm">Always show instrumental dots</p>
            <p className="text-xs opacity-60">
              Show or hide instrumental dots.
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm">Toggle Memorable Words</p>
            <p className="text-xs opacity-60">
              Turn on or turn off memorable word (Shining words)
            </p>
          </div>
          <Switch />
        </div>
      </div>
      {/* Add your playback settings components here */}
    </div>
  );
};

export default LyricPage;
