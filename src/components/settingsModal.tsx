import { useModal } from "../context/ModalContext";

const SettingsModal = () => {
  const { openModal, setContentModal } = useModal();
  
  const handleOpen = () => {
    setContentModal(
      <div className="flex flex-col sm:flex-row h-full overflow-hidden">
        <div className="w-full sm:w-1/3 md:w-1/4 p-4 border-r border-gray-800 h-full overflow-y-auto">
          <h1 className="text-white text-lg font-semibold mb-4">Menu</h1>
        </div>
        <div className="w-full sm:w-2/3 md:w-3/4 p-4 h-full overflow-y-auto">
          <div className="h-full">
            {/* Page content will go here */}
          </div>
        </div>
      </div>
    )

    openModal();
  };

  return handleOpen;
};

export default SettingsModal;
