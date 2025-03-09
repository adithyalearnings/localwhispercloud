
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { fadeUp } from "@/lib/animations";
import { Terminal, Download, Server, HardDrive, Cpu, Settings } from "lucide-react";

const Documentation = () => {
  useEffect(() => {
    // Reset scroll position when the page loads
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className={fadeUp({ className: "text-4xl font-bold mb-6" })}>
              Documentation
            </h1>
            <p className={fadeUp({ delay: 100, className: "text-xl text-foreground/70" })}>
              Everything you need to know about installing and using WhisperLocal for transcription.
            </p>
          </div>
          
          <div className="space-y-12">
            <section id="installation" className={fadeUp({ delay: 150 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Download size={24} className="mr-2 text-primary" />
                Installation
              </h2>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">System Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-6">
                  <li>Windows 10 or 11 (64-bit)</li>
                  <li>4GB RAM minimum (8GB+ recommended)</li>
                  <li>2GB free disk space for application and models</li>
                  <li>CPU with AVX2 support (for faster inference)</li>
                  <li>NVIDIA GPU with CUDA support (optional, for GPU acceleration)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mb-4">Download and Install</h3>
                <ol className="list-decimal list-inside space-y-3 text-foreground/80">
                  <li>Download the installer from our GitHub releases page</li>
                  <li>Run the <code className="bg-secondary px-2 py-0.5 rounded">WhisperLocal-Setup.exe</code> file</li>
                  <li>Follow the installation wizard instructions</li>
                  <li>Launch WhisperLocal from your Start menu or desktop shortcut</li>
                </ol>
              </GlassCard>
            </section>
            
            <section id="usage" className={fadeUp({ delay: 200 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Terminal size={24} className="mr-2 text-primary" />
                Basic Usage
              </h2>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Transcribing Audio</h3>
                <ol className="list-decimal list-inside space-y-3 text-foreground/80 mb-6">
                  <li>Launch WhisperLocal</li>
                  <li>Drag and drop an audio file or click to browse your files</li>
                  <li>Click "Start Transcription" to begin processing</li>
                  <li>Once complete, the transcription will appear in the results panel</li>
                  <li>Copy the text or download it in your preferred format</li>
                </ol>
                
                <h3 className="text-lg font-semibold mb-4">Supported File Formats</h3>
                <div className="grid grid-cols-2 gap-2 text-foreground/80 mb-6">
                  <div>
                    <p>• MP3 (.mp3)</p>
                    <p>• WAV (.wav)</p>
                    <p>• FLAC (.flac)</p>
                  </div>
                  <div>
                    <p>• OGG (.ogg)</p>
                    <p>• M4A (.m4a)</p>
                    <p>• WebM (.webm)</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <p className="text-foreground/80 mb-3">Transcriptions can be exported in several formats:</p>
                <div className="grid grid-cols-2 gap-2 text-foreground/80">
                  <div>
                    <p>• Plain text (.txt)</p>
                    <p>• JSON (.json)</p>
                  </div>
                  <div>
                    <p>• SubRip (.srt)</p>
                    <p>• WebVTT (.vtt)</p>
                  </div>
                </div>
              </GlassCard>
            </section>
            
            <section id="advanced" className={fadeUp({ delay: 250 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Settings size={24} className="mr-2 text-primary" />
                Advanced Configuration
              </h2>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">Model Selection</h3>
                <p className="text-foreground/80 mb-4">
                  WhisperLocal includes several model sizes with different tradeoffs between speed and accuracy:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-4">Model</th>
                        <th className="text-left py-2 px-4">Size</th>
                        <th className="text-left py-2 px-4">Memory</th>
                        <th className="text-left py-2 px-4">Speed</th>
                        <th className="text-left py-2 px-4">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground/80">
                      <tr className="border-b border-border">
                        <td className="py-2 px-4">Tiny</td>
                        <td className="py-2 px-4">75 MB</td>
                        <td className="py-2 px-4">~1 GB</td>
                        <td className="py-2 px-4">Very Fast</td>
                        <td className="py-2 px-4">Basic</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 px-4">Base</td>
                        <td className="py-2 px-4">142 MB</td>
                        <td className="py-2 px-4">~1 GB</td>
                        <td className="py-2 px-4">Fast</td>
                        <td className="py-2 px-4">Good</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 px-4">Small</td>
                        <td className="py-2 px-4">466 MB</td>
                        <td className="py-2 px-4">~2 GB</td>
                        <td className="py-2 px-4">Medium</td>
                        <td className="py-2 px-4">Better</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Medium</td>
                        <td className="py-2 px-4">1.5 GB</td>
                        <td className="py-2 px-4">~5 GB</td>
                        <td className="py-2 px-4">Slow</td>
                        <td className="py-2 px-4">Best</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </section>
            
            <section id="technical" className={fadeUp({ delay: 300 })}>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Cpu size={24} className="mr-2 text-primary" />
                Technical Details
              </h2>
              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                <p className="text-foreground/80 mb-4">
                  WhisperLocal is powered by OpenAI's Whisper model, an automatic speech recognition
                  system trained on 680,000 hours of multilingual and multitask supervised data.
                </p>
                <p className="text-foreground/80 mb-4">
                  The application runs entirely on your local machine, with no data sent to external servers.
                  It uses ONNX Runtime for efficient inference on both CPUs and GPUs.
                </p>
                
                <h3 className="text-lg font-semibold mb-4">Performance Optimization</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Enable GPU acceleration in settings for faster processing</li>
                  <li>Choose the appropriate model size for your needs</li>
                  <li>Close other resource-intensive applications while processing</li>
                  <li>For very long audio files, consider splitting them into smaller segments</li>
                </ul>
              </GlassCard>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
