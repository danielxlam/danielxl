import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-brand-primary transition-colors z-10"
        aria-label="Close image preview"
      >
        <CloseIcon />
      </button>
      <div 
        className="relative p-4 max-w-[90vw] max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Enlarged view of the edited image"
          className="w-auto h-auto max-w-full max-h-full object-contain cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
};