import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  contentModal: ReactNode;
  setContentModal: (content: ReactNode) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentModal, setContentModal] = useState<ReactNode>(null);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const setContent = useCallback((content: ReactNode) => setContentModal(content), []);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, contentModal, setContentModal: setContent }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal should be used on ModalProvider");
  return context;
}
