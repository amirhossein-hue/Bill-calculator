import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

export const CalculationExplanation: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-4 border border-gray-100 dark:border-gray-700 animate-fade-in-down">
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('calculationStepsTitle')}</h3>
      <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        
        <div>
          <h4 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">{t('step1Title')}</h4>
          <p className="mt-1">{t('step1Desc')}</p>
          <ul className="list-decimal list-inside space-y-2 mt-2 pl-4">
            <li><strong>{t('step1_1')}</strong><br/>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1 rounded-md inline-block">{t('step1_1_code')}</code>
            </li>
            <li><strong>{t('step1_2')}</strong><br/>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1 rounded-md inline-block">{t('step1_2_code')}</code>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-lg text-purple-600 dark:text-purple-400">{t('step2Title')}</h4>
          <p className="mt-1">{t('step2Desc')}</p>
          <ul className="list-decimal list-inside space-y-2 mt-2 pl-4">
            <li><strong>{t('step2_1')}</strong><br/>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1 rounded-md inline-block">{t('step2_1_code')}</code>
            </li>
            <li><strong>{t('step2_2')}</strong><br/>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1 rounded-md inline-block">{t('step2_2_code')}</code>
            </li>
            <li><strong>{t('step2_3')}</strong><br/>
              <code className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-1 rounded-md inline-block">{t('step2_3_code')}</code>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-lg text-teal-600 dark:text-teal-400">{t('step3Title')}</h4>
          <ul className="list-decimal list-inside space-y-2 mt-2 pl-4">
            <li><strong>{t('step3_1')}</strong><br/>
              <p>{t('step3_1_desc')}</p>
            </li>
            <li><strong>{t('step3_2')}</strong><br/>
              <p>{t('step3_2_desc')}</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};