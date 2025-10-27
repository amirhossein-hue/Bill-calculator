import React, { useState, useEffect } from 'react';
import type { Bill, CalculationWeights, Currency } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { CalendarIcon } from './Icons';

interface BillSetupProps {
  bill: Bill;
  onBillChange: (newBill: Bill) => void;
  weights: CalculationWeights;
  onWeightsChange: (newWeights: CalculationWeights) => void;
}

const CURRENCY_OPTIONS: { value: Currency; label: string }[] = [
    { value: 'EUR', label: '€ Euro' },
    { value: 'USD', label: '$ Dollar' },
    { value: 'TOMAN', label: 'تومان Toman' },
];

export const BillSetup: React.FC<BillSetupProps> = ({ bill, onBillChange, weights, onWeightsChange }) => {
  const { t } = useLocalization();
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (end >= start) {
                const diffTime = end.getTime() - start.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
                onBillChange({ ...bill, daysInPeriod: diffDays });
            }
        } catch (error) {
            console.error("Invalid date format", error);
        }
    }
  }, [startDate, endDate]);

  const handleWeightSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const areaPercentage = parseInt(e.target.value, 10);
    onWeightsChange({
      area: areaPercentage / 100,
      personDays: (100 - areaPercentage) / 100,
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onBillChange({ ...bill, currency: e.target.value as Currency });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('billInfo')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="billAmount" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('billAmount')}
          </label>
          <div className="group flex relative shadow-sm rounded-lg focus-within:ring-2 focus-within:ring-indigo-500">
            <input
                type="number"
                id="billAmount"
                value={bill.amount || ''}
                onChange={(e) => onBillChange({ ...bill, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none transition z-10 rounded-l-lg rtl:rounded-r-lg"
                placeholder={t('billAmountPlaceholder')}
            />
            <select
                value={bill.currency}
                onChange={handleCurrencyChange}
                className="px-2 py-2 border-y border-r rtl:border-r-0 rtl:border-l border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none transition rounded-r-lg rtl:rounded-l-lg"
            >
                {CURRENCY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
        <div>
            <label htmlFor="billDays" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {t('billDays')}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    id="billDays"
                    value={bill.daysInPeriod || ''}
                    onChange={(e) => onBillChange({ ...bill, daysInPeriod: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder={t('billDaysPlaceholder')}
                />
                <button
                    onClick={() => setShowDateRange(prev => !prev)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title={t('selectDateRange')}
                >
                    <CalendarIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      </div>
       {showDateRange && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('startDate')}</label>
                  <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                  />
              </div>
              <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('endDate')}</label>
                  <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
                  />
              </div>
          </div>
      )}
      <div className="mt-8">
        <label htmlFor="weightSlider" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {t('shareAllocation')}
        </label>
        <input
          id="weightSlider"
          type="range"
          min="0"
          max="100"
          value={weights.area * 100}
          onChange={handleWeightSliderChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
          <span className="text-purple-600 dark:text-purple-400">{t('personDaysShare')}: {Math.round(weights.personDays * 100)}%</span>
          <span className="text-teal-600 dark:text-teal-400">{t('areaShare')}: {Math.round(weights.area * 100)}%</span>
        </div>
      </div>
    </div>
  );
};