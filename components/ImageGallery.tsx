import React, { useRef } from 'react';
import type { UploadedImage } from '../types.ts';

interface ImageGalleryProps {
    images: UploadedImage[];
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    onImageUpload: (files: File[]) => void;
    onClearAll: () => void;
    onRemove: (index: number) => void;
}

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009.894 2H9zM7 6h6v10H7V6z" clipRule="evenodd" />
    </svg>
);

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, selectedIndex, onSelect, onImageUpload, onClearAll, onRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onImageUpload(Array.from(e.target.files));
            e.target.value = '';
        }
    };

    const handleRemoveClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation(); 
        onRemove(index);
    }

    const handleClearAllClick = () => {
        const confirmationMessage = "您确定要清空所有图片和编辑历史吗？此操作无法撤销。";
        if (window.confirm(confirmationMessage)) {
            onClearAll();
        }
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-base-200/80 backdrop-blur-sm border-t border-base-300 p-2 z-10">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex-1 flex items-center gap-3 overflow-x-auto py-2">
                    {images.map((image, index) => (
                        <div
                            key={`${image.name}-${index}`}
                            onClick={() => onSelect(index)}
                            className={`relative group flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer transition-all duration-200 border-2 ${selectedIndex === index ? 'border-brand-primary scale-105' : 'border-transparent hover:border-base-300'}`}
                        >
                            <img
                                src={`data:${image.type};base64,${image.base64}`}
                                alt={image.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <button
                                onClick={(e) => handleRemoveClick(e, index)}
                                className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                aria-label={`Remove ${image.name}`}
                             >
                                <RemoveIcon />
                            </button>
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                     <label
                        onClick={handleAddClick}
                        className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-base-300 rounded-md cursor-pointer hover:bg-base-300 hover:border-brand-primary transition-colors"
                    >
                        <AddIcon />
                        <span className="text-xs mt-1 text-text-secondary">添加图片</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                            aria-label="Add more images"
                        />
                    </label>
                </div>
                <button
                    onClick={handleClearAllClick}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-red-300 bg-red-800/50 hover:bg-red-700/70 rounded-md transition-colors"
                >
                    <ClearIcon />
                    清空全部
                </button>
            </div>
        </footer>
    );
};