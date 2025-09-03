import React, { useState, useRef } from 'react';
import { HotPrompts } from './HotPrompts.tsx';
import { PresetPrompts } from './PresetPrompts.tsx';
import { LoadingSpinner } from './LoadingSpinner.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';

const GenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V8a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H8a1 1 0 001-1v-.5z" />
        <path d="M6 4.5a1.5 1.5 0 013 0V5a1 1 0 001 1h.5a1.5 1.5 0 010 3H10a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V10a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H5a1 1 0 001-1v-.5zM10 12a1.5 1.5 0 013 0v.5a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V16a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H8a1 1 0 001-1v-.5z" />
    </svg>
);
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
const MonkeyLogo = () => (
    <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bananaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#fef08a'}} />
          <stop offset="100%" style={{stopColor: '#facc15'}} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <g transform="rotate(-30 100 100)">
        {/* Banana Body */}
        <path d="M50,150 C 50,100 100,60 150,70 C 160,120 110,160 70,155 C 60,153 50,150 50,150 Z" fill="url(#bananaGradient)" />
        
        {/* Banana Ends */}
        <path d="M48,152 C 45,145 45,135 50,130 L 55,135 C 50,140 50,148 48,152 Z" fill="#a16207" />
        
        {/* Pixelation effect */}
        <g transform="translate(140, 60)">
          <rect x="5" y="5" width="8" height="8" fill="#fef08a" className="animate-pulse-fast" style={{animationDelay: '0.1s'}}/>
          <rect x="15" y="-5" width="12" height="12" fill="#facc15" className="animate-pulse-fast" style={{animationDelay: '0.3s'}}/>
          <rect x="25" y="10" width="10" height="10" fill="#eab308" className="animate-pulse-fast" style={{animationDelay: '0.2s'}}/>
          <rect x="10" y="25" width="6" height="6" fill="#fef9c3" className="animate-pulse-fast" style={{animationDelay: '0.4s'}}/>
          <rect x="30" y="-10" width="7" height="7" fill="#facc15" className="animate-pulse-fast" style={{animationDelay: '0.1s'}}/>
          <rect x="40" y="5" width="9" height="9" fill="#fef08a" className="animate-pulse-fast" style={{animationDelay: '0.5s'}}/>
        </g>
    
        {/* Sparkles */}
        <g fill="#fef9c3" filter="url(#glow)">
            <path d="M130 50 L 132 45 L 134 50 L 139 52 L 134 54 L 132 59 L 130 54 L 125 52 Z" />
            <path d="M80 80 L 81 77 L 82 80 L 85 81 L 82 82 L 81 85 L 80 82 L 77 81 Z" opacity="0.7" />
        </g>
      </g>
    </svg>
);


interface GenerationUIProps {
  onGenerate: (prompt: string) => void;
  onImageUpload: (files: File[]) => void;
  isLoading: boolean;
  error: string | null;
}

export const GenerationUI: React.FC<GenerationUIProps> = ({ onGenerate, onImageUpload, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] max-w-5xl mx-auto px-4 animate-fade-in">
      <main className="flex-1 flex flex-col items-center justify-center pt-8 md:pt-12">
        {isLoading ? (
          <div className="flex flex-col items-center text-center">
            <LoadingSpinner />
            <p className="mt-4 text-text-secondary">AI正在为您生成图片...</p>
            <p className="text-sm text-gray-400">请稍候...</p>
          </div>
        ) : (
          <div className="w-full text-center animate-fade-in">
            <div className="inline-block animate-logo-intro">
              <MonkeyLogo />
            </div>

            <div className="max-w-4xl mx-auto mt-4 mb-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <HotPrompts onHotPromptSelect={setPrompt} disabled={isLoading} />
                    <PresetPrompts onPresetSelect={setPrompt} disabled={isLoading} />
                 </div>
            </div>
          </div>
        )}
      </main>

      <footer className="flex-shrink-0 w-full mx-auto mt-auto pb-4 md:pb-8">
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            className="w-full h-16 p-4 pr-48 bg-base-200 border border-base-300 rounded-lg text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
            placeholder="例如：一只戴着宇航员头盔的猫在月球上..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            disabled={isLoading}
            aria-label="Image generation prompt"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isLoading}
              className="p-2 text-text-secondary hover:text-brand-primary disabled:opacity-50 transition-colors"
              title="上传图片进行编辑"
              aria-label="Upload an image to edit"
            >
              <UploadIcon />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-3 inline-flex items-center justify-center border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <GenerateIcon />
              <span className="ml-2">生成</span>
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};