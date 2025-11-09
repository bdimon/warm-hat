import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import EditOrderPage from "./pages/EditOrderPage";
import AdminOrders from "./pages/AdminOrders";  
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminUsersPage from "./pages/AdminUsersPage"; // <-- Добавляем импорт


const App = () => (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catalog/:id" element={<ProductPage />} />
          <Route path="/edit-order/:id" element={<EditOrderPage />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/order/edit/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} /> 
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
);

export default App;
