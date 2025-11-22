// Health check endpoint - doesn't use /api/v1 prefix
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface HealthResponse {
  status: 'ok';
  timestamp: string; // ISO8601
  uptime: number; // seconds
}

// Health check function (can be called directly)
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

// Simple hook for health check
export const useGetHealth = () => {
  return { checkHealth };
};

