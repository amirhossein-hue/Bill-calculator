import React, { useState, useCallback } from 'react';
import type { Room, Person, Bill, CalculationWeights } from './types';
import { BillSetup } from './components/BillSetup';
import { RoomCard } from './components/RoomCard';
import { ResultsDisplay } from './components/ResultsDisplay';
import { PlusIcon, ChevronDownIcon, SunIcon, MoonIcon } from './components/Icons';
import { useBillCalculation } from './hooks/useBillCalculation';
import { CalculationExplanation } from './components/CalculationExplanation';
import { useLocalization } from './context/LocalizationContext';
import { useTheme } from './context/ThemeContext';

const INITIAL_ROOMS: Room[] = [
  {
    id: 'room1',
    name: 'اتاق بزرگ ۱',
    area: 2,
    occupants: [{ id: 'person1', name: 'نفر اول', daysPresent: 30 }],
  },
  {
    id: 'room2',
    name: 'اتاق بزرگ ۲',
    area: 2,
    occupants: [
      { id: 'person2', name: 'نفر دوم', daysPresent: 30 },
      { id: 'person3', name: 'نفر سوم', daysPresent: 15 },
    ],
  },
  {
    id: 'room3',
    name: 'اتاق کوچک',
    area: 1,
    occupants: [{ id: 'person4', name: 'نفر چهارم', daysPresent: 20 }],
  },
];

const INITIAL_BILL: Bill = {
  amount: 1000,
  daysInPeriod: 30,
  currency: 'EUR',
};

const INITIAL_WEIGHTS: CalculationWeights = {
  area: 0.4,
  personDays: 0.6,
};

const App: React.FC = () => {
  const { t, locale, setLocale } = useLocalization();
  const { theme, toggleTheme } = useTheme();

  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bill, setBill] = useState<Bill>(INITIAL_BILL);
  const [weights, setWeights] = useState<CalculationWeights>(INITIAL_WEIGHTS);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  
  const results = useBillCalculation(rooms, bill, weights);

  const toggleExplanation = useCallback(() => {
    setIsExplanationOpen(prev => !prev);
  }, []);

  const addRoom = () => {
    const newRoom: Room = {
      id: `room_${Date.now()}`,
      name: `${t('roomNamePlaceholder')} ${rooms.length + 1}`,
      area: 1,
      occupants: [],
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = useCallback((id: string, updatedRoom: Partial<Room>) => {
    setRooms(prevRooms =>
      prevRooms.map(room => (room.id === id ? { ...room, ...updatedRoom } : room))
    );
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
  }, []);

  const addOccupant = useCallback((roomId: string) => {
    const newPerson: Person = {
      id: `person_${Date.now()}`,
      name: '',
      daysPresent: bill.daysInPeriod,
    };
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId
          ? { ...room, occupants: [...room.occupants, newPerson] }
          : room
      )
    );
  }, [bill.daysInPeriod]);

  const updateOccupant = useCallback((roomId: string, personId: string, updatedPerson: Partial<Person>) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId
          ? {
              ...room,
              occupants: room.occupants.map(person =>
                person.id === personId ? { ...person, ...updatedPerson } : person
              ),
            }
          : room
      )
    );
  }, []);
  
  const removeOccupant = useCallback((roomId: string, personId: string) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId
          ? { ...room, occupants: room.occupants.filter(p => p.id !== personId) }
          : room
      )
    );
  }, []);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                {t('appTitle')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('appSubtitle')}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <button
                    onClick={() => setLocale('en')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${locale === 'en' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow' : 'text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'}`}
                >
                    EN
                </button>
                 <button
                    onClick={() => setLocale('fa')}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${locale === 'fa' ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow' : 'text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'}`}
                >
                    FA
                </button>
             </div>
             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {theme === 'light' ? <MoonIcon className="h-6 w-6"/> : <SunIcon className="h-6 w-6 text-yellow-400"/>}
             </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BillSetup bill={bill} onBillChange={setBill} weights={weights} onWeightsChange={setWeights} />
            
            <div className="my-6">
                <button
                    onClick={toggleExplanation}
                    className="w-full flex justify-between items-center text-left px-5 py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    aria-expanded={isExplanationOpen}
                    aria-controls="calculation-explanation"
                >
                    <span>{t('howToCalculate')}</span>
                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${isExplanationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isExplanationOpen && <div id="calculation-explanation"><CalculationExplanation /></div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        updateRoom={updateRoom}
                        removeRoom={removeRoom}
                        addOccupant={addOccupant}
                        updateOccupant={updateOccupant}
                        removeOccupant={removeOccupant}
                    />
                ))}
            </div>
            <div className="mt-6">
                <button
                    onClick={addRoom}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all"
                >
                    <PlusIcon className="h-5 w-5" />
                    {t('addRoom')}
                </button>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="sticky top-28">
                <ResultsDisplay results={results} totalAmount={bill.amount} currency={bill.currency} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;