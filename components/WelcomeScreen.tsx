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
  <svg className="w-64 h-64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      {/* Banana */}
      <path
          d="M128.6,16.1c11.3,7.9,15,22.6,7.1,33.9s-22.6,15-33.9,7.1c-11.3-7.9-15-22.6-7.1-33.9C102.6,11.9,117.3,8.2,128.6,16.1z"
          fill="#facc15"
      />
      {/* Monkey */}
      <g fill="#E75248">
          {/* Right arm */}
          <path d="M110.4,94.9c0,0-2.3-25.1,10-48.4c1-1.9,4.4-6.3,4.4-6.3" stroke="#E75248" strokeWidth="18" strokeLinecap="round" fill="none"/>
          {/* Body and head */}
          <path d="M100.1,170c-9.3,0-12.7-1.9-12.7-1.9s-12.3-6.5-12.3-24.2c0-21.9,11.1-29,11.1-29s1.1-15.6-8.7-27 c-8.3-9.7-11-21.2-5.7-32.3c4-8.5,12.9-13.8,22.8-13.8c12.2,0,22.6,7.5,26.5,16.5c4.7,10.8,1.4,23.3-7.4,33.4 c-8,9.2-7.8,21.6-7.8,21.6s12.5,9.2,12.5,29.9c0,16.1-13.2,23.1-13.2,23.1S109.4,170,100.1,170z"/>
          {/* Ears */}
          <circle cx="71" cy="67" r="10"/>
          <circle cx="129" cy="67" r="10"/>
          {/* Left arm */}
          <path d="M78.4,120.9c-10.4,9.6-18.7,9-18.7,9s-10.3-4.5-1.9-16.2" stroke="#E75248" strokeWidth="18" strokeLinecap="round" fill="none"/>
          {/* Legs */}
          <path d="M85,164c-5.5,10.6-15.8,14.4-15.8,14.4" stroke="#E75248" strokeWidth="18" strokeLinecap="round" fill="none"/>
          <path d="M115,164c5.5,10.6,15.8,14.4,15.8,14.4" stroke="#E75248" strokeWidth="18" strokeLinecap="round" fill="none"/>
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