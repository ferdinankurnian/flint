import { useState, useRef, useEffect } from "react";
import {
  Shuffle,
  ArrowsClockwise,
  Rewind,
  Play,
  Pause,
  FastForward,
  DotsThreeVertical,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import * as musicMetadata from "music-metadata";
import { gsap } from "gsap";

interface Track {
  url: string;
  title: string;
  artist: string;
  artworkUrl?: string;
}

interface Lyric {
  text: string;
  time?: number;
  inactive?: boolean;
  instrumental?: boolean;
  endMarker?: boolean;
}

const LyricLine = ({ text, isActive }: { text: string; isActive: boolean }) => {
  return (
    <div
      className={`text-2xl font-bold py-2 origin-left transform ${
        isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
      }`}
      style={{
        transition: isActive
          ? "opacity 300ms ease-in-out, transform 300ms ease-in-out"
          : "opacity 100ms ease-in-out, transform 100ms ease-in-out",
      }}
    >
      {text}
    </div>
  );
};

const InstrumentalIndicator = ({
  isActive,
  duration,
}: {
  isActive: boolean;
  duration: number;
}) => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isActive) {
      dotsRef.current.forEach((dot, index) => {
        if (dot) {
          gsap.to(dot, {
            opacity: 1,
            duration: duration / 3,
            delay: index * (duration / 3),
            ease: "power2.out",
          });
        }
      });
    } else {
      dotsRef.current.forEach((dot) => {
        if (dot) {
          gsap.to(dot, { opacity: 0.4, duration: 0.1 });
        }
      });
    }
  }, [isActive, duration]);

  return (
    <div className="flex items-center py-2">
      <div className="flex space-x-[7px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 bg-white rounded-full opacity-40`}
            ref={(el) => (dotsRef.current[i] = el)}
          />
        ))}
      </div>
    </div>
  );
};

