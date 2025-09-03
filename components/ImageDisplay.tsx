import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  imageIndex?: number | null;
  onImageClick?: () => void;
  feedbackMessage?: string | null;
  maskUrl?: string | null;
  onMaskButtonClick?: () => void;
}

const ImageIconPlaceholder = () => (
    <svg className="w-16 h-16 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
    </svg>
);

const ZoomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
);

const MaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const ERROR_PLACEHOLDER_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAABABIBAwABAAAABgASAAAAAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAB4cAVoAAIAAAAAAAIAAAAAAmcHAlQAAFRleHQgQ29udGVudCBFeHBvcnRlZCBieSBQb3dlclRvb2xzIGZvciBKYXZhU2NyaXB0/+4ADkFkb2JlAGTAAAAAAf/bAIQACAYGBgYGCAYGBwYGBgYIBgYGBgYGCggGBgYGCQoKCQoJCQoMDAwMDAwMExQUFBQUExUXFxcXGRsbGxsbGxsbGwEJCAgJCQgLCQkLDAsLDwwMDg4ODg4ODg4MDAwMDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg7/wAARCAH0AfQDAREAAhEBAxEB/8QBogAAAAcBAQEBAQAAAAAAAAAABAUDAgYABwgJCgsQAAIBAwMCBAIGBwYDBQgJBQEXAQIDBAAFEQYSIQfgCxMRIgkUQTIjFQlRQhZhJDMXGBkaEioreTJDU2QnLBVFVyhYkVNkNzg5PS4fEJYtK0osJjlPCDg5U1stejhJzA0fEVU1ZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/2gAIAQEAAD8A/lUooVSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUqVKlSpUqVKhSpUqVKlSpUqVKlSpUq...';

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, imageIndex, onImageClick, feedbackMessage, maskUrl, onMaskButtonClick }) => {
    const containerClasses = `relative group w-full aspect-square bg-base-200 rounded-lg overflow-hidden border border-base-300 flex items-center justify-center`;
  
    return (
    <div className="w-full flex flex-col">
        <h2 className="text-lg font-semibold text-text-secondary mb-2 text-center">{title}</h2>
        <div 
            // FIX: Corrected typo from `container-classes` to `containerClasses`.
            className={containerClasses}
            // Add onClick only for the "Edited" image, not for the original
            {...(onImageClick && { onClick: onImageClick, className: `${containerClasses} cursor-pointer` })}
            {...(onImageClick && {role: 'button', 'aria-label': 'View larger image'})}
        >
        {imageUrl ? (
            <>
                <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
                {maskUrl && (
                  <img src={maskUrl} alt="Mask" className="absolute inset-0 w-full h-full object-contain opacity-50 pointer-events-none" />
                )}
                {typeof imageIndex === 'number' && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm font-bold px-2 py-1 rounded-md">
                        {imageIndex + 1}
                    </div>
                )}
                {onImageClick && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <ZoomIcon />
                    </div>
                )}
                {onMaskButtonClick && (
                   <button onClick={onMaskButtonClick} className="absolute top-2 left-2 flex items-center bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-black transition-all">
                       <MaskIcon />
                       局部编辑
                   </button>
                )}
            </>
        ) : feedbackMessage ? (
            <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
                <div className="flex-grow w-full flex items-center justify-center overflow-hidden">
                    <img src={ERROR_PLACEHOLDER_IMAGE} alt="提示" className="max-w-full max-h-full object-contain rounded-md" />
                </div>
                <p className="flex-shrink-0 mt-4 text-base text-yellow-200/90 font-semibold">素材与指令不符合规定哦，<br/>请检查一下指令和素材吧</p>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-text-secondary">
                <ImageIconPlaceholder />
                <span className="mt-2 text-sm">等待生成中...</span>
            </div>
        )}
        </div>
    </div>
  );
};
