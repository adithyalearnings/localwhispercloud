
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
import { exportToPDF, exportToGoogleDocs, exportToGoogleKeep, exportToNotion } from "@/utils/exportUtils";
import { TranscriptionResultEvent } from "./FileUploader";

interface TranscriptionPanelProps {
  className?: string;
}

const TranscriptionPanel = ({ className }: TranscriptionPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'rephrase' | 'summarize' | null>(null);
  
  // Transcription state
  const [transcriptionText, setTranscriptionText] = useState<string>(
    "Upload an audio file and click 'Start Transcription' to see the transcribed text here."
  );
  const [processingTime, setProcessingTime] = useState<string>("0.0");
  const [modelName, setModelName] = useState<string>("whisper");
  
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
  
  // In a real implementation, this would be fetched from settings or localStorage
  const [aiProvider, setAiProvider] = useState("groq");
  
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
      
      // Sample rephrased text based on the selected AI provider
      const rephrasedText = getAIModelResponse('rephrase', aiProvider);
      setTranscriptionText(rephrasedText);
      
      toast.success(`Text rephrased successfully using ${getAIProviderName(aiProvider)}`);
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
      
      // Sample summarized text based on the selected AI provider
      const summarizedText = getAIModelResponse('summarize', aiProvider);
      setTranscriptionText(summarizedText);
      
      toast.success(`Text summarized successfully using ${getAIProviderName(aiProvider)}`);
    } catch (error) {
      toast.error("Failed to summarize text");
      console.error(error);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };
  
  // Helper function to get the provider name for display
  const getAIProviderName = (provider: string): string => {
    const providers: Record<string, string> = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic Claude',
      'perplexity': 'Perplexity AI',
      'gemini': 'Google Gemini',
      'llama': 'Meta Llama',
      'groq': 'Groq',
      'huggingface': 'Hugging Face',
      'grok': 'Grok AI',
      'mcp': 'MCP Server'
    };
    
    return providers[provider] || provider;
  };
  
  // Helper function to simulate different AI model responses
  const getAIModelResponse = (type: 'rephrase' | 'summarize', provider: string): string => {
    if (type === 'rephrase') {
      switch (provider) {
        case 'openai':
          return "After local processing through the Whisper model, this exemplary transcription demonstrates how spoken content would be rendered with appropriate punctuation and formatting.";
        case 'anthropic':
          return "The Whisper model locally processes audio and generates this transcription, showcasing proper formatting and punctuation of the spoken content from the uploaded audio file.";
        case 'perplexity':
          return "This transcription, created by processing audio through Whisper locally, shows how spoken content is rendered with formatting and punctuation.";
        case 'gemini':
          return "Locally processed through Whisper, this transcription exemplifies the accurate rendering of spoken content with proper formatting.";
        case 'llama':
          return "This transcription was created by the Whisper model running locally, formatting spoken content with proper punctuation.";
        case 'groq':
          return "When processed locally through Whisper, audio content is transcribed like this example, with proper formatting applied.";
        case 'huggingface':
          return "This example shows how the Whisper model running locally can transcribe spoken content with appropriate formatting and punctuation.";
        case 'grok':
          return "Spoken audio processed through the local Whisper model produces this transcription with proper formatting and punctuation.";
        case 'mcp':
          return "The MCP server processed this transcription via Whisper, demonstrating how speech is rendered with punctuation and formatting.";
        default:
          return "The audio has been transcribed using local processing, showing how spoken content appears with formatting.";
      }
    } else {
      // Summarize responses
      switch (provider) {
        case 'openai':
          return "Sample transcription showing Whisper model local processing results with proper formatting.";
        case 'anthropic':
          return "Locally processed audio transcription with formatting applied by Whisper.";
        case 'perplexity':
          return "Whisper model locally transcribes audio with proper formatting.";
        case 'gemini':
          return "Audio processed locally through Whisper with appropriate text formatting.";
        case 'llama':
          return "Local Whisper processing creates properly formatted transcriptions.";
        case 'groq':
          return "Whisper locally formats and transcribes spoken content.";
        case 'huggingface':
          return "Local audio processing with Whisper produces formatted transcriptions.";
        case 'grok':
          return "Audio transcribed locally using Whisper with formatting.";
        case 'mcp':
          return "MCP server provides formatted transcription via Whisper.";
        default:
          return "Local audio processing generates formatted text.";
      }
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
          <div className="flex items-center space-x-2 text-foreground/60">
            <span>AI: {getAIProviderName(aiProvider)}</span>
            <ExternalLink size={14} />
          </div>
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
