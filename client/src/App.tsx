import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import ScriptDetailPage from "@/pages/ScriptDetailPage";
import Documentation from "@/pages/Documentation";
import AdminDashboard from "@/pages/AdminDashboard";
import TestMode from "@/pages/TestMode";
import NotFound from "@/pages/not-found";
import { MainLayout } from "@/layouts/MainLayout";
import { useEffect } from "react";
import { logAgentAction } from "@/lib/logging";
import { ThemeProvider } from "@/components/ThemeProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scripts/:key" component={ScriptDetailPage} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/test-mode" component={TestMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    logAgentAction("App Initialization", "User started the Script Portfolio application");
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <MainLayout>
            <Router />
          </MainLayout>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
