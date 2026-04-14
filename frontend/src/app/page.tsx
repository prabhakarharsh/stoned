"use client";

import { useClock } from "@/hooks/useClock";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useWakeLock } from "@/hooks/useWakeLock";

export default function Dashboard() {
  const { is24Hour, formatTime, toggleFormat } = useClock();
  const { isSupported, request, release } = useWakeLock();
  const [isAOD, setIsAOD] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAOD) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAOD]);

  const toggleAOD = async () => {
    if (!isAOD) {
      if (isSupported) await request();
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch(e) {}
      setIsAOD(true);
    } else {
      await release();
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch(e) {}
      setIsAOD(false);
    }
  };

  const timeData = formatTime(new Date());

  const worldClocks = [
    {
      city: "London",
      country: "United Kingdom",
      timezone: "GMT",
      offset: "+8H",
      time: "08:45",
      ampm: "AM",
      weatherIcon: "cloud_queue",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBt9O_I_ckgoL_sJeSq7LTeIXZTXKU1WSHCiiN9dpyQQAgvPXt_yasodU-y9Y0nWTV4zcc2rx2DXMIX54Fn8duClplwS5MnOzPeg3aTzmBAT2cptMLMO-DsOWn141Wthsuz3diJEswH9O08LjLr1Sj7H192HoBW-I8-IscBOTqDFX8DkxalOJnDA1PZ_gzN-Ddq5CEhTVQDzcFIT-konzrSicNW8zilirtzMIiXKQjcy3426TipZ6JTH3CGrOczLd_8MOEozjc6IT7f",
      width: "md:col-span-7",
      color: "primary"
    },
    {
      city: "Tokyo",
      country: "Japan",
      timezone: "JST",
      offset: "+16H",
      time: "04:45",
      ampm: "AM",
      weatherIcon: "nights_stay",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD31B2MF4oco2uoQwObH1FMTPkunH4q9y2KLgWAGl-m9YKrECUSJVP4BKHv9ZoXBv9GESfDOmowwvj8tkEgpCyuxbMqt1bPnqtyK9de8n-p9IYsVwr4wr8i5lMQntAaPILEPrKjvRlppBmUeqdwxW5tmbfeVUDEJ_BX2plFR4Fgsk-ffbIHnIVNE2G6Hahe-4MCa-davCEcI4pwkb6MXhZdvM4J5UwhWZ-Ly1xFePM8gw0UoRvmP2NjUWFvSml4ZKJmYr5A88Wylq8K",
      width: "md:col-span-5",
      color: "secondary"
    },
    {
      city: "New York",
      country: "USA",
      timezone: "EST",
      offset: "+3H",
      time: "03:45",
      ampm: "PM",
      weatherIcon: "wb_sunny",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNmmEJa6tMuQ8Vr5GttZwy3sL_QNi8WOaltKjGeGwpkIeWm0UDjUw0MU0EuOrvuspjjN8saYui6SLtvZyPBQilTHY6kMdOF_ilBJlXE_GxbS4yju9LaEPhbKkDFd7tEJokjoKvzN1otHOlCZi56mBm-Q_KrZdrYym9EfR9YXKBq0oblVGKQfV_6ah50_ISRALQt6JmA-7VPjOP7BAhBB1OfDVgAKSWRTBg6msrmDheI7rZTM3hrk1mSN5_HTFyC60umX4duegW4bj1",
      width: "md:col-span-12",
      color: "tertiary"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-32">
      {/* Hero Clock Section */}
      <section className="flex flex-col items-center justify-center py-12 lg:py-20 text-center">
        <div className="mb-4">
          <span className="font-label text-primary tracking-[0.4em] uppercase text-xs font-semibold">
            Local Time • San Francisco
          </span>
        </div>
        <div className="relative group">
          <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <h2 className="relative font-headline text-[120px] md:text-[180px] lg:text-[220px] font-bold tracking-tighter leading-none text-glow bg-gradient-to-b from-on-surface to-on-surface-variant bg-clip-text text-transparent">
            {timeData.hours}:{timeData.minutes}
          </h2>
          <div className="mt-[-1rem] lg:mt-[-2rem]">
            <span className="font-headline text-4xl lg:text-6xl font-light text-on-surface-variant/60 tracking-widest uppercase">
              {is24Hour ? "24H" : timeData.ampm}
            </span>
          </div>
        </div>

        {/* Format Toggle & AOD Toggle */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-4 bg-surface-container-high p-1.5 rounded-full border border-outline-variant/10 shadow-inner">
            <button 
              onClick={() => !is24Hour && toggleFormat()}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!is24Hour ? 'bg-surface-bright text-on-surface shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              12H
            </button>
            <button 
              onClick={() => is24Hour && toggleFormat()}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${is24Hour ? 'bg-surface-bright text-on-surface shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              24H
            </button>
          </div>
          <button 
            onClick={toggleAOD}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(155,168,255,0.15)] group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">dark_mode</span>
            Always On
          </button>
        </div>
      </section>

      {/* World Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12">
        {worldClocks.map((clock, index) => (
          <div 
            key={index}
            className={`${clock.width} group relative overflow-hidden rounded-xl bg-surface-container-high hover:bg-surface-bright transition-all duration-500 min-h-[240px]`}
          >
            <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img 
                src={clock.image} 
                className="w-full h-full object-cover grayscale"
                alt={clock.city}
              />
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline text-3xl font-bold">{clock.city}</h3>
                  <p className="text-on-surface-variant font-medium mt-1">{clock.country}</p>
                </div>
                <div className="text-right">
                  <span className={`material-symbols-outlined text-${clock.color} text-4xl`}>
                    {clock.weatherIcon}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-4 mt-8">
                <span className="font-headline text-7xl font-medium tracking-tight">{clock.time}</span>
                <span className="text-on-surface-variant text-xl uppercase">{clock.ampm}</span>
                <span className={`ml-auto bg-${clock.color}/10 text-${clock.color} px-4 py-1 rounded-full text-xs font-bold tracking-widest`}>
                  {clock.offset}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer p-12">
          <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">add</span>
          </div>
          <p className="font-headline text-xl font-bold text-on-surface-variant group-hover:text-on-surface">Add World Clock</p>
          <p className="text-on-surface-variant/60 text-sm mt-1">Track time across 200+ cities</p>
        </div>
      </div>

      {/* Always On Display Overlay */}
      {mounted && isAOD && createPortal(
        <div 
          className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center cursor-pointer select-none animate-in fade-in duration-1000"
          onClick={toggleAOD}
        >
          <div className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
            <h2 className="font-headline text-[15vw] leading-none font-light tracking-tighter text-on-surface text-glow">
              {timeData.hours}:{timeData.minutes}
            </h2>
            <div className="flex items-center gap-4 mt-4">
              <span className="font-headline text-3xl font-light text-on-surface-variant/60 tracking-[0.2em] uppercase">
                {is24Hour ? "24H" : timeData.ampm}
              </span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant/40"></span>
              <span className="font-headline text-xl text-primary/80 font-bold tracking-widest uppercase">
                San Francisco
              </span>
            </div>
            <div className="absolute bottom-12 opacity-30 text-xs font-label uppercase tracking-widest text-on-surface-variant animate-pulse">
              Tap anywhere to exit
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