const LyricsDisplay = ({
  lyrics,
  activeIndex,
}: {
  lyrics: Lyric[];
  activeIndex: number;
}) => {
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex >= 0 && lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.children[activeIndex];
      if (activeElement) {
        const container = lyricsContainerRef.current;
        const elementPosition = (activeElement as HTMLElement).offsetTop;
        const offset = 115; // Adjust this value to change offset (in pixels)

        container.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const getInstrumentalDuration = (index: number) => {
    const nextLyric = lyrics[index + 1];
    if (nextLyric && nextLyric.time) {
      return nextLyric.time - lyrics[index].time!; // Duration in seconds
    }
    return 3; // Default 3 seconds
  };

  return (
    <div
      ref={lyricsContainerRef}
      className="px-5 pb-100 text-white space-y-2 w-full h-full overflow-y-auto"
    >
      {lyrics.map((lyric, index) => {
        if (lyric.inactive) {
          return (
            <div key={index} className="opacity-40 text-2xl font-bold py-2">
              {lyric.text}
            </div>
          );
        } else if (lyric.instrumental) {
          const duration = getInstrumentalDuration(index);
          return (
            <InstrumentalIndicator
              key={index}
              isActive={index === activeIndex}
              duration={duration}
            />
          );
        } else if (!lyric.endMarker) {
          return (
            <LyricLine
              key={index}
              text={lyric.text}
              isActive={index === activeIndex}
            />
          );
        }
        return null; // End marker is not rendered
      })}
    </div>
  );
};

function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearTracks = () => {
    setTracks([]);
  };

  const handleMusicUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = [];
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
      setTracks((prevTracks) => [...prevTracks, ...newTracks]);
      if (!currentTrack && newTracks.length > 0) {
        setCurrentTrack(newTracks[0]);
      }
    }
  };

  const handleLrcUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      if (file) {
        const text = await file.text();
        const parsed = parseLyrics(text);
        console.log("Parsed lyrics:", parsed); // Debug log
        setLyrics(parsed);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load or parse .lrc file");
      console.error(err);
    }
  };

  const parseLyrics = (lyricsText: string): Lyric[] => {
    try {
      const parsedLyrics = lyricsText
        .split("\n")
        .map((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine === "") {
            return null; // Skip empty lines
          }
          const match = trimmedLine.match(/\[(\d+):(\d+\.\d+)\](.*)/);
          if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const text = match[3].trim();
            const time = minutes * 60 + seconds;
            if (text === "") {
              return { time, endMarker: true }; // Timestamp with no text is an end marker
            } else if (text.toLowerCase() === "[instrumental]") {
              return { text: "[Instrumental]", time, instrumental: true };
            }
            return { text, time };
          }
          return { text: trimmedLine, inactive: true }; // Text without timestamp is inactive
        })
        .filter((item): item is Lyric => item !== null); // Remove null entries

      // Add initial instrumental if lyrics don’t start at 0
      if (parsedLyrics.length > 0 && parsedLyrics[0].time! > 0) {
        parsedLyrics.unshift({
          text: "[Instrumental]",
          time: 0,
          instrumental: true,
        });
      }
      return parsedLyrics;
    } catch (err) {
      setError("Failed to parse lyrics");
      console.error(err);
      return [];
    }
  };

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

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10,
      );
    }
  };

  const handleFastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        duration,
        audioRef.current.currentTime + 10,
      );
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (currentTrack && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: currentTrack.artworkUrl
          ? [{ src: currentTrack.artworkUrl, sizes: "512x512", type: "image/jpeg" }]
          : [],
      });
      navigator.mediaSession.setActionHandler("play", () =>
        audioRef.current?.play(),
      );
      navigator.mediaSession.setActionHandler("pause", () =>
        audioRef.current?.pause(),
      );
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (audioRef.current.src !== currentTrack.url) {
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
      }
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Playback failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack, isPlaying]);

  return (
    <>
      <div
        className="h-screen w-screen flex relative"
        style={{
          backgroundImage: currentTrack?.artworkUrl
            ? `url(${currentTrack.artworkUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundColor: currentTrack?.artworkUrl ? "transparent" : "#4b5563",
        }}
      >
        <div
          className="absolute inset-0 backdrop-blur-xl bg-black/30"
          style={{ backdropFilter: "blur(75px)" }}
        />
        <div className="relative z-10 flex w-full">
          {/* Left Section: Track List */}
          <div className="w-xs bg-[#00000038] flex flex-col">
            <div className="flex justify-between items-center p-4">
              <div className="flex flex-col">
                <h2 className="text-white text-sm">Tracks</h2>
                <p className="text-white text-lg font-semibold">
                  {tracks.length} Songs
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="text-white hover:bg-[#00000038] rounded-lg p-2">
                  <Shuffle size={24} />
                </button>
                <button className="text-white hover:bg-[#00000038] rounded-lg p-2">
                  <ArrowsClockwise size={24} />
                </button>
              </div>
            </div>
            <div className="grow space-y-2 overflow-y-auto px-4">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
                    currentTrack?.url === track.url
                      ? "bg-[#00000038]"
                      : "hover:bg-[#00000038]"
                  }`}
                  onClick={() => setCurrentTrack(track)}
                >
                  <img
                    alt="Album cover"
                    className="w-12 h-12 rounded-lg"
                    src={track.artworkUrl || "https://placehold.co/50x50"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold truncate">
                      {track.title}
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 py-2">
              <label
                htmlFor="music-upload"
                className="rounded-lg hover:bg-[#00000038] p-2 flex flex-row gap-2 font-semibold text-white cursor-pointer"
              >
                <Plus size={24} /> Upload Music
              </label>
              <input
                id="music-upload"
                type="file"
                accept=".mp3,.m4a"
                multiple
                onChange={handleMusicUpload}
                className="hidden"
              />
              <button
                onClick={clearTracks}
                className="cursor-pointer p-2 hover:bg-[#00000038] rounded-lg"
              >
                <Trash size={24} />
              </button>
            </div>
          </div>

          {/* Middle Section: Player */}
          <div className="grow flex flex-col items-center justify-center">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex flex-col items-center justify-center">
              <div
                className="w-72 h-72 rounded-xl mb-4"
                style={{
                  backgroundImage: currentTrack?.artworkUrl
                    ? `url(${currentTrack.artworkUrl})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundColor: currentTrack?.artworkUrl
                    ? "transparent"
                    : "#4b5563",
                }}
              ></div>
              <div className="flex flex-col items-center justify-between w-full">
                <div className="flex-1 h-1 bg-gray-500 rounded-full w-full">
                  <div
                    className="h-1 bg-white rounded-full"
                    style={{
                      width: `${(currentTime / duration) * 100 || 0}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between w-full my-2">
                  <span className="text-white text-sm">{formatTime(currentTime)}</span>
                  <span className="text-white text-sm">{formatTime(duration)}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-xl font-bold truncate max-w-72">
                  {currentTrack?.title || "No Track"}
                </h2>
                <p className="text-gray-300 text-sm font-medium truncate max-w-72">
                  {currentTrack?.artist || "Unknown"}
                </p>
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
                  onClick={handleRewind}
                >
                  <Rewind size={38} weight="fill" />
                </button>
                <button
                  className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={38} weight="fill" />
                  ) : (
                    <Play size={38} weight="fill" />
                  )}
                </button>
                <button
                  className="text-white cursor-pointer p-2 rounded-lg transition-transform hover:scale-110"
                  onClick={handleFastForward}
                >
                  <FastForward size={38} weight="fill" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Lyrics */}
          <div className="w-xs bg-[#00000038] flex flex-col">
            <div className="p-4 flex flex-row justify-between items-center">
              <div className="flex flex-col">
                <h2 className="text-white text-lg font-semibold">
                  {currentTrack?.title || "Lyrics"}
                </h2>
                <p className="text-gray-300 text-sm">
                  {currentTrack?.artist || "Unknown"}
                </p>
              </div>
              <div className="flex space-x-4">
                <input
                  type="file"
                  accept=".lrc"
                  onChange={handleLrcUpload}
                  className="hidden"
                  id="lrcUpload"
                />
                <label
                  htmlFor="lrcUpload"
                  className="text-white hover:bg-[#00000038] rounded-lg p-2 cursor-pointer"
                >
                  <DotsThreeVertical size={24} />
                </label>
              </div>
            </div>
            <div className="text-white space-y-6 h-full overflow-y-auto">
              {lyrics.length > 0 ? (
                <LyricsDisplay lyrics={lyrics} activeIndex={activeLyricIndex} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-2xl font-semibold">No lyrics available</p>
                  <p className="opacity-60">Try uploading a lyrics file (.lrc)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
}

export default App;
