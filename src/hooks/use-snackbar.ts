import { useContext } from 'react';
import { SnackbarContext } from '@/context/SnackbarContext'; // Импортируем контекст

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
