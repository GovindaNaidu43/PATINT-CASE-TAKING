import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

export const getPatient = async (abhaId: string) => {
  // Mock fallback logic if actual API fails
  return { abhaId, name: 'Rajesh Kumar', age: 45, gender: 'M' };
};

export const submitSession = async (_sessionData: unknown) => {
  return { success: true, sessionId: 'sess-123' };
};

export const getOCRResult = async (_documentId: string) => {
  return { success: true };
};

export default apiClient;
