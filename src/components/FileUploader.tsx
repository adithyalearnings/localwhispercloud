
import { useState, useCallback, useRef } from "react";
import { fadeUp } from "@/lib/animations";
import { Upload, X, FileAudio, Loader2, Mic, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
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
      toast.error('Please upload an audio file');
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
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
        setFile(audioFile);
        
        // Stop the timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
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
        <div className="space-y-4">
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
          
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-border" />
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or record audio
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
                  <span className="text-sm font-medium">Recording {formatTime(recordingTime)}</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <StopCircle size={18} />
                  Stop Recording
                </button>
              </div>
            ) : (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Mic size={18} />
                Start Recording
              </button>
            )}
          </div>
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
