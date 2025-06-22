import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const { data: settings } = useQuery({
    queryKey: ["/api/settings"],
  });

  const { data: pages = [] } = useQuery({
    queryKey: ["/api/pages"],
  });

  const siteName = settings?.find((s: any) => s.key === "site_name")?.value || "Portfolio";
  const publishedPages = pages.filter((page: any) => page.published);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="nav-modern sticky top-0 z-50 w-full px-4 py-3 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="gradient-text text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {siteName}
            </span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = location === item.path || 
                (item.path === "/" && location === "/") ||
                (item.path !== "/" && location.startsWith(item.path));

              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200">
              More
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/resume">
                  <span className="cursor-pointer flex items-center">
                    <i className="fas fa-file-alt mr-2"></i>
                    View Resume
                  </span>
                </Link>
              </DropdownMenuItem>
              {publishedPages.map((page: any) => (
                <DropdownMenuItem key={page.id} asChild>
                  <Link href={`/page/${page.slug}`}>
                    <span className="cursor-pointer flex items-center">
                      <i className="fas fa-file-text mr-2"></i>
                      {page.title}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}