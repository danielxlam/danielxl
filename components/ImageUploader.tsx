
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (files: File[]) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4h-3l-4 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4-4 4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(Array.from(e.target.files));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(Array.from(e.dataTransfer.files));
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const baseClasses = "flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ease-in-out";
  const inactiveClasses = "border-base-300 bg-base-200 hover:bg-base-300";
  const activeClasses = "border-brand-primary bg-yellow-400/20";

  return (
    <div className="flex items-center justify-center p-4">
      <label
        htmlFor="dropzone-file"
        className={`${baseClasses} ${isDragging ? activeClasses : inactiveClasses}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon />
          <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">点击上传</span> 或拖拽文件到此处</p>
          <p className="text-xs text-gray-400">支持多张图片 (PNG, JPG, WEBP 等)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
      </label>
    </div>
  );
};
