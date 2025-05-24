
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import NewsDetail from "./pages/NewsDetail";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManagement from "./pages/CategoryManagement";
import ArticleManagement from "./pages/ArticleManagement";
import UserManagement from "./pages/UserManagement";
import NewsletterManagement from "./pages/NewsletterManagement";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import ContactPage from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import ScrollToTop from "./components/ScrollToTop";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SidebarProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/news/:id/:slug" element={<NewsDetail />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/search" element={<SearchPage />} />

                  {/* Static Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiesPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Redirects para categorias antigas (compatibilidade) */}
                  <Route path="/markets" element={<Navigate to="/category/markets" replace />} />
                  <Route path="/business" element={<Navigate to="/category/business" replace />} />
                  <Route path="/economy" element={<Navigate to="/category/economy" replace />} />
                  
                  {/* Rotas Admin - Apenas para administradores */}
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute adminOnly={true}>
                      <CategoryManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute adminOnly={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/newsletter" element={
                    <ProtectedRoute adminOnly={true}>
                      <NewsletterManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute adminOnly={true}>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rota de artigos - Para admin e editor */}
                  <Route path="/admin/articles" element={
                    <ProtectedRoute editorAccess={true}>
                      <ArticleManagement />
                    </ProtectedRoute>
                  } />
                  
                  {/* Rota de perfil protegida para qualquer usuário logado */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default App;
