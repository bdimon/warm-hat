import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from "./context/CartContext";
import React from 'react';
import { SnackbarProvider } from "./context/SnackbarContext";

createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <SnackbarProvider>
  <CartProvider>
    <App />
  </CartProvider>
  </SnackbarProvider>
</React.StrictMode>
);
