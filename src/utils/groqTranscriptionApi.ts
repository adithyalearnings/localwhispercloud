
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
 * @param model The whisper model to use (optional)
 * @returns Promise with transcription text
 */
export const transcribeAudioWithGroq = async (
  audioFile: File,
  model: string = 'whisper-1'
): Promise<TranscriptionResponse> => {
  const apiKey = getGroqApiKey();
  
  if (!apiKey) {
    throw new Error("Groq API key is not set. Please add it in Settings.");
  }

  // Start timing the request
  const startTime = performance.now();
  
  try {
    // First, convert the audio file to a form data object
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', model);
    formData.append('response_format', 'json');
    
    // Debug log to help troubleshoot issues
    console.log(`Sending transcription request with model: ${model} and file: ${audioFile.name} (${audioFile.size} bytes)`);
    
    // Prepare the request to Groq API using FormData instead of base64
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
        // Don't set Content-Type with FormData, browser will set it automatically with boundary
      },
      body: formData
    });

    // End timing
    const endTime = performance.now();
    const processingTime = Number(((endTime - startTime) / 1000).toFixed(1));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Transcription result:', result);
    
    return {
      text: result.text,
      processingTime,
      model: model
    };
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

/**
 * Check if Groq API is configured properly
 */
export const isGroqConfigured = (): boolean => {
  return !!getGroqApiKey();
};
