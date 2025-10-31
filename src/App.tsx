import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import AvatarSelect from "./pages/AvatarSelect";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CharacterGenerator from "./pages/CharacterGenerator";
import VideoLesson from "./pages/VideoLesson";
import LessonLibrary from "./pages/LessonLibrary";
import LanguageHub from "./pages/LanguageHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/avatar-select" element={<AvatarSelect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/character-generator" element={<CharacterGenerator />} />
          <Route path="/video-lesson" element={<VideoLesson />} />
          <Route path="/lesson-library" element={<LessonLibrary />} />
          <Route path="/language-hub" element={<LanguageHub />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
