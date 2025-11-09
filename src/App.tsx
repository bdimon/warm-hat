import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import CartPage from './pages/CartPage';
import ProfilePage from "./pages/ProfilePage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import EditOrderPage from "./pages/EditOrderPage";

// Lazy load admin routes
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/AdminProductForm"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminOrderDetailPage = lazy(() => import("./pages/AdminOrderDetailPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));


const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/catalog/:id' element={<ProductPage />} />
        <Route path='/edit-order/:id' element={<EditOrderPage />} />
        <Route
          path='/admin/*'
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path='orders' element={<AdminOrders />} />
                <Route path='products' element={<AdminProducts />} />
                <Route path='products/new' element={<AdminProductForm />} />
                <Route path='products/edit/:id' element={<AdminProductForm />} />
                <Route path='order/edit/:id' element={<AdminOrderDetailPage />} />
                <Route path='users' element={<AdminUsersPage />} />
              </Routes>
            </Suspense>
          }
        />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/update-password' element={<UpdatePasswordPage />} />
        <Route path='/cart' element={<CartPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
