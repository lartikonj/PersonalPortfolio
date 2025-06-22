import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import Resume from "@/pages/resume";
import ProjectDetail from "@/pages/project-detail";
import AdminPanel from "@/pages/admin-panel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-slate-50">
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="portfolio-ui-theme">
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Route path="/" component={Home} />
                <Route path="/resume" component={Resume} />
                <Route path="/admin" component={AdminPanel} />
                <Route path="/project/:id" component={ProjectDetail} />
                <Route component={NotFound} />
              </main>
            </div>
          </Router>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;