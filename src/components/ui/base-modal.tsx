import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  preventClickOutside?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  className,
  showCloseButton = true,
  maxWidth = "md",
  preventClickOutside = false,
}: BaseModalProps) {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!preventClickOutside) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "bg-white rounded-lg shadow-xl relative transform transition-all",
          "w-full animate-modal-scale-fade-in",
          maxWidthClasses[maxWidth],
          className
        )}
        onClick={handleContentClick}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={t("common.close")}
          >
            <X />
          </button>
        )}

        {/* {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )} */}

        <div className={cn("p-6", !title && "pt-8")}>
          {children}
        </div>
      </div>
    </div>
  );
}
