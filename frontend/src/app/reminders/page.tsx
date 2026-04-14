"use client";

import { useEffect, useState } from "react";

export default function RemindersPage() {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('recent_analysis');
    if (data) {
      setSchedule(JSON.parse(data));
    } else {
      // Default if none
      setSchedule([
        {
          time: "09:00 AM",
          title: "Team Strategy Sync",
          description: "Discussion on Q4 deliverables and resource allocation",
          status: "In Progress",
          type: "primary"
        },
        // ... (truncated for brevity in chunk)
      ]);
    }
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="space-y-2">
          <p className="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">Analysis Result</p>
          <h2 className="font-headline text-5xl md:text-6xl font-bold tracking-tight">Daily Schedule</h2>
          <div className="flex items-center gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Oct 24, 2024
            </span>
            <span className="text-on-surface-variant text-sm font-label">12 items analyzed from &quot;Project_Alpha.pdf&quot;</span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-6 py-3 rounded-full font-bold hover:shadow-[0_0_20px_rgba(155,168,255,0.3)] transition-all active:scale-95">
          <span className="material-symbols-outlined">edit_calendar</span>
          Edit Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative pl-8 pb-8">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/40 to-transparent"></div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></span>
              <h3 className="font-headline text-xl font-bold text-primary">Extracted Milestones</h3>
            </div>
            
            <div className="space-y-4">
              {schedule.map((item, i) => (
                <div key={i} className="group bg-surface-container-high rounded-xl p-5 hover:bg-surface-bright transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary`}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-on-surface-variant font-headline font-medium pt-1 whitespace-nowrap">{item.time}</div>
                      <div>
                        <h4 className="text-lg font-bold text-on-surface">{item.title}</h4>
                        <p className="text-sm text-on-surface-variant">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end md:self-center">
                      <span className={`material-symbols-outlined text-primary`}>
                        pending
                      </span>
                      <span className={`text-xs uppercase tracking-widest text-primary font-bold`}>Analyzed</span>
                    </div>
                  </div>
                </div>
              ))}
              {schedule.length === 0 && (
                <p className="text-on-surface-variant italic">No items found. Try uploading a different file in the Analysis Hub.</p>
              )}
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-secondary/40 to-transparent"></div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/10"></span>
              <h3 className="font-headline text-xl font-bold text-secondary">Execution Phase</h3>
            </div>
            
            <div className="space-y-4">
              {schedule.slice(2).map((item, i) => (
                <div key={i} className="group bg-surface-container-high rounded-xl p-5 hover:bg-surface-bright transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${item.type}`}></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="text-on-surface-variant font-headline font-medium pt-1">{item.time}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-on-surface">{item.title}</h4>
                          {item.type === 'error' && <span className="material-symbols-outlined text-error text-sm">priority_high</span>}
                        </div>
                        <p className="text-sm text-on-surface-variant">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 self-end md:self-center">
                      <span className="material-symbols-outlined text-on-surface-variant">schedule</span>
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-outline-variant/10">
            <h5 className="font-headline text-lg font-bold mb-6">Time Distribution</h5>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle className="text-surface-container-highest/30" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-secondary" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="120" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-3xl font-bold">72%</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Efficiency</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-xs text-on-surface-variant font-label uppercase">Meetings</span>
                </div>
                <p className="text-xl font-headline font-bold">4.5h</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-xs text-on-surface-variant font-label uppercase">Focus</span>
                </div>
                <p className="text-xl font-headline font-bold">3.2h</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden h-64 group">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAecslAbtbwTv1RRkIm-4Prb3hW8NWuINUlhyr60m9XOqogzjfqqEjdc8co6SVucMbSIy47xuGFwKOn1Dv-MUF4_GlA1YkeZZcdgSy3D0uPTOAlFE_6wiUVuYd-FpCTajO-0gF0hbGUxIz8pc46852-46bHFYG9o07vcSmmTaS2L_a-F004WW_0uwvDISEbkjtMJf_u2A51RbR6wcR_lh3wOAjk6NbtD5Ov9yC4WMNihh28lNf0Fqh0DiTngN1V0iW7Abit-aMews5y" 
              alt="Workspace"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-2 py-1 rounded bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest mb-2">High Priority</span>
              <h4 className="font-headline text-xl font-bold">Prepare Launch Deck</h4>
              <p className="text-sm text-on-surface/80 mt-1 line-clamp-2">The presentation for stakeholders is set for tomorrow morning.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
