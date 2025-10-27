import React, { useMemo } from 'react';
import type { Result, Currency } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface ResultsDisplayProps {
  results: Result[];
  totalAmount: number;
  currency: Currency;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, totalAmount, currency }) => {
  const { t, locale } = useLocalization();

  const calculatedTotal = results.reduce((sum, result) => sum + result.share, 0);
  const difference = totalAmount - calculatedTotal;

  const formatCurrency = useMemo(() => {
    const numberFormatOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    if (currency === 'TOMAN') {
      return (amount: number) => {
        const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
            ...numberFormatOptions,
        }).format(amount);
        return locale === 'fa' ? `${formatted} تومان` : `${formatted} Toman`;
      };
    }

    return (amount: number) => {
        return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
            ...numberFormatOptions,
            style: 'currency',
            currency: currency,
        }).format(amount);
    }
  }, [currency, locale]);


  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-900 rounded-2xl shadow-2xl p-6 text-white">
      <div className="flex justify-between items-center mb-6 border-b border-white/30 pb-4">
        <h2 className="text-2xl font-bold">{t('resultsTitle')}</h2>
      </div>
      {results.length > 0 ? (
        <>
          <ul className="space-y-3">
            {results.map((result, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center bg-white/20 p-4 rounded-xl backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <span className="font-semibold">{result.name}</span>
                <span className="font-bold text-lg tracking-wider">{formatCurrency(result.share)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t-2 border-dashed border-white/30">
            <div className="flex justify-between items-center font-semibold mb-2 opacity-80">
              <span>{t('calculatedTotal')}</span>
              <span>{formatCurrency(calculatedTotal)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-xl">
              <span>{t('billTotal')}</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            {Math.abs(difference) > 0.01 && (
              <div className="mt-3 text-xs text-center text-white/70">
                {t('roundingDifference', { difference: formatCurrency(difference) })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="opacity-80">{t('resultsPlaceholder')}</p>
        </div>
      )}
    </div>
  );
};
