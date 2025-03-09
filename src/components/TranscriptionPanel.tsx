
import { useState } from "react";
import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { Copy, CheckCircle, DownloadCloud, Clock, Settings } from "lucide-react";

interface TranscriptionPanelProps {
  className?: string;
}

const TranscriptionPanel = ({ className }: TranscriptionPanelProps) => {
  const [copied, setCopied] = useState(false);
  
  // Sample transcription result
  const transcriptionText = "This is a sample transcription that would appear after processing an audio file through the Whisper model locally. The text would appear here with proper punctuation and formatting based on the spoken content from the uploaded audio file.";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <GlassCard className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transcription Result</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Download as file">
            <DownloadCloud size={18} className="text-foreground/60" />
          </button>
          <button 
            className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <Copy size={18} className="text-foreground/60" />
            )}
          </button>
        </div>
      </div>
      
      <div className="mb-4 px-4 py-3 bg-secondary/40 rounded-lg text-sm">
        <div className="flex items-center space-x-2 text-foreground/60 mb-2">
          <Clock size={14} />
          <span>Processing time: 12.3s</span>
        </div>
        <div className="flex items-center space-x-2 text-foreground/60">
          <Settings size={14} />
          <span>Model: whisper-small.en</span>
        </div>
      </div>
      
      <div className="bg-background/80 rounded-lg p-4 max-h-80 overflow-y-auto scrollbar-hide">
        <p className="text-foreground/80 whitespace-pre-line">{transcriptionText}</p>
      </div>
    </GlassCard>
  );
};

export default TranscriptionPanel;
