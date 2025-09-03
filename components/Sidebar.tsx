
import React, { useState } from 'react';
import { EditControls } from './EditControls.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';
import type { HistoryEntry } from '../types.ts';

interface SidebarProps {
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
  error: string | null;
  hasMask: boolean;
}

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
  
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-secondary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 110 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { error, ...editControlsProps } = props;

    return (
        <aside className={`relative transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:w-16' : 'lg:w-1/3'} w-full flex-shrink-0 bg-base-200 rounded-lg border border-base-300`}>
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex absolute top-1/2 -left-4 z-20 -translate-y-1/2 items-center justify-center w-8 h-8 bg-base-300 text-text-secondary hover:bg-brand-primary hover:text-black rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>
            
            <div className={`h-full w-full transition-opacity duration-200 ${isCollapsed ? 'lg:opacity-0 lg:pointer-events-none' : 'opacity-100'} p-4`}>
                 <EditControls {...editControlsProps} />
                 {error && <ErrorMessage message={error} />}
            </div>

            {isCollapsed && (
                 <div className="hidden lg:flex items-center justify-center h-full w-full absolute inset-0">
                    <EditIcon />
                 </div>
             )}
        </aside>
    );
};