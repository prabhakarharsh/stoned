"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";

export default function AnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    let curr = 0;
    const interval = setInterval(() => {
      curr += (Math.random() * 5);
      if (curr >= 90) clearInterval(interval);
      setProgress(Math.floor(curr));
    }, 100);

    try {
      const result = await apiService.analyzeFile(file);
      if (result.success) {
        setProgress(100);
        // Store results for the Reminders page
        localStorage.setItem('recent_analysis', JSON.stringify(result.events));
        setTimeout(() => {
          router.push("/reminders");
        }, 1000);
      }
    } catch (err) {
      console.error("Analysis failed", err);
      setAnalyzing(false);
      setProgress(0);
      alert("Failed to analyze file. Please try a different PDF.");
    }
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 pt-12 pb-32">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-headline text-4xl font-bold text-on-surface mb-4 tracking-tight">Temporal Intelligence</h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Upload your schedule, syllabus, or project plan, and we&apos;ll build a personalized reminder chart for you. Our neural engine extracts every deadline and milestone automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Primary Analysis Module */}
        <div className="lg:col-span-7 space-y-6">
          {!analyzing ? (
            <div 
              className="group relative bg-surface-container-high rounded-xl p-12 border border-outline-variant/15 hover:bg-surface-container-highest transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px]"
            >
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={handleFileChange}
                accept=".pdf,.csv,.ics"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
              <div className="w-20 h-20 mb-6 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-xl">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'wght' 300" }}>upload_file</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-semibold text-on-surface">Drag & Drop</h3>
                <p className="text-on-surface-variant max-w-xs">Drop your PDF, CSV, or ICS file here, or <span className="text-primary font-medium hover:underline">Select File</span> from your device.</p>
              </div>
              <div className="mt-8 flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium border border-outline-variant/30">PDF</span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium border border-outline-variant/30">XLSX</span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium border border-outline-variant/30">PNG / JPG</span>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 border border-outline-variant/15">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="font-headline text-sm font-bold text-secondary tracking-widest uppercase">Analyzing file for reminder chart...</span>
                </div>
                <span className="text-sm font-medium text-on-surface-variant">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_12px_rgba(166,140,255,0.4)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-6 flex items-start gap-4 p-4 rounded-lg bg-surface-container-low/50">
                <span className="material-symbols-outlined text-primary-fixed-dim">auto_awesome</span>
                <div className="space-y-1">
                  <p className="text-sm text-on-surface font-medium">Extracting project milestones...</p>
                  <p className="text-xs text-on-surface-variant">We&apos;ve identified 12 unique deadlines from your file</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-8 space-y-8">
            <h4 className="font-headline text-xl font-bold text-on-surface">Why use Chrono-Analysis?</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined text-xl">event_upcoming</span>
                </div>
                <div>
                  <h5 className="text-on-surface font-semibold mb-1">Contextual Scheduling</h5>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Our AI understands the difference between a &quot;Review&quot; and a &quot;Deadline,&quot; prioritizing your focus accordingly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">account_tree</span>
                </div>
                <div>
                  <h5 className="text-on-surface font-semibold mb-1">Project Hierarchy</h5>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Large projects are automatically broken down into manageable temporal segments with sub-reminders.</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-outline-variant/20">
              <div className="relative rounded-xl overflow-hidden aspect-video group">
                <img 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTvSga3L64sIrDphouhCXeXeB_9WTPyKLvBZwrA1wnBBLIonmQJtDg-yuzD9RavKLqGTWoBREoWLOcsoHmmxo2fjKdugofIO1sZqpxdIvrxMsZnIVk0DMqmv25QQ3s1NLdMaht6KpLm_gzmpgVQPIBdAZm3FYFaIyBDfEvaAzaLhNPbOXmIjzWNLRN_0JM_vLP_hDQkobtZvzZE0pRHukcWhiewkP-zQF24CgohPZRtUnN47Cff4q_jRoX-y7OCI8yxeR2jRS_pRiO" 
                  alt="System Preview"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent flex flex-col justify-end p-6">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">System Preview</p>
                  <p className="text-sm text-on-surface">Temporal mapping in progress...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
