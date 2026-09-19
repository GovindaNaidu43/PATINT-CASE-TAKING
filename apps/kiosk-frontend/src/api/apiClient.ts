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

export const requestAbhaOtp = async (abhaAddress: string) => (await apiClient.post('/abdm/abha/request-otp', { abha_address: abhaAddress })).data;
export const confirmAbhaOtp = async (transactionId: string, otp: string) => (await apiClient.post('/abdm/abha/confirm-otp', { transaction_id: transactionId, otp })).data;
export const synthesizeSpeech = async (text: string, language = 'hi') => (await apiClient.post('/speech/tts', { text, language })).data;
export const speechToText = async (audioBase64: string, language = 'hi') => (await apiClient.post('/api/ai/asr', { audio_base64: audioBase64, language })).data;
export const translateText = async (text: string, sourceLang: string, targetLang: string) => (await apiClient.post('/api/ai/translate', { text, source_lang: sourceLang, target_lang: targetLang })).data;
export const transliterateText = async (text: string, targetLang = 'hi') => (await apiClient.post('/api/ai/transliterate', { text, target_lang: targetLang })).data;
export const extractLmmc = async (narrative: string, language = 'hi') => (await apiClient.post('/api/ai/lmmc', { narrative, language })).data;
export const analyzeJihva = async (consultationId: string, image: Blob) => {
  const form = new FormData();
  form.append('consultation_id', consultationId);
  form.append('image', image, 'jihva-capture.jpg');
  return (await apiClient.post('/signals/jihva', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
};

export const getOCRResult = async (_documentId: string) => {
  return { success: true };
};

export default apiClient;
