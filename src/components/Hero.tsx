
import { fadeUp, blurIn } from "@/lib/animations";
import GlassCard from "./GlassCard";
import { FileUploader } from "./FileUploader";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToContent = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/60" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse-light" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse-light [animation-delay:1s]" />
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className={fadeUp({ className: "inline-block" })}>
            <div className="bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              Local AI Transcription
            </div>
          </div>
          
          <h1 className={fadeUp({ delay: 100, className: "text-4xl md:text-6xl font-bold mb-6 tracking-tight" })}>
            Transcribe Audio <span className="text-primary">Privately</span><br />
            On Your Machine
          </h1>
          
          <p className={fadeUp({ delay: 200, className: "text-xl text-foreground/70 max-w-3xl mx-auto mb-12 text-balance" })}>
            Convert speech to text with AI, all running locally on your Windows PC.
            No cloud uploads. No monthly fees. Complete privacy and control.
          </p>
          
          <div className={fadeUp({ delay: 300 })}>
            <div className="max-w-2xl mx-auto mb-16">
              <GlassCard className="relative">
                <FileUploader />
              </GlassCard>
            </div>
          </div>
          
          <div className={blurIn({ delay: 800 })}>
            <button 
              onClick={scrollToContent}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card hover:scale-110 transition-transform duration-300"
              aria-label="Scroll to features"
            >
              <ChevronDown size={24} className="text-primary animate-float" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
