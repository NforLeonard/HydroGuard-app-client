// services/chatService.ts - FIXED
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const BACKEND_URL = 'http://localhost:3001';

export const sendMessage = async (message: string, context: ChatMessage[]): Promise<string> => {
  try {
    console.log('📡 Frontend sending to:', `${BACKEND_URL}/api/chat`);
    
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context
      })
    });

    console.log('📡 Response status:', response.status);

    const data = await response.json();
    console.log('📡 Response data:', data);
    
    // Return response or error message
    return data.response || data.message || data.error || "Received empty response";
    
  } catch (error: any) {
    console.error('📡 sendMessage error:', error.message);
    return `Connection error: ${error.message}`;
  }
};

export const analyzeWaterData = async (metrics: any[], sensors: any[]): Promise<string> => {
  try {
    console.log('📊 Frontend analyzing with:', `${BACKEND_URL}/api/analyze-water-data`);
    
    const response = await fetch(`${BACKEND_URL}/api/analyze-water-data`, {  // NOTE: Fixed endpoint name
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metrics,
        sensors
      })
    });

    const data = await response.json();
    return data.analysis || data.result || data.error || "Analysis completed";
    
  } catch (error: any) {
    console.error('📊 analyzeWaterData error:', error);
    return `Analysis failed: ${error.message}`;
  }
};