import React, { useState } from "react";
import { useModal } from "../context/ModalContext";
import { House, Play, Quotes } from "@phosphor-icons/react";
import PlaybackPage from "@/pages/Settings/PlaybackPage";
import LyricPage from "@/pages/Settings/Lyrics/LyricPage";

// Komponen untuk tombol sidebar dengan state aktif
interface SidebarButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  isActive,
  onClick,
  icon,
}) => {
  return (
    <button
      className={`w-full flex flex-row items-center gap-2 text-left mb-2 py-2 px-4 rounded-md transition-colors ${
        isActive
          ? "bg-gray-700 text-white"
          : "bg-transparent text-gray-300 hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      {icon} <p className="leading-none">{label}</p>
    </button>
  );
};

// Hook untuk menggunakan Settings Modal
export const useSettingsModal = () => {
  const { openModal, setContentModal } = useModal();

  const openSettings = () => {
    setContentModal(<SettingsModalContent />);
    openModal();
  };

  return openSettings;
};

// Komponen konten modal settings (internal)
const SettingsModalContent: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("Playback");

  // Render konten berdasarkan halaman aktif
  const renderContent = () => {
    switch (activePage) {
      case "Lyrics":
        return <LyricPage />;
      case "Playback":
        return <PlaybackPage />;
      default:
        return <PlaybackPage />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-[30rem] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full sm:w-1/3 md:w-1/4 p-1 pr-4 overflow-y-auto">
        <h1 className="text-white text-xl font-semibold mb-4">Settings</h1>
        <div className="space-y-1">
          <SidebarButton
            label="Playback"
            isActive={activePage === "Playback"}
            onClick={() => setActivePage("Playback")}
            icon={<Play size={22} />}
          />
          <SidebarButton
            label="Lyrics"
            isActive={activePage === "Lyrics"}
            onClick={() => setActivePage("Lyrics")}
            icon={<Quotes size={22} />}
          />
          {/* Tambahkan menu lain sesuai kebutuhan */}
        </div>
      </div>

      {/* Separator Line */}
      <div className="w-[1px] bg-gray-700"></div>

      {/* Content Area */}
      <div className="w-full sm:w-2/3 md:w-3/4 p-5 py-2 h-full overflow-y-auto">
        <div className="h-full text-white">{renderContent()}</div>
      </div>
    </div>
  );
};

// Untuk kompatibilitas dengan kode yang sudah ada
const SettingsModal = useSettingsModal;

export default SettingsModal;
