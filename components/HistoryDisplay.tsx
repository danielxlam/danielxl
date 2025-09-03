

import React from 'react';
import type { HistoryEntry } from '../types.ts';

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
  disabled: boolean;
}

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onSelect, onDelete, disabled }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-text-secondary mb-2">编辑历史</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {history.map((entry) => (
          <div key={entry.timestamp} className="relative group flex-shrink-0">
            <button
              type="button"
              onClick={() => onSelect(entry)}
              disabled={disabled}
              title={`点击恢复此版本\n提示: "${entry.prompt}"`}
              className="w-16 h-16 rounded-md overflow-hidden cursor-pointer transition-transform duration-200 border-2 border-base-300 group-hover:border-brand-primary group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label={`Restore edit from ${new Date(entry.timestamp).toLocaleString()}`}
            >
              <img
                src={entry.thumbnail}
                alt={`Edit result`}
                className="w-full h-full object-cover"
              />
            </button>
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry);
                }}
                disabled={disabled}
                className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-800 transition-all disabled:opacity-0"
                aria-label={`Delete edit from ${new Date(entry.timestamp).toLocaleString()}`}
            >
                <RemoveIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};