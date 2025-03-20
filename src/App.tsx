
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VideoUpload from "./pages/VideoUpload";
import Transcript from "./pages/Transcript";
import QuizCreation from "./pages/QuizCreation";
import QuizTaking from "./pages/QuizTaking";
import QuizResults from "./pages/QuizResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple auth context simulation - in a real app, use a proper auth context
const isAuthenticated = () => {
  // Simulate authentication check - would use proper JWT/session check in real app
  return localStorage.getItem("isAuthenticated") === "true";
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // For demo purposes, we'll auto-authenticate users
  useEffect(() => {
    localStorage.setItem("isAuthenticated", "true");
  }, []);

  // This would check for actual auth in a real application
  // const authenticated = isAuthenticated();
  // if (!authenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate app initialization
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: '1.5s' }}
            ></div>
          </div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <VideoUpload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transcripts/:id" 
              element={
                <ProtectedRoute>
                  <Transcript />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/transcripts/new" 
              element={
                <ProtectedRoute>
                  <Transcript />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/create" 
              element={
                <ProtectedRoute>
                  <QuizCreation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/take" 
              element={
                <ProtectedRoute>
                  <QuizTaking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/results" 
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect from root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
