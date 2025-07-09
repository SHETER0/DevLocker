import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => isMobile && setSidebarOpen(false)}
        className={cn(
          "fixed inset-y-0 z-50 transition-all duration-300",
          sidebarOpen ? "left-0" : "-left-72"
        )} 
      />
      
      <div className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        sidebarOpen ? (isMobile ? "ml-0" : "ml-72") : "ml-0"
      )}>
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1" />
        </div>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}