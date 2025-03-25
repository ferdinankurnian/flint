import React, { useEffect, useRef } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useLyrics, Lyric } from "../context/LyricsContext";
import { useTrack } from "../context/TrackContext";
import gsap from "gsap";

const LyricLine = ({ text, isActive }: { text: string; isActive: boolean }) => {
    return (
        <div
            className={`text-2xl font-bold py-2 origin-left transform ${isActive ? "opacity-100 scale-100" : "opacity-40 scale-95"
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
                        ref={(el) => {
                            if (el) dotsRef.current[i] = el;
                        }}
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

function Lyrics() {

    const { lyrics, activeLyricIndex, setLyrics } = useLyrics();
    const { currentTrack } = useTrack();

    const handleLrcUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        try {
            if (file) {
                const text = await file.text();
                const parsed = parseLyrics(text);
                console.log("Parsed lyrics:", parsed); // Debug log
                setLyrics(parsed);
            }
        } catch (err) {
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
                .filter(Boolean) as Lyric[]; // Remove null entries

            // Add initial instrumental if lyrics don’t start at 0
            if (parsedLyrics.length > 0 && parsedLyrics[0]?.time! > 0) {
                parsedLyrics.unshift({
                    text: "[Instrumental]",
                    time: 0,
                    instrumental: true,
                });
            }
            return parsedLyrics;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    return (
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
    );

};

export default Lyrics;