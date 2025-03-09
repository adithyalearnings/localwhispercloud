
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { fadeUp } from "@/lib/animations";
import { Settings as SettingsIcon, Save, Trash, Cpu, HardDrive, Globe, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

const Settings = () => {
  useEffect(() => {
    // Reset scroll position when the page loads
    window.scrollTo(0, 0);
  }, []);
  
  // Setting states
  const [model, setModel] = useState("small");
  const [language, setLanguage] = useState("auto");
  const [useGPU, setUseGPU] = useState(true);
  const [savePath, setSavePath] = useState("C:\\Users\\User\\Documents\\WhisperLocal");
  const [saveFormat, setSaveFormat] = useState("txt");
  const [autoSave, setAutoSave] = useState(false);
  const [transcriptionHistory, setTranscriptionHistory] = useState(true);
  const [maxHistoryItems, setMaxHistoryItems] = useState(50);
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to local storage or a config file
    console.log("Settings saved", {
      model,
      language,
      useGPU,
      savePath,
      saveFormat,
      autoSave,
      transcriptionHistory,
      maxHistoryItems
    });
    
    // Show toast notification
    // toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };
  
  const handleClearHistory = () => {
    // In a real app, this would clear transcription history
    console.log("Clearing transcription history");
    
    // Show confirmation dialog
    if (confirm("Are you sure you want to clear all transcription history? This cannot be undone.")) {
      // Clear history
      console.log("History cleared");
      // toast({ title: "History cleared", description: "Your transcription history has been deleted." });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className={fadeUp({ className: "text-4xl font-bold mb-6" })}>
              Settings
            </h1>
            <p className={fadeUp({ delay: 100, className: "text-xl text-foreground/70" })}>
              Customize WhisperLocal to fit your specific needs and preferences.
            </p>
          </div>
          
          <div className="space-y-8">
            <section className={fadeUp({ delay: 150 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Cpu size={24} className="mr-2 text-primary" />
                Transcription Settings
              </h2>
              
              <GlassCard>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-foreground font-medium mb-2">Whisper Model</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50"
                    >
                      <option value="tiny">Tiny (Fastest, least accurate)</option>
                      <option value="base">Base (Fast, good accuracy)</option>
                      <option value="small">Small (Balanced)</option>
                      <option value="medium">Medium (Slow, most accurate)</option>
                    </select>
                    <p className="mt-1 text-xs text-foreground/60">
                      Larger models are more accurate but require more memory and processing time.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-foreground font-medium mb-2">Default Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50"
                    >
                      <option value="auto">Auto-detect language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="nl">Dutch</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                      <option value="ru">Russian</option>
                    </select>
                    <p className="mt-1 text-xs text-foreground/60">
                      Select a specific language or use auto-detection.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useGPU"
                      checked={useGPU}
                      onChange={(e) => setUseGPU(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="useGPU" className="ml-2 text-foreground font-medium">
                      Use GPU acceleration (if available)
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-foreground/60 ml-6">
                    Enables CUDA/GPU acceleration for faster processing. Requires compatible NVIDIA GPU.
                  </p>
                </div>
              </GlassCard>
            </section>
            
            <section className={fadeUp({ delay: 200 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <HardDrive size={24} className="mr-2 text-primary" />
                Storage Settings
              </h2>
              
              <GlassCard>
                <div className="mb-6">
                  <label className="block text-foreground font-medium mb-2">Default Save Location</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={savePath}
                      onChange={(e) => setSavePath(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-l-lg border border-border bg-background/50"
                    />
                    <button className="bg-secondary text-foreground px-4 py-2 rounded-r-lg border border-l-0 border-border hover:bg-secondary/80">
                      Browse...
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-foreground font-medium mb-2">Default Save Format</label>
                    <select
                      value={saveFormat}
                      onChange={(e) => setSaveFormat(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background/50"
                    >
                      <option value="txt">Plain Text (.txt)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="srt">SubRip (.srt)</option>
                      <option value="vtt">WebVTT (.vtt)</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="autoSave" className="ml-2 text-foreground font-medium">
                        Automatically save transcriptions
                      </label>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>
            
            <section className={fadeUp({ delay: 250 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileAudio size={24} className="mr-2 text-primary" />
                History Settings
              </h2>
              
              <GlassCard>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="transcriptionHistory"
                    checked={transcriptionHistory}
                    onChange={(e) => setTranscriptionHistory(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="transcriptionHistory" className="ml-2 text-foreground font-medium">
                    Keep transcription history
                  </label>
                </div>
                
                <div className={cn(transcriptionHistory ? "opacity-100" : "opacity-50 pointer-events-none")}>
                  <label className="block text-foreground font-medium mb-2">
                    Maximum history items
                  </label>
                  <input
                    type="number"
                    value={maxHistoryItems}
                    onChange={(e) => setMaxHistoryItems(Number(e.target.value))}
                    min="1"
                    max="500"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background/50"
                  />
                  <p className="mt-1 text-xs text-foreground/60">
                    Older items will be automatically removed when this limit is reached.
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash size={16} className="mr-2" />
                    Clear Transcription History
                  </button>
                </div>
              </GlassCard>
            </section>
            
            <div className={fadeUp({ delay: 300, className: "flex justify-end" })}>
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Save size={18} className="mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
