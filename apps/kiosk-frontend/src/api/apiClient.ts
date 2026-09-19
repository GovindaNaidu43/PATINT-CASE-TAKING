import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'X-Kiosk-Key': import.meta.env.VITE_KIOSK_API_KEY || '' },
});

export const getPatient = async (abhaId: string) => {
  const response = await apiClient.get('/patients', { params: { abha_id: abhaId } });
  return response.data;
};

export type PatientRegistration = { name: string; age?: number; gender?: string; contact?: string; blood_group?: string; occupation?: string; abha_id?: string; consent_granted: boolean };

export const createPatient = async (patient: PatientRegistration) => {
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
  throw new Error('Session submission has been replaced by individual, auditable API calls.');
};

export const grantConsent = async (consultationId: string, language: 'en' | 'hi', purposes: Array<'care' | 'voice_biomarker' | 'jihva_image' | 'followup'>) => {
  const response = await apiClient.post('/patients/consents', { consultation_id: consultationId, language, purposes });
  return response.data;
};

export const getOCRResult = async (_documentId: string) => {
  return { success: true };
};

export default apiClient;
