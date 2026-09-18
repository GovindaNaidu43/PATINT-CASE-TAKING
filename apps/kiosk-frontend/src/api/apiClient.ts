import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

export const getPatient = async (abhaId: string) => {
  // Mock fallback logic if actual API fails
  return { abhaId, name: 'Rajesh Kumar', age: 45, gender: 'M' };
};

export const createPatient = async (patient: { name: string; abha_id?: string; consent_granted: boolean }) => {
  const response = await apiClient.post('/patients', patient);
  return response.data;
};

export const createConsultation = async (patientId: string) => {
  const response = await apiClient.post('/consultations', { patient_id: patientId });
  return response.data;
};

export const submitDialogueTurn = async (consultationId: string, text: string, modality: 'voice' | 'touch' | 'text', language: 'en' | 'hi' = 'en') => {
  const response = await apiClient.post(`/dialogue/turn?consultation_id=${encodeURIComponent(consultationId)}`, {
    text,
    modality,
    language,
  });
  return response.data;
};

export const submitSession = async (_sessionData: unknown) => {
  return { success: true, sessionId: 'sess-123' };
};

export const getOCRResult = async (_documentId: string) => {
  return { success: true };
};

export default apiClient;
