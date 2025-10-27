export interface Person {
  id: string;
  name: string;
  daysPresent: number;
}

export interface Room {
  id:string;
  name: string;
  area: number;
  occupants: Person[];
}

export type Currency = 'EUR' | 'USD' | 'TOMAN';

export interface Bill {
  amount: number;
  daysInPeriod: number;
  currency: Currency;
}

export interface CalculationWeights {
  area: number; // e.g., 0.4 for 40%
  personDays: number; // e.g., 0.6 for 60%
}

export interface Result {
  name: string;
  share: number;
}

// FIX: Define the missing HistoryEntry type.
export interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  state: {
    rooms: Room[];
    bill: Bill;
    weights: CalculationWeights;
  };
}
