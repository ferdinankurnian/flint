import { DotsThreeVertical } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

const DropdownItem = ({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  // Get access to the parent's setIsOpen function through context
  const { closeDropdown } = useDropdownContext();

  const handleClick = () => {
    if (disabled) return;

    // First execute the original onClick
    onClick();
    // Then close the dropdown
    closeDropdown();
  };

  return (
    <button
      className={`block w-full text-left px-4 py-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis
        ${
          disabled
            ? "opacity-50 text-gray-500"
            : "hover:bg-[#00000057] hover:text-gray-100 text-gray-300"
        }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const DropdownSeparator = () => (
  <div className="border-t border-gray-600 my-1"></div>
);

// Create a context to share the setIsOpen function
const DropdownContext = React.createContext<{ closeDropdown: () => void }>({
  closeDropdown: () => {},
});

const useDropdownContext = () => React.useContext(DropdownContext);

const Dropdown = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <DropdownContext.Provider value={{ closeDropdown }}>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <button
            type="button"
            className="text-white hover:bg-[#00000038] rounded-lg p-2 cursor-pointer"
            id="menu-button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() => setIsOpen(!isOpen)}
          >
            <DotsThreeVertical size={24} />
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } origin-top-right absolute right-0 mt-2 w-auto z-50 rounded-md shadow-lg bg-black/50 backdrop-blur-sm transition-all duration-150`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          aria-hidden={!isOpen}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      </div>
    </DropdownContext.Provider>
  );
};

export { Dropdown, DropdownItem, DropdownSeparator };
