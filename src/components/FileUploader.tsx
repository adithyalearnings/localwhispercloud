
import { useState, useCallback } from "react";
import { fadeUp } from "@/lib/animations";
import { Upload, X, FileAudio, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileSelect = (selectedFile: File) => {
    // Check if file is an audio file
    if (!selectedFile.type.startsWith('audio/')) {
      // Handle error - not an audio file
      console.error('Please upload an audio file');
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const clearFile = () => {
    setFile(null);
  };
  
  const startTranscription = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate transcription in progress
    setTimeout(() => {
      setIsUploading(false);
      // Here you would typically start the actual transcription
      console.log('Starting local transcription of file:', file.name);
    }, 2000);
  };
  
  return (
    <div className={fadeUp({ className: "w-full" })}>
      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload size={36} className="text-primary mb-4" />
          <p className="text-lg font-medium mb-1">Upload audio file</p>
          <p className="text-sm text-foreground/60">or drag and drop</p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileInputChange}
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center p-4 bg-secondary/50 rounded-lg">
            <FileAudio size={24} className="text-primary mr-3" />
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-foreground/60">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 hover:bg-secondary rounded-full"
            >
              <X size={18} className="text-foreground/60" />
            </button>
          </div>
          
          <button
            onClick={startTranscription}
            disabled={isUploading}
            className={cn(
              "w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center",
              isUploading ? "bg-primary/70" : "bg-primary hover:bg-primary/90",
              "text-primary-foreground transition-colors"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Start Transcription"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
