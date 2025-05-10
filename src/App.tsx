
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewsDetail from "./pages/NewsDetail";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManagement from "./pages/CategoryManagement";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategoryManagement />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default App;
