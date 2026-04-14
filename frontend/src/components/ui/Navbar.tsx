"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "World Clock", path: "/" },
    { name: "Alarms", path: "/alarms" },
    { name: "Reminders", path: "/reminders" },
    { name: "Analysis", path: "/analysis" },
  ];

  return (
    <nav className="flex justify-between items-center w-full sticky top-0 z-50 bg-[#000000] px-6 py-4">
      <div className="flex items-center gap-4">
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/">
          <h1 className="text-primary font-headline italic text-2xl font-bold tracking-tighter cursor-pointer">
            ChronoView
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`transition-all duration-300 font-bold ${
                pathname === item.path 
                  ? "text-blue-500 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-outline-variant/20 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
          <img
            alt="User"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVF3LbxEyCl7YEsvZFP4QGLTQe9rlwKo1Yr1Ri6Ol3pVyE9c6vSZ1k79jqbhN8mc7Vv1mCedh2Zv_xzdwrRThSFM8SbtTPD2CuWXfmtZpCPhdyEJioViIDdBzu7Y5ZssZmF7TYzByoOidA4Va-18TCcbghbMl2_zhU3nneKmPmiqAa3rkcVvVHNZvrOVuxFymFHRa4Wfa8Omn-SQssEkUjx-WWhRvTxPxR0HshfHzKVDOR0lJNb1LQBU6st__OIIewn0TbQKR-a52f"
          />
        </div>
      </div>
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Clock", path: "/", icon: "public" },
    { name: "Alarms", path: "/alarms", icon: "alarm" },
    { name: "Daily", path: "/reminders", icon: "event_note" },
    { name: "AI Hub", path: "/analysis", icon: "auto_awesome" },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 bg-surface-container/80 backdrop-blur-xl rounded-t-3xl h-20 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          href={item.path}
          className={`flex flex-col items-center justify-center transition-all ${
            pathname === item.path ? "text-blue-500 scale-110 border-b-2 border-blue-500 pb-1" : "text-on-surface-variant/60"
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${pathname === item.path ? "fill-[1]" : ""}`}>{item.icon}</span>
          <span className="text-[10px] uppercase tracking-widest">{item.name}</span>
        </Link>
      ))}
    </footer>
  );
}
