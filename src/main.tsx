import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from '@/providers/cart-provider';
import React from 'react';
import { SnackbarProvider } from '@/providers/snackbar-provider';

createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <SnackbarProvider>
  <CartProvider>
    <App />
  </CartProvider>
  </SnackbarProvider>
</React.StrictMode>
);
