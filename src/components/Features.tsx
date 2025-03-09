
import { fadeUp } from "@/lib/animations";
import GlassCard from "./GlassCard";
import { ShieldCheck, Cpu, Zap, History, Globe, Headphones } from "lucide-react";
import TranscriptionPanel from "./TranscriptionPanel";

const features = [
  {
    title: "100% Private",
    description: "All processing happens locally. Your audio never leaves your computer.",
    icon: ShieldCheck,
    delay: 100,
  },
  {
    title: "Offline Capable",
    description: "Once downloaded, works without an internet connection.",
    icon: Globe,
    delay: 150,
  },
  {
    title: "CPU & GPU Support",
    description: "Optimized for your hardware. Uses GPU acceleration when available.",
    icon: Cpu,
    delay: 200,
  },
  {
    title: "Fast Transcription",
    description: "Process audio files quickly with optimized local models.",
    icon: Zap,
    delay: 250,
  },
  {
    title: "Multiple Languages",
    description: "Support for 90+ languages with language detection.",
    icon: Headphones,
    delay: 300,
  },
  {
    title: "Transcript History",
    description: "Save your transcription history for easy reference.",
    icon: History,
    delay: 350,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={fadeUp({ className: "text-3xl md:text-4xl font-bold mb-6" })}>
            Advanced Features, <span className="text-primary">Simple Interface</span>
          </h2>
          <p className={fadeUp({ delay: 100, className: "text-xl text-foreground/70 max-w-3xl mx-auto" })}>
            Experience powerful, private speech recognition without complexity.
            Complete control over your transcriptions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className={fadeUp({ delay: 150 })}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <GlassCard 
                  key={index} 
                  className={fadeUp({ delay: feature.delay })}
                >
                  <div className="rounded-xl bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 text-sm">{feature.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
          
          <div className={fadeUp({ delay: 300 })}>
            <TranscriptionPanel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
