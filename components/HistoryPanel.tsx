import React from 'react';
import type { HistoryEntry } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { TrashIcon, XIcon } from './Icons';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onLoad: (entry: HistoryEntry) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onDelete, onLoad }) => {
  const { t, locale } = useLocalization();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 ${locale === 'fa' ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0' 
            : (locale === 'fa' ? '-translate-x-full' : 'translate-x-full')
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('historyTitle')}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <XIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </header>
          <div className="flex-grow overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>{t('historyPlaceholder')}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {history.map(entry => (
                  <li key={entry.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{entry.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(entry.date)}</p>
                      </div>
                      <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label={t('delete')}
                      >
                          <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => onLoad(entry)}
                      className="w-full mt-3 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      {t('load')}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};