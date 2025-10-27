import React, { useState, useEffect, useCallback } from 'react';
import type { Room, Person } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { HomeIcon, UsersIcon, PlusIcon, TrashIcon, CalendarIcon } from './Icons';

// Sub-component for a single person's row
const PersonRow: React.FC<{
  person: Person;
  onUpdate: (id: string, updatedPerson: Partial<Person>) => void;
  onRemove: (id: string) => void;
}> = ({ person, onUpdate, onRemove }) => {
  const { t } = useLocalization();
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      try {
          const startParts = startDate.split('-').map(Number);
          const endParts = endDate.split('-').map(Number);
          // Use Date.UTC to create timezone-agnostic dates for accurate day counting
          const start = new Date(Date.UTC(startParts[0], startParts[1] - 1, startParts[2]));
          const end = new Date(Date.UTC(endParts[0], endParts[1] - 1, endParts[2]));

          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
              const diffTime = end.getTime() - start.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
              onUpdate(person.id, { daysPresent: diffDays });
          }
      } catch (e) {
        console.error("Invalid date format", e);
      }
    }
  }, [startDate, endDate, person.id, onUpdate]);

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If user types in days, clear the date picker
    setStartDate('');
    setEndDate('');
    onUpdate(person.id, { daysPresent: parseInt(e.target.value, 10) || 0 });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={person.name}
          onChange={(e) => onUpdate(person.id, { name: e.target.value })}
          placeholder={t('personNamePlaceholder')}
          className="flex-grow px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
        />
        <input
          type="number"
          value={person.daysPresent || ''}
          onChange={handleDaysChange}
          placeholder={t('daysPresentPlaceholder')}
          className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
          disabled={isDatePickerOpen && !!startDate && !!endDate}
        />
        <button 
          onClick={() => setDatePickerOpen(prev => !prev)}
          className={`p-1.5 rounded-full transition-colors ${isDatePickerOpen ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          title={t('selectDateRange')}
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
        <button onClick={() => onRemove(person.id)} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label={t('deletePerson')}>
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      {isDatePickerOpen && (
         <div className="grid grid-cols-2 gap-2 mt-2 pl-2 pr-12 rtl:pr-2 rtl:pl-12">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('startDate')}</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-xs focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('endDate')}</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md text-xs focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
              />
            </div>
         </div>
      )}
    </div>
  );
};


// Main RoomCard component
interface RoomCardProps {
  room: Room;
  updateRoom: (id: string, updatedRoom: Partial<Room>) => void;
  removeRoom: (id: string) => void;
  addOccupant: (roomId: string) => void;
  updateOccupant: (roomId: string, personId: string, updatedPerson: Partial<Person>) => void;
  removeOccupant: (roomId: string, personId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  updateRoom,
  removeRoom,
  addOccupant,
  updateOccupant,
  removeOccupant,
}) => {
  const { t } = useLocalization();

  const handleUpdateOccupant = useCallback((personId: string, updatedPerson: Partial<Person>) => {
    updateOccupant(room.id, personId, updatedPerson);
  }, [room.id, updateOccupant]);

  const handleRemoveOccupant = useCallback((personId: string) => {
    removeOccupant(room.id, personId);
  }, [room.id, removeOccupant]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <input
          type="text"
          value={room.name}
          onChange={(e) => updateRoom(room.id, { name: e.target.value })}
          placeholder={t('roomNamePlaceholder')}
          className="text-xl font-bold text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded -ml-1 p-1"
        />
        <button onClick={() => removeRoom(room.id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" aria-label={t('deleteRoom')}>
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          <HomeIcon className="h-4 w-4" />
          {t('areaLabel')}
        </label>
        <input
          type="number"
          value={room.area}
          onChange={(e) => updateRoom(room.id, { area: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
          <UsersIcon className="h-4 w-4" />
          {t('occupants')}
        </label>
        <div className="space-y-3">
          {room.occupants.map((person) => (
            <PersonRow 
              key={person.id}
              person={person}
              onUpdate={handleUpdateOccupant}
              onRemove={handleRemoveOccupant}
            />
          ))}
        </div>
        <button
          onClick={() => addOccupant(room.id)}
          className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
        >
          <PlusIcon className="h-4 w-4"/>
          {t('addPerson')}
        </button>
      </div>
    </div>
  );
};