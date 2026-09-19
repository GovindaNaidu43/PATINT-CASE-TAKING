/**
 * MediKiosk Doctor Dashboard API client.
 * All staff endpoints require a Bearer token (Keycloak JWT).
 * In development (no token set), requests are made without auth so the
 * backend dev-mode falls through gracefully.
 */
import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

/** Retrieve the stored auth token (set after Keycloak login). */
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('medikiosk.staffToken')
}

const http = axios.create({ baseURL: BASE })

http.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Operations ------------------------------------------------------------
export interface QueueItem {
  consultation_id: string
  patient_id: string
  patient_name: string
  status: string
  red_flag_count: number
  created_at: string
}

export const getQueue = async (): Promise<QueueItem[]> => {
  const { data } = await http.get('/operations/queue')
  return data as QueueItem[]
}

// --- Consultations ----------------------------------------------------------
export interface ConsultationDetail {
  id: string
  status: string
  created_at: string
  updated_at: string
  patient: {
    id: string; name: string; age?: number; gender?: string
    contact?: string; blood_group?: string; occupation?: string; abha_id?: string
  }
  turns: {
    text: string; modality: string; language: string
    answer_key?: string; phase?: string
    red_flags?: { phrase: string; action: string }[]
    rubrics?: { rubric: string; score: number }[]
  }[]
  red_flags: { phrase: string; action: string }[]
  consent: { purposes: string[]; language: string; granted_at: string } | null
  prescriptions: PrescriptionItem[]
}

export const getConsultation = async (consultationId: string): Promise<ConsultationDetail> => {
  const { data } = await http.get(`/consultations/${encodeURIComponent(consultationId)}`)
  return data as ConsultationDetail
}

// --- Prescriptions ----------------------------------------------------------
export interface PrescriptionItem {
  id: string; consultation_id: string; patient_id: string
  remedy: string; potency: string; dosage: string
  schedule: string; duration: string; instructions?: string
  status: string; prescribed_by?: string; created_at: string
}

export interface PrescriptionPayload {
  consultation_id: string; remedy: string; potency: string
  dosage: string; schedule: string; duration: string; instructions?: string
}

export const createPrescription = async (
  consultationId: string,
  payload: PrescriptionPayload
): Promise<PrescriptionItem> => {
  const { data } = await http.post(`/consultations/${encodeURIComponent(consultationId)}/prescriptions`, payload)
  return data as PrescriptionItem
}

export const signPrescription = async (
  consultationId: string,
  prescriptionId: string
): Promise<PrescriptionItem> => {
  const { data } = await http.post(
    `/consultations/${encodeURIComponent(consultationId)}/prescriptions/${encodeURIComponent(prescriptionId)}/sign`
  )
  return data as PrescriptionItem
}

// --- Summaries --------------------------------------------------------------
export interface SummaryDraft {
  id: string; consultation_id: string; content: string
  sources: string[]; physician_confirmed: boolean; status: string
}

export const createSummary = async (
  consultationId: string,
  facts: string[],
  sources: string[]
): Promise<SummaryDraft> => {
  const { data } = await http.post('/summaries', { consultation_id: consultationId, facts, sources })
  return data as SummaryDraft
}

export const confirmSummary = async (draftId: string): Promise<SummaryDraft> => {
  const { data } = await http.post(`/summaries/${encodeURIComponent(draftId)}/confirm`)
  return data as SummaryDraft
}

export const releaseSummary = async (draftId: string): Promise<{ status: string; draft_id: string }> => {
  const { data } = await http.post(`/summaries/${encodeURIComponent(draftId)}/release`)
  return data as { status: string; draft_id: string }
}

// --- Follow-ups -------------------------------------------------------------
export interface FollowUpItem {
  id: string; consultation_id: string; patient_id: string
  destination: string; due_at: string; status: string
}

export const getFollowUps = async (consultationId: string): Promise<FollowUpItem[]> => {
  const { data } = await http.get(`/followups/${encodeURIComponent(consultationId)}`)
  return data as FollowUpItem[]
}

export const scheduleFollowUp = async (
  consultationId: string,
  destination: string,
  hours = 24
): Promise<FollowUpItem> => {
  const { data } = await http.post('/followups/schedule', {
    consultation_id: consultationId,
    destination,
    hours,
  })
  return data as FollowUpItem
}

export const submitFollowUpResponse = async (text: string) => {
  const { data } = await http.post('/followups/response', { text })
  return data
}

// --- Health -----------------------------------------------------------------
export const checkHealth = async () => {
  const { data } = await http.get('/health')
  return data
}

export default http
