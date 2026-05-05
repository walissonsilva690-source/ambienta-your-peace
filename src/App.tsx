import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Cenas from "./pages/Cenas.tsx";
import Canais from "./pages/Canais.tsx";
import Radios from "./pages/Radios.tsx";
import ModosProntos from "./pages/ModosProntos.tsx";
import ExecutionScreen from "./pages/ExecutionScreen.tsx";
import NotFound from "./pages/NotFound.tsx";
import { ViewModeProvider } from "@/contexts/ViewModeContext";
import { SceneStatusProvider } from "@/contexts/SceneStatusContext";
import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import { RadioPlayerProvider } from "@/contexts/RadioPlayerContext";
import { RadioPlayer } from "@/components/ambienta/RadioPlayer";
import { PreviewBar } from "@/components/ambienta/PreviewBar";

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
                  <Route path="/modos-prontos" element={<ModosProntos />} />
                  <Route path="/execution/:id" element={<ExecutionScreen />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <RadioPlayer />
              <PreviewBar />
            </RadioPlayerProvider>
          </AudioPlayerProvider>
        </ViewModeProvider>
      </SceneStatusProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
