import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/resume", label: "Resume" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="nav-modern sticky top-0 z-50 w-full px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="gradient-text text-xl font-bold cursor-pointer">Portfolio</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    location === item.path
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer">Portfolio</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location === item.path || 
                (item.path === "/" && location === "/") ||
                (item.path !== "/" && location.startsWith(item.path));
              
              return (
                <Link key={item.path} href={item.path}>
                  <a className={`transition-colors ${
                    isActive 
                      ? "text-primary font-medium border-b-2 border-primary pb-1"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}>
                    {item.label}
                  </a>
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
