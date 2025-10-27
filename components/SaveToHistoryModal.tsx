import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface SaveToHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

export const SaveToHistoryModal: React.FC<SaveToHistoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useLocalization();
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(''); // Reset title when modal opens
    }
  }, [isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md"
        // Prevent clicks inside the modal from closing it
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('saveModalTitle')}</h2>
        <label htmlFor="historyTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('saveModalPrompt')}
        </label>
        <input
          id="historyTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('saveModalPlaceholder')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
            disabled={!title.trim()}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};