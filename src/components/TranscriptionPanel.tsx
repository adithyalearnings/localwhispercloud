
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GlassCard from "./GlassCard";
import { 
  Copy, 
  CheckCircle, 
  DownloadCloud, 
  Clock, 
  Settings, 
  RefreshCw, 
  ListFilter, 
  ExternalLink,
  FileText,
  FileDown,
  Menu
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToPDF, exportToGoogleDocs, exportToGoogleKeep, exportToNotion } from "@/utils/exportUtils";
import { TranscriptionResultEvent } from "./FileUploader";
import { 
  processTextWithGroq, 
  getAvailableTextModels, 
  isGroqConfigured 
} from "@/utils/groqTranscriptionApi";

interface TranscriptionPanelProps {
  className?: string;
}

const TranscriptionPanel = ({ className }: TranscriptionPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'rephrase' | 'summarize' | null>(null);
  const [selectedTextModel, setSelectedTextModel] = useState('llama-3.1-8b-instant');
  
  // Transcription state
  const [transcriptionText, setTranscriptionText] = useState<string>(
    "Upload an audio file and click 'Start Transcription' to see the transcribed text here."
  );
  const [processingTime, setProcessingTime] = useState<string>("0.0");
  const [modelName, setModelName] = useState<string>("whisper");
  
  const availableTextModels = getAvailableTextModels();
  
  // Listen for transcription events
  useEffect(() => {
    const handleTranscriptionComplete = (event: Event) => {
      const customEvent = event as TranscriptionResultEvent;
      setTranscriptionText(customEvent.detail.text);
      
      if (customEvent.detail.processingTime) {
        setProcessingTime(customEvent.detail.processingTime);
      }
      
      if (customEvent.detail.model) {
        setModelName(customEvent.detail.model);
      }
    };
    
    document.addEventListener("transcriptionComplete", handleTranscriptionComplete);
    
    return () => {
      document.removeEventListener("transcriptionComplete", handleTranscriptionComplete);
    };
  }, []);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(transcriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };
  
  const handleRephrase = async () => {
    if (isProcessing) return;
    
    if (!isGroqConfigured()) {
      toast.error("Groq API key is not set. Please add it in Settings.");
      return;
    }
    
    if (transcriptionText === "Upload an audio file and click 'Start Transcription' to see the transcribed text here.") {
      toast.error("Please transcribe some text first");
      return;
    }
    
    setIsProcessing(true);
    setProcessingType('rephrase');
    
    try {
      const result = await processTextWithGroq(
        transcriptionText, 
        'rephrase', 
        selectedTextModel
      );
      
      setTranscriptionText(result.text);
      setProcessingTime(result.processingTime?.toString() || "0.0");
      setModelName(result.model || selectedTextModel);
      
      toast.success(`Text rephrased successfully`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to rephrase text: ${error.message}`);
      } else {
        toast.error("Failed to rephrase text");
      }
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };
  
  const handleSummarize = async () => {
    if (isProcessing) return;
    
    if (!isGroqConfigured()) {
      toast.error("Groq API key is not set. Please add it in Settings.");
      return;
    }
    
    if (transcriptionText === "Upload an audio file and click 'Start Transcription' to see the transcribed text here.") {
      toast.error("Please transcribe some text first");
      return;
    }
    
    setIsProcessing(true);
    setProcessingType('summarize');
    
    try {
      const result = await processTextWithGroq(
        transcriptionText, 
        'summarize', 
        selectedTextModel
      );
      
      setTranscriptionText(result.text);
      setProcessingTime(result.processingTime?.toString() || "0.0");
      setModelName(result.model || selectedTextModel);
      
      toast.success(`Text summarized successfully`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to summarize text: ${error.message}`);
      } else {
        toast.error("Failed to summarize text");
      }
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };
  
  // Timestamp for use in filenames
  const getTimestampedFilename = () => {
    const now = new Date();
    return `transcript_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  };
  
  return (
    <GlassCard className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transcription Result</h3>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Export options">
                <DownloadCloud size={18} className="text-foreground/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => exportToPDF(transcriptionText, getTimestampedFilename())}
                className="cursor-pointer"
              >
                <FileDown className="mr-2 h-4 w-4" />
                <span>Save as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToGoogleDocs(transcriptionText)}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Export to Google Docs</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToGoogleKeep(transcriptionText)}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Export to Google Keep</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToNotion(transcriptionText)}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Export to Notion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
          <span>Processing time: {processingTime}s</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-foreground/60">
            <Settings size={14} />
            <span>Model: {modelName}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-background/80 rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-hide mb-4">
        <p className="text-foreground/80 whitespace-pre-line">{transcriptionText}</p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-foreground mb-2">
            Text Processing Model
          </label>
          <Select
            value={selectedTextModel}
            onValueChange={setSelectedTextModel}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableTextModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>
    </GlassCard>
  );
};

export default TranscriptionPanel;
