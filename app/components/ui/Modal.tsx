import React from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  title,
  children,
  widthClass = "max-w-lg",
}) => {
  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black/30 backdrop-blur-sm z-50">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 pt-4 w-full ${widthClass}`}
      >
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-semibold">{title || "Modal Title"}</h3>
          <button
            className="text-gray-600 text-2xl hover:text-gray-900"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>

        <div className="text-gray-700 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
