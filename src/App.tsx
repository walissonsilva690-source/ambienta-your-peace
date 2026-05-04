import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Cenas from "./pages/Cenas.tsx";
import Canais from "./pages/Canais.tsx";
import Radios from "./pages/Radios.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { SceneStatusProvider } from "@/contexts/SceneStatusContext";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { RadioPlayerProvider } from "@/contexts/RadioPlayerContext";
import { RadioPlayer } from "@/components/ambienta/RadioPlayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SceneStatusProvider>
        <ViewModeProvider>
          <AudioPlayerProvider>
            <RadioPlayerProvider isPremium={true}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/cenas" element={<Cenas />} />
                  <Route path="/canais" element={<Canais />} />
                  <Route path="/radios" element={<Radios />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <RadioPlayer />
            </RadioPlayerProvider>
          </AudioPlayerProvider>
        </ViewModeProvider>
      </SceneStatusProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
