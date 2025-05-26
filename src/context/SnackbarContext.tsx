import { createContext } from 'react';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

// Контекст теперь определяется здесь
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
