import { useState, useCallback, useRef, useEffect } from "react";
import { fadeUp } from "@/lib/animations";
import { Upload, X, FileAudio, Loader2, Mic, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { transcribeAudioWithGroq, isGroqConfigured } from "@/utils/groqTranscriptionApi";

export type TranscriptionResultEvent = CustomEvent<{
  text: string;
  processingTime?: string;
  model?: string;
}>;

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecordingPermission, setHasRecordingPermission] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState('whisper-1');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser does not support audio recording');
      toast.error('Your browser does not support audio recording');
    }
  }, []);

  useEffect(() => {
    if (file && autoTranscribe && !isRecording && !isUploading) {
      startTranscription();
    }
  }, [file, isRecording]);
  
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
  
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasRecordingPermission(true);
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasRecordingPermission(false);
      toast.error('Could not access microphone. Please check permissions.');
      return false;
    }
  };
  
  const startRecording = async () => {
    if (hasRecordingPermission === null) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;
    } else if (hasRecordingPermission === false) {
      toast.error('Microphone access denied. Please enable in browser settings.');
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('Recording stopped, chunks:', audioChunksRef.current.length);
        if (audioChunksRef.current.length === 0) {
          toast.error('No audio data captured. Please try again.');
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const fileName = `recording_${new Date().getTime()}.${mimeType.includes('webm') ? 'webm' : 'mp4'}`;
        const audioFile = new File([audioBlob], fileName, { type: mimeType });
        setFile(audioFile);
        
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        toast.success('Recording saved successfully');
      };
      
      mediaRecorder.start(1000);
      console.log('Recording started');
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };
  
  const stopRecording = () => {
    console.log('Stopping recording, recorder state:', mediaRecorderRef.current?.state);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.error('Attempted to stop recording, but no active recorder found');
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.error('Recording failed. Please try again.');
    }
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const startTranscription = async () => {
    if (!file) {
      toast.error("No audio file selected");
      return;
    }
    
    setIsUploading(true);
    
    try {
      if (!isGroqConfigured()) {
        toast.error("Groq API key is not set. Please add it in Settings.");
        setIsUploading(false);
        return;
      }
      
      const result = await transcribeAudioWithGroq(file, selectedModel);
      
      const transcriptionEvent = new CustomEvent<{
        text: string;
        processingTime?: string;
        model?: string;
      }>("transcriptionComplete", {
        detail: {
          text: result.text,
          processingTime: result.processingTime?.toString(),
          model: result.model
        }
      });
      
      document.dispatchEvent(transcriptionEvent);
      
      toast.success("Transcription completed");
    } catch (error) {
      console.error("Transcription error:", error);
      if (error instanceof Error) {
        toast.error(`Transcription failed: ${error.message}`);
      } else {
        toast.error("Transcription failed");
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const ModelSelector = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Whisper Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-border bg-background/50"
      >
        <option value="whisper-1">Whisper (Default)</option>
        <option value="whisper-large">Whisper Large</option>
      </select>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="auto-transcribe"
          checked={autoTranscribe}
          onChange={(e) => setAutoTranscribe(e.target.checked)}
          className="mr-2 h-4 w-4"
        />
        <label htmlFor="auto-transcribe" className="text-sm text-foreground/80">
          Auto-transcribe after recording
        </label>
      </div>
    </div>
  );
  
  return (
    <div className={fadeUp({ className: "w-full" })}>
      {!file ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div 
              className={cn(
                "border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all",
                isRecording
                  ? "border-red-500 bg-red-500/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              {isRecording ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
                    <span className="text-lg font-medium">Recording {formatTime(recordingTime)}</span>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4"
                    type="button"
                  >
                    <StopCircle size={18} />
                    Stop Recording
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Mic size={36} className="text-primary mb-4" />
                  <p className="text-lg font-medium mb-1">Record audio</p>
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors mt-4"
                    type="button"
                  >
                    <Mic size={18} />
                    Start Recording
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <ModelSelector />
          
          <div className="flex items-center p-4 bg-secondary/50 rounded-lg">
            <FileAudio size={24} className="text-primary mr-3" />
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-foreground/60">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="p-1 hover:bg-secondary rounded-full"
              type="button"
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
            type="button"
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
