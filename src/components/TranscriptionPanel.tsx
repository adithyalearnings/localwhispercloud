
import { useState } from "react";
import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { Copy, CheckCircle, DownloadCloud, Clock, Settings, RefreshCw, ListFilter } from "lucide-react";
import { toast } from "sonner";

interface TranscriptionPanelProps {
  className?: string;
}

const TranscriptionPanel = ({ className }: TranscriptionPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'rephrase' | 'summarize' | null>(null);
  
  // Sample transcription result
  const [transcriptionText, setTranscriptionText] = useState(
    "This is a sample transcription that would appear after processing an audio file through the Whisper model locally. The text would appear here with proper punctuation and formatting based on the spoken content from the uploaded audio file."
  );
  
  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };
  
  const handleRephrase = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingType('rephrase');
    
    try {
      // This would be replaced with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample rephrased text
      setTranscriptionText(
        "After local processing through the Whisper model, this exemplary transcription demonstrates how spoken content would be rendered with appropriate punctuation and formatting."
      );
      
      toast.success("Text rephrased successfully");
    } catch (error) {
      toast.error("Failed to rephrase text");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };
  
  const handleSummarize = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProcessingType('summarize');
    
    try {
      // This would be replaced with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample summarized text
      setTranscriptionText(
        "Sample transcription showing Whisper model local processing results with proper formatting."
      );
      
      toast.success("Text summarized successfully");
    } catch (error) {
      toast.error("Failed to summarize text");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
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
      
      <div className="bg-background/80 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-hide mb-4">
        <p className="text-foreground/80 whitespace-pre-line">{transcriptionText}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={handleRephrase}
          disabled={isProcessing}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
            isProcessing && processingType === 'rephrase' 
              ? "bg-primary/70 text-primary-foreground" 
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          )}
        >
          {isProcessing && processingType === 'rephrase' ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Rephrase
        </button>
        
        <button 
          onClick={handleSummarize}
          disabled={isProcessing}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
            isProcessing && processingType === 'summarize' 
              ? "bg-primary/70 text-primary-foreground" 
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          )}
        >
          {isProcessing && processingType === 'summarize' ? (
            <ListFilter size={16} className="animate-spin" />
          ) : (
            <ListFilter size={16} />
          )}
          Summarize
        </button>
      </div>
    </GlassCard>
  );
};

export default TranscriptionPanel;
