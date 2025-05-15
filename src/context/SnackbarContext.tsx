import React, { createContext, useContext, useState, ReactNode } from "react";

type SnackbarType = "success" | "error" | "info";

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("SnackbarContext is missing");
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");
  const [visible, setVisible] = useState(false);

  const showSnackbar = (msg: string, variant: SnackbarType = "info") => {
    setMessage(msg);
    setType(variant);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

//   return (
//     <SnackbarContext.Provider value={{ showSnackbar }}>
//       {children}
//       {visible && (
//         <div
//           className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow text-white text-sm transition-all duration-300
//             ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-500" : "bg-gray-700"}`}
//         >
//           {message}
//         </div>
//       )}
//     </SnackbarContext.Provider>
//   );
return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {visible && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 min-w-[240px] max-w-[90%] px-4 py-3 pr-10 rounded shadow-lg flex items-center text-white text-sm transition-all duration-300
            ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-500" : "bg-gray-700"}`}
        >
          {/* Иконка */}
          <span className="mr-3">
            {type === "success" && "✅"}
            {type === "error" && "❌"}
            {type === "info" && "ℹ️"}
          </span>
  
          {/* Сообщение */}
          <span className="flex-1">{message}</span>
  
          {/* Кнопка закрытия */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-1 right-2 text-white hover:text-gray-200"
          >
            ✖
          </button>
        </div>
      )}
    </SnackbarContext.Provider>
  );
  

};
