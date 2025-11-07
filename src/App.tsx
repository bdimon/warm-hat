import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
// import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import SignUpForm from "./components/SignupForm";
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import EditOrderPage from "./pages/EditOrderPage";
import AdminOrders from "./pages/AdminOrders";  
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminUsersPage from "./pages/AdminUsersPage"; // <-- Добавляем импорт

// const queryClient = new QueryClient();

const App = () => (
  // <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog/:id" element={<ProductPage />} />
          <Route path="/edit-order/:id" element={<EditOrderPage />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          {/* <Route path="/catalog" element={<CatalogPage />} /> */}
          {/* <Route path="/signup" element={<SignUpForm />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/order/edit/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} /> {/* <-- Добавляем роут */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  // </QueryClientProvider>
);

export default App;
