import { useState, ReactNode } from 'react';
import { SnackbarContext, SnackbarType } from '@/context/SnackbarContext'; // Импортируем контекст и типы

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info'); // SnackbarType импортирован
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const showSnackbar = (msg: string, variant: SnackbarType = 'info') => {
    setMessage(msg);
    setType(variant);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {visible && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 min-w-[240px] max-w-[90%] px-4 py-3 pr-10 rounded-xl shadow-lg flex items-center text-white text-md transition-all duration-300 z-[70]
            ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : type === 'info' ? 'bg-blue-500' : 'bg-gray-700'}`}
        >
          {/* Иконка */}
          <span className='mr-3'>
            {type === 'success' && '✅'}
            {type === 'error' && '❌'}
            {type === 'info' && 'ℹ️'}
            {type === 'warning' && '⚠️'}
            {type !== 'success' &&
              type !== 'error' &&
              type !== 'info' &&
              type !== 'warning' &&
              'ℹ️'}
          </span>

          {/* Сообщение */}
          <span className='flex-1'>{message}</span>

          {/* Кнопка закрытия */}
          <button
            onClick={() => setVisible(false)}
            className='absolute top-1 right-2 text-white hover:text-gray-200'
          >
            ✖
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
