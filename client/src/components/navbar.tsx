import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/resume", label: "Resume" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer">John Doe</h1>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = location === item.path || 
                  (item.path === "/" && location === "/") ||
                  (item.path !== "/" && location.startsWith(item.path));
                
                return (
                  <Link key={item.path} href={item.path}>
                    <a className={`transition-colors ${
                      isActive 
                        ? "text-primary font-medium border-b-2 border-primary pb-1"
                        : "text-secondary hover:text-slate-900"
                    }`}>
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="md:hidden">
            <button className="text-secondary hover:text-slate-900 focus:outline-none focus:text-slate-900">
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
