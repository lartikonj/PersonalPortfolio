import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import Resume from "@/pages/resume";
import ProjectDetail from "@/pages/project-detail";
import AdminPanel from "@/pages/admin-panel";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resume" component={Resume} />
        <Route path="/project/:id" component={ProjectDetail} />
        <Route path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  // Force dark mode permanently
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/resume" component={Resume} />
              <Route path="/admin" component={AdminPanel} />
              <Route path="/project/:id" component={ProjectDetail} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;