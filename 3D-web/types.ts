export enum UserRole {
  CONSUMER = 'CONSUMER',
  FARM_OWNER = 'FARM_OWNER',
  DESIGNER = 'DESIGNER'
}

export interface PrinterStatus {
  id: string;
  name: string;
  status: 'IDLE' | 'PRINTING' | 'ERROR' | 'OFFLINE';
  currentJob?: string;
  progress: number;
  filamentRemaining: number; // percentage
  temperature: number;
}

export interface FilamentStock {
  id: string;
  color: string;
  material: 'PLA' | 'ABS' | 'PETG' | 'TPU';
  weightRemaining: number; // grams
  rfidTag: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}