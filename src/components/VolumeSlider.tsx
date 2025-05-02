import { SpeakerHigh, SpeakerLow, SpeakerX } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from 'react';

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isOpen: boolean;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export const VolumeSlider = ({ volume, onVolumeChange, isOpen, onClose, buttonRef }: VolumeSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(previousVolume);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <div 
      ref={sliderRef}
      className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm gap-3 p-3 rounded-lg shadow-lg z-50 flex flex-row items-center"
      style={{ minWidth: '200px' }}
    >
      <button 
        onClick={handleMuteToggle}
        className="text-white hover:text-[#ffffff80] cursor-pointer rounded"
      >
        {volume === 0 ? (
          <SpeakerX size={24} weight="regular" />
        ) : volume < 50 ? (
          <SpeakerLow size={24} weight="regular" />
        ) : (
          <SpeakerHigh size={24} weight="regular" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => {
          const newVolume = parseInt(e.target.value);
          onVolumeChange(newVolume);
          if (newVolume > 0 && isMuted) {
            setIsMuted(false);
          }
        }}
        className="w-full h-1 bg-gray-500 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, white ${volume}%, #6b7280 ${volume}%)`
        }}
      />
    </div>
  );
};