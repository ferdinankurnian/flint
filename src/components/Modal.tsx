import React from "react";
import { X } from "@phosphor-icons/react";
import { useModal } from "../context/ModalContext";

const Modal: React.FC = () => {

  const { isOpen, closeModal, contentModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 z-100 w-full h-full bg-transparent flex justify-center items-center backdrop-blur-sm">
      <div className="bg-[#131313] rounded-lg shadow-lg w-full h-full md:w-4xl md:h-auto">
        <div className="p-4 h-full relative">
          <button
            className="absolute right-4 hover:text-gray-200 cursor-pointer"
            onClick={closeModal}
          >
            <X size={24} weight="bold" />
          </button>
          {contentModal}
        </div>
      </div>
    </div>
  );
};

export default Modal;
