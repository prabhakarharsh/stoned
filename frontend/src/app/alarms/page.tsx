"use client";

import { useAlarms } from "@/hooks/useAlarms";
import { useState, useRef } from "react";
import { apiService } from "@/services/apiService";

export default function AlarmsPage() {
  const { alarms, toggleAlarm, deleteAlarm, triggeredAlarm, setTriggeredAlarm, reload } = useAlarms();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState<string>("Ocean");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function for UI icons
  const getIconForRingtone = (rt: string) => {
    switch (rt) {
      case "Ocean": return "waves";
      case "Rising": return "light_mode";
      case "Forest": return "forest";
      case "Bass": return "graphic_eq";
      case "Zenith": return "rocket_launch";
      case "Electric": return "bolt";
      default: return "music_note";
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 pt-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tight text-on-surface mb-2">Alarms</h1>
          <p className="text-on-surface-variant font-body">Next alarm in <span className="text-primary font-semibold">4 hours 20 mins</span></p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-8 py-4 rounded-full font-headline font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(155,168,255,0.3)] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Add Alarm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {alarms.map((alarm) => (
          <div 
            key={alarm.id}
            className={`${alarm.active ? 'md:col-span-8 bg-surface-container-high' : 'md:col-span-6 bg-surface-container-low opacity-60 grayscale hover:grayscale-0 hover:opacity-100'} p-8 rounded-xl relative overflow-hidden group transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`material-symbols-outlined text-primary ${alarm.active ? 'fill-[1]' : ''}`}>alarm</span>
                  <span className="font-headline text-sm tracking-widest text-primary uppercase font-bold">{alarm.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-7xl font-bold text-on-surface tracking-tighter">{alarm.time}</span>
                  <span className="font-headline text-2xl font-light text-on-surface-variant">{alarm.ampm}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => toggleAlarm(alarm.id)}
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <div className={`w-14 h-8 rounded-full transition-colors ${alarm.active ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                    <div className={`absolute top-1 left-1 bg-white rounded-full h-6 w-6 transition-transform ${alarm.active ? 'translate-x-6' : ''}`}></div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteAlarm(alarm.id)}
                  className="flex items-center justify-center p-2 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                  title="Delete Alarm"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <span 
                    key={i}
                    className={`px-3 py-1 rounded-md font-headline text-xs font-bold ${alarm.days.includes(day) ? 'bg-secondary text-on-secondary' : 'bg-surface-container-lowest text-on-surface-variant'}`}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">music_note</span>
                <span className="font-label text-sm italic">{alarm.ringtone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alarm Triggered Overlay */}
      {triggeredAlarm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-2xl">
          <div className="w-full max-w-lg bg-surface-container-highest p-12 rounded-3xl border border-primary/40 shadow-[0_0_50px_rgba(155,168,255,0.3)] text-center animate-bounce">
            <span className="material-symbols-outlined text-8xl text-primary mb-6 animate-pulse">alarm_on</span>
            <h2 className="font-headline text-5xl font-bold mb-2">{triggeredAlarm.time} {triggeredAlarm.ampm}</h2>
            <p className="font-headline text-xl text-primary tracking-widest uppercase mb-12">{triggeredAlarm.label}</p>
            
            <button 
              onClick={() => setTriggeredAlarm(null)}
              className="w-full py-6 bg-primary text-on-primary-fixed rounded-full font-headline font-bold text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              STOP ALARM
            </button>
          </div>
          {/* Hidden Audio Player */}
          <audio 
            autoPlay 
            loop 
            src={triggeredAlarm.ringtone.startsWith('http') || triggeredAlarm.ringtone.startsWith('/') 
              ? (triggeredAlarm.ringtone.startsWith('/') ? `http://localhost:3001${triggeredAlarm.ringtone}` : triggeredAlarm.ringtone)
              : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            } 
          />
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface-container-highest p-8 rounded-xl border border-primary/20 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline text-xl font-bold text-primary">Setup New Alarm</h2>
              <button onClick={() => setShowAddModal(false)}>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer">close</span>
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const alarm = {
                time: formData.get('time'),
                ampm: formData.get('ampm'),
                label: formData.get('label') || 'New Alarm',
                active: true,
                days: ["M", "T", "W", "T", "F"],
                ringtone: selectedRingtone,
              };
              await apiService.saveAlarm(alarm);
              reload();
              setShowAddModal(false);
              setSelectedRingtone("Ocean");
            }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploading(true);
                    try {
                      const res = await apiService.uploadRingtone(file);
                      if (res.success) {
                        setSelectedRingtone(res.path);
                      }
                    } catch (err) {
                      console.error("Upload failed", err);
                    } finally {
                      setUploading(false);
                    }
                  }
                }}
              />
              <div className="flex justify-center items-center gap-4 mb-8 py-6 bg-surface-container-lowest rounded-xl">
                 <input 
                    name="time" 
                    type="time" 
                    required
                    className="bg-transparent text-4xl font-headline font-bold text-primary border-none focus:ring-0" 
                    defaultValue="06:30"
                 />
                 <select name="ampm" className="bg-transparent text-xl font-headline text-on-surface-variant border-none focus:ring-0">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                 </select>
              </div>

              <div className="space-y-4">
                <input 
                  name="label"
                  placeholder="Alarm Label"
                  className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 focus:border-primary/50 text-on-surface"
                />

                <div className="space-y-3">
                  <label className="text-xs font-headline uppercase tracking-widest text-on-surface-variant font-bold">Default Ringtones</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Ocean", "Rising", "Forest", "Bass", "Zenith", "Electric"].map((rt) => (
                      <button 
                        key={rt} 
                        type="button" 
                        onClick={() => setSelectedRingtone(rt)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${selectedRingtone === rt ? 'bg-secondary-container text-on-secondary-container border-secondary/30' : 'bg-surface-container-low border-outline-variant/20 hover:border-primary/50'}`}
                      >
                        <span className="material-symbols-outlined text-sm">{getIconForRingtone(rt)}</span>
                        <span className="text-xs font-label">{rt}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className={`w-full bg-surface-container-low border-2 border-dashed ${selectedRingtone.startsWith('/') ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/30'} py-4 rounded-xl text-on-surface-variant flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-colors group px-4`}
                >
                  <span className={`material-symbols-outlined ${uploading ? 'animate-spin' : 'text-primary group-hover:scale-110'} transition-transform`}>
                    {uploading ? 'sync' : (selectedRingtone.startsWith('/') ? 'check_circle' : 'upload_file')}
                  </span>
                  <span className="text-sm font-label font-semibold">
                    {uploading ? 'Uploading...' : (selectedRingtone.startsWith('/') ? `Ringtone: ${selectedRingtone.split('/').pop()}` : 'Attach Custom Ringtone')}
                  </span>
                </button>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-full font-headline font-bold text-on-surface-variant hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary text-on-primary-fixed rounded-full font-headline font-bold shadow-lg"
                >
                  Save Alarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
