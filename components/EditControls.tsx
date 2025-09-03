import React from 'react';
import { PresetPrompts } from './PresetPrompts.tsx';
import { HotPrompts } from './HotPrompts.tsx';
import { HistoryDisplay } from './HistoryDisplay.tsx';
import { MaskingPrompts } from './MaskingPrompts.tsx';
import type { HistoryEntry } from '../types.ts';

interface EditControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  editedImageUrl: string | null;
  originalImageName: string;
  onUseAsSource: () => void;
  history: HistoryEntry[];
  onHistorySelect: (entry: HistoryEntry) => void;
  onHistoryDelete: (entry: HistoryEntry) => void;
  hasMask: boolean;
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 110 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const RegenerateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 11M20 20l-1.5-1.5A9 9 0 003.5 13" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const UseAsSourceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      <path d="M10 9a1 1 0 00-1 1v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" />
    </svg>
);

const ResetIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009.894 2H9zM7 6h6v10H7V6z" clipRule="evenodd" />
    </svg>
);


export const EditControls: React.FC<EditControlsProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  onReset,
  isLoading,
  editedImageUrl,
  originalImageName,
  onUseAsSource,
  history,
  onHistorySelect,
  onHistoryDelete,
  hasMask,
}) => {
  const handleSaveImage = () => {
    if (!editedImageUrl) return;
    const link = document.createElement('a');
    link.href = editedImageUrl;
    const name = originalImageName.substring(0, originalImageName.lastIndexOf('.')) || originalImageName;
    link.download = `${name}-edited.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-text-primary mb-4">编辑指令</h2>
      <textarea
        className="w-full h-32 p-3 bg-base-300 border border-gray-600 rounded-md text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
        placeholder="例如：给猫咪加上一顶巫师帽..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
        aria-label="Image editing prompt"
      />
      
      {hasMask ? (
        <MaskingPrompts onPresetSelect={setPrompt} disabled={isLoading} />
      ) : (
        <>
          <HotPrompts onHotPromptSelect={setPrompt} disabled={isLoading} />
          <PresetPrompts onPresetSelect={setPrompt} disabled={isLoading} />
        </>
      )}
      
      <HistoryDisplay history={history} onSelect={onHistorySelect} onDelete={onHistoryDelete} disabled={isLoading} />
      
      <div className="mt-auto pt-4 flex flex-col space-y-3">
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {editedImageUrl ? <RegenerateIcon /> : <EditIcon />}
          {editedImageUrl ? '重新生成' : '生成图片'}
        </button>

        {editedImageUrl && (
            <div className="flex gap-3 animate-fade-in">
                 <button
                  onClick={handleSaveImage}
                  disabled={isLoading}
                  className="w-1/2 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <SaveIcon />
                  保存
                </button>
                <button
                  onClick={onUseAsSource}
                  disabled={isLoading}
                  className="w-1/2 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <UseAsSourceIcon />
                  以此为素材
                </button>
            </div>
        )}
        
        <button
          onClick={onReset}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-red-300 bg-red-800/50 hover:bg-red-700/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ResetIcon />
          重置
        </button>
      </div>
    </div>
  );
};