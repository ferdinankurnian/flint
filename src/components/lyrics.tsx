import React, { useEffect, useRef } from "react";
import { useLyrics, Lyric } from "../context/LyricsContext";
import { useTrack } from "../context/TrackContext";
import { usePlayer } from "../context/PlayerContext";
import { Dropdown, DropdownItem, DropdownSeparator } from './dropdown';
import { useViewSection } from "../context/ViewSectionContext";
import gsap from "gsap";
import ScrollToPlugin from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
import SongInfoModal from "./tracklist/songInfo";

const LyricLine = ({ text, isActive }: { text: string; isActive: boolean }) => {
    return (
        <div
            className={`lyric-line text-2xl font-bold py-3 origin-left transition duration-300 ease-in-out transform ${isActive ? "opacity-100 scale-100" : "opacity-30 scale-95"
                }`}
        >
            {text}
        </div>
    );
};

const InstrumentalIndicator = ({
    isActive,
    duration,
    isPaused,
}: {
    isActive: boolean;
    duration: number;
    isPaused: boolean;
}) => {
    const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<GSAPTimeline | null>(null);
    const dotsContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        timelineRef.current = gsap.timeline({
            paused: true,
            repeat: -1 // Infinite repeat
        });
    
        // Sequential animation
        if (dotsRef.current[0]) {
            const fadeDuration = 0.3; // Fixed fade duration
            const activeDuration = duration * 0.8;
            const individualDuration = activeDuration / 3;
            const stayDuration = Math.max(0, duration - activeDuration - fadeDuration);
    
            timelineRef.current
                .to(dotsRef.current[0], {
                    opacity: 1,
                    duration: individualDuration,
                    ease: "none",
                })
                .to(dotsRef.current[1], {
                    opacity: 1,
                    duration: individualDuration,
                    ease: "none",
                })
                .to(dotsRef.current[2], {
                    opacity: 1,
                    duration: individualDuration,
                    ease: "none",
                })
                .to([dotsRef.current[0], dotsRef.current[1], dotsRef.current[2]], {
                    opacity: 1,
                    duration: stayDuration,
                    ease: "none",
                }, "+=0")
                .to([dotsRef.current[0], dotsRef.current[1], dotsRef.current[2]], {
                    opacity: 0.3,
                    duration: fadeDuration,
                    ease: "power2.out",
                }, "+=0");
        }
    
        return () => {
            timelineRef.current?.kill();
        };
    }, [duration]);

    useEffect(() => {
        if (dotsContainerRef.current) {
            gsap.to(dotsContainerRef.current, {
                duration: 0.5,
                scale: isActive ? 1 : 0,
                autoAlpha: isActive ? 1 : 0,
                paddingTop: isActive ? '0.5rem' : 0,
                paddingBottom: isActive ? '0.5rem' : 0,
                ease: "power2.out",
                transformOrigin: "center center"
            });
        }
        if (isActive && !isPaused) {
            timelineRef.current?.play();
        } else {
            timelineRef.current?.pause();
            if (!isActive) {
                dotsRef.current.forEach((dot) => {
                    if (dot) {
                        gsap.to(dot, { opacity: 0.3, duration: 0.1 });
                    }
                });
            }
        }
    }, [isActive, isPaused]);

    return (
        <div
            className={`instrumental-dots flex items-center overflow-hidden ${!isActive ? 'py-0' : ''}`}
        >
            <div
                ref={dotsContainerRef}
                className="flex space-x-[7px]"
            >
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-3 h-3 bg-white rounded-full opacity-30"
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
    isPlaying,
}: {
    lyrics: Lyric[];
    activeIndex: number;
    isPlaying: boolean;
}) => {
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeIndex >= 0 && lyricsContainerRef.current) {
            const activeElement = lyricsContainerRef.current.children[activeIndex];
            if (activeElement) {
                const container = lyricsContainerRef.current;
                const elementPosition = (activeElement as HTMLElement).offsetTop;
                let offset = 115; // Adjust this value to change offset (in pixels)

                // Check if the previous element is an instrumental indicator
                if (activeIndex > 0 && lyrics[activeIndex - 1].instrumental) {
                    offset = 140; // Adjust offset for instrumental sections
                }

                gsap.to(container, {
                    duration: 0.5, // Adjust duration (in seconds)
                    scrollTo: {
                        y: elementPosition - offset,
                        autoKill: true
                    },
                    ease: "power2.out" // Smooth easing function
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
            className="px-5 pb-100 pt-10 text-white w-full h-full overflow-y-auto scrollbar-hide"
        >
            {lyrics.map((lyric, index) => {
                if (lyric.inactive) {
                    return (
                        <div key={index} className="opacity-40 text-2xl font-bold py-3">
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
                            isPaused={!isPlaying}
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
    const { isPlaying } = usePlayer();
    const { isLyricsVisible } = useViewSection();

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

    const handleSettingsClick = () => {
        alert('Settings clicked!');
    };

    const handleLogoutClick = () => {
        alert('Logout clicked!');
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`lyrics-view ${isLyricsVisible ? "block" : "hidden"} w-xs bg-[#00000038] flex flex-col`}>
                    <SongInfoModal isOpen={isModalOpen} onClose={closeModal} />
            <div className="p-4 flex flex-row justify-between items-center">
                <div className="flex flex-col max-w-[225px]">
                    <h2 className="text-white text-lg font-semibold truncate">
                        {currentTrack?.title || "No Track"}
                    </h2>
                    <p className="text-gray-300 text-sm truncate">
                        {currentTrack?.artist || "Unknown"}
                    </p>
                </div>
                <div className="flex space-x-4">
                    {/* <input
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
                    </label> */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".lrc"
                        onChange={handleLrcUpload}
                        className="hidden"
                        id="lrcUpload"
                    />
                    <Dropdown>
                        <DropdownItem onClick={openModal}>Song Info</DropdownItem>
                        <DropdownItem onClick={() => fileInputRef.current?.click()}>Add Lyrics (.lrc)</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem onClick={handleSettingsClick}>Settings</DropdownItem>
                        <DropdownItem onClick={handleLogoutClick}>Logout</DropdownItem>
                    </Dropdown>
                </div>
            </div>
            <div className="text-white h-full overflow-y-auto">
                {lyrics.length > 0 ? (
                    <LyricsDisplay lyrics={lyrics} activeIndex={activeLyricIndex} isPlaying={isPlaying} />
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