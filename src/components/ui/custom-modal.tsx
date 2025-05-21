import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function CustomModal({ open, onClose, title, children }: CustomModalProps) {
  const titleId = useId(); // Генерируем уникальный ID для заголовка

  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={ () => {
        // Добавляем небольшую задержку, чтобы предотвратить возможное "прокликивание",
        // когда событие клика может распространиться на элементы под модальным окном
        // после его удаления из DOM.
        setTimeout(onClose, 0); // Вызываем onClose асинхронно
      }}
    >
      <div // Осн. Контейнер. Становится flex-контейнером; overflow-y-auto убирается отсюда и переносится на тело; p-6 также будет применен к дочерним элементам
        className="relative bg-white max-w-3xl w-full max-h-[80vh] rounded-xl shadow-lg flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined} // Связываем с заголовком, если он есть
        onClick={(e) => e.stopPropagation()} // предотвращает закрытие по клику внутри модалки
      >
        {/* Кнопка "X" */}
        {/* <button
          // Для кнопки закрытия также лучше использовать setTimeout, если есть риск прокликивания
          // на элементы под модальным окном, хотя это менее вероятно, чем с оверлеем.
          // В данном случае, если кнопка "X" находится строго внутри контента модального окна,
          // e.stopPropagation() на родительском div должно быть достаточно.
          // Но для консистентности можно добавить: onClick={() => setTimeout(onClose, 0)}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Закрыть"
        >
          ✕
        </button> */}
        {/* Фиксированный заголовок модального окна */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          {title && (
            <h2 id={titleId} className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            aria-label="Закрыть"
          >
            ✕
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* {title && <h2 id={titleId} className="text-xl font-bold mb-4">{title}</h2>}
        {children} */}
        {/* Прокручиваемое тело модального окна */}
        <div className="p-4 md:p-5 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
