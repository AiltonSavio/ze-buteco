import React from "react";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      {/* Modal content */}
      <div className="relative bg-primary rounded-lg p-6 z-10 max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
