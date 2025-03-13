
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { FileUploader } from "@/components/FileUploader";
import TranscriptionPanel from "@/components/TranscriptionPanel";
import GlassCard from "@/components/GlassCard";
import { fadeUp } from "@/lib/animations";

const Index = () => {
  useEffect(() => {
    // Reset scroll position when the page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Add transcription section */}
        <section className="py-16 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className={fadeUp({ className: "mb-12 text-center" })}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Transcribing</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Upload an audio file or record directly with your microphone to get started.
              </p>
            </div>
            
            <div className="flex flex-col space-y-8">
              <div className={fadeUp({ delay: 100 })}>
                <GlassCard>
                  <h3 className="text-xl font-semibold mb-4">Input Audio</h3>
                  <FileUploader />
                </GlassCard>
              </div>
              
              <div className={fadeUp({ delay: 200 })}>
                <TranscriptionPanel />
              </div>
            </div>
          </div>
        </section>
        
        <Features />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
