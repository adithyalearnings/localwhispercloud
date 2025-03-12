/**
 * Utility functions for interacting with the Groq API for transcription
 */

import { toast } from "sonner";

// Define interface for transcription response
interface TranscriptionResponse {
  text: string;
  processingTime?: number;
  model?: string;
}

/**
 * Get the Groq API key from local storage
 */
export const getGroqApiKey = (): string | null => {
  return localStorage.getItem('groqApiKey');
};

/**
 * Save the Groq API key to local storage
 */
export const saveGroqApiKey = (apiKey: string): void => {
  localStorage.setItem('groqApiKey', apiKey);
};

/**
 * Transcribe audio using Groq API
 * @param audioFile The audio file to transcribe
 * @returns Promise with transcription text
 */
export const transcribeAudioWithGroq = async (audioFile: File): Promise<TranscriptionResponse> => {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error("Groq API key is not set. Please add it in Settings.");
  }

  // Start timing the request
  const startTime = performance.now();
  
  try {
    // First, convert the audio file to base64
    const base64Audio = await fileToBase64(audioFile);
    
    // Prepare the request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: base64Audio,
        model: "whisper-1",
        response_format: "json"
      })
    });

    // End timing
    const endTime = performance.now();
    const processingTime = Number(((endTime - startTime) / 1000).toFixed(1));
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      text: result.text,
      processingTime,
      model: "groq-whisper"
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

/**
 * Convert a file to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Check if Groq API is configured properly
 */
export const isGroqConfigured = (): boolean => {
  return !!getGroqApiKey();
};
