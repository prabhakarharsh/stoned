"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Clock", path: "/", icon: "public" },
    { name: "Alarms", path: "/alarms", icon: "alarm" },
    { name: "AI Analysis", path: "/analysis", icon: "auto_awesome" },
    { name: "Timeline", path: "/reminders", icon: "event_note" },
  ];

  if (!mounted) return <div className="min-h-screen bg-surface">{children}</div>;

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full opacity-50"></div>
      </div>

      <main className="relative z-10 pb-32">
        {children}
      </main>

      {/* Floating Nav Dock with Auto-Hide */}
      <div className="fixed bottom-0 left-0 w-full h-4 sm:h-6 z-[100] hover:h-40 group transition-all duration-300">
        <div className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bottom-[-100px] group-hover:bottom-8">
          <nav className="flex items-center gap-1 p-2 bg-surface-container-high/60 backdrop-blur-2xl border border-outline-variant/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-500 relative flex-shrink-0 group/link overflow-hidden ${
                    isActive 
                      ? "bg-primary text-on-primary-fixed shadow-[0_0_20px_rgba(155,168,255,0.4)]" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-bright/50"
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-[1]' : 'opacity-80 transition-transform group-hover/link:scale-110'}`} style={{ transition: 'transform 0.3s' }}>
                    {item.icon}
                  </span>
                  <span className={`font-headline text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-500 ${
                    isActive ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0 group-hover/link:max-w-[100px] group-hover/link:opacity-100"
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        {/* Subtle bottom glow indicator to hint at the hidden dock */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 blur-[2px] rounded-t-full group-hover:opacity-0 transition-opacity duration-300"></div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
