import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import RoyalButton from '../components/ui/RoyalButton';

type CheckState = 'idle' | 'running' | 'passed' | 'failed';
type Check = { id: string; label: string; description: string; state: CheckState; detail?: string };

const initialChecks: Check[] = [
  { id: 'health', label: 'Gateway health', description: 'FastAPI is reachable and reports readiness.', state: 'idle' },
  { id: 'workflow', label: 'Patient + consultation + dialogue', description: 'Creates a demo patient, starts a consultation, and saves a touch turn.', state: 'idle' },
  { id: 'ocr', label: 'OCR document intake', description: 'Uploads a small sample document and extracts its text.', state: 'idle' },
  { id: 'signals', label: 'Jihva + voice signals', description: 'Checks both supporting-signal endpoints with sample payloads.', state: 'idle' },
  { id: 'summary', label: 'Summary review gate', description: 'Creates, confirms, and releases a grounded summary.', state: 'idle' },
  { id: 'abdm', label: 'ABDM adapter', description: 'Checks the current ABHA verification adapter.', state: 'idle' },
  { id: 'followup', label: 'Follow-up workflow', description: 'Schedules a check-in and evaluates a sample response.', state: 'idle' },
];

const DiagnosticsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [checks, setChecks] = useState(initialChecks);
  const [runningAll, setRunningAll] = useState(false);

  const update = (id: string, state: CheckState, detail?: string) => {
    setChecks(previous => previous.map(check => check.id === id ? { ...check, state, detail } : check));
  };

  const runCheck = async (id: string) => {
    update(id, 'running');
    try {
      let detail = '';
      if (id === 'health') {
        const response = await apiClient.get('/health');
        detail = JSON.stringify(response.data);
      } else if (id === 'workflow') {
        const patient = await apiClient.post('/patients', { name: `Diagnostics ${Date.now()}`, consent_granted: true });
        const consultation = await apiClient.post('/consultations', { patient_id: patient.data.id });
        const turn = await apiClient.post(`/dialogue/turn?consultation_id=${consultation.data.id}`, { text: 'Headache', modality: 'touch', language: 'en' });
        detail = JSON.stringify({ consultation_id: consultation.data.id, phase: turn.data.phase, question_key: turn.data.question_key });
      } else if (id === 'ocr') {
        const form = new FormData();
        form.append('file', new Blob(['Sample prescription: paracetamol 500 mg'], { type: 'text/plain' }), 'diagnostics.txt');
        const response = await apiClient.post('/documents/ingest', form);
        detail = JSON.stringify({ text: response.data.text, entities: response.data.entities });
      } else if (id === 'signals') {
        const image = new FormData();
        image.append('image', new Blob(['sample tongue image'], { type: 'image/jpeg' }), 'diagnostics.jpg');
        const audio = new FormData();
        audio.append('audio', new Blob(['sample voice audio'], { type: 'audio/wav' }), 'diagnostics.wav');
        const [jihva, voice] = await Promise.all([apiClient.post('/signals/jihva', image), apiClient.post('/signals/voice', audio)]);
        detail = JSON.stringify({ jihva: jihva.data, voice: voice.data });
      } else if (id === 'summary') {
        const draft = await apiClient.post('/summaries', { consultation_id: 'diagnostics', facts: ['Patient reports headache'], sources: ['turn:0'] });
        await apiClient.post(`/summaries/${draft.data.id}/confirm?physician_id=diagnostics-physician`);
        const released = await apiClient.post(`/summaries/${draft.data.id}/release`);
        detail = JSON.stringify(released.data);
      } else if (id === 'abdm') {
        const response = await apiClient.post('/abdm/abha/verify', { abha_address: 'diagnostics@abdm' });
        detail = JSON.stringify(response.data);
      } else if (id === 'followup') {
        const schedule = await apiClient.post('/followups/schedule', { consultation_id: 'diagnostics', destination: '+910000000000', hours: 24 });
        const response = await apiClient.post('/followups/response', { text: 'I feel better today' });
        detail = JSON.stringify({ schedule: schedule.data, response: response.data });
      }
      update(id, 'passed', detail);
    } catch (error: any) {
      const detail = error?.response?.data ? JSON.stringify(error.response.data) : error?.message || 'Request failed';
      update(id, 'failed', detail);
    }
  };

  const runAll = async () => {
    setRunningAll(true);
    for (const check of checks) await runCheck(check.id);
    setRunningAll(false);
  };

  const passed = checks.filter(check => check.state === 'passed').length;
  const failed = checks.filter(check => check.state === 'failed').length;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-royal-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <p className="text-royal-gold uppercase tracking-[0.3em] text-xs mb-3">Developer console</p>
            <h1 className="text-4xl text-white mb-3">Capability diagnostics</h1>
            <p className="text-gray-400 max-w-2xl">Run live checks against the connected gateway before a demo or client review. These checks use sample data and do not replace clinical validation.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <RoyalButton variant="secondary" size="sm" onClick={() => navigate('/')}>Exit</RoyalButton>
            <RoyalButton size="sm" disabled={runningAll} onClick={() => void runAll()}>{runningAll ? 'Running...' : 'Run all checks'}</RoyalButton>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-royal-surface border border-royal-gold/20 rounded-xl p-5"><p className="text-gray-400 text-sm">Checks passed</p><p className="text-3xl text-emerald-400 mt-2">{passed}/{checks.length}</p></div>
          <div className="bg-royal-surface border border-royal-gold/20 rounded-xl p-5"><p className="text-gray-400 text-sm">Failures</p><p className="text-3xl text-red-400 mt-2">{failed}</p></div>
          <div className="bg-royal-surface border border-royal-gold/20 rounded-xl p-5"><p className="text-gray-400 text-sm">API base URL</p><p className="text-sm text-royal-gold mt-3 break-all">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</p></div>
        </div>

        <div className="space-y-3">
          {checks.map(check => (
            <div key={check.id} className="bg-royal-surface border border-royal-gold/20 rounded-xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-lg text-white">{check.label}</h2><p className="text-sm text-gray-400 mt-1">{check.description}</p></div>
                <div className="flex items-center gap-4 shrink-0"><span className={`text-xs uppercase tracking-wider ${check.state === 'passed' ? 'text-emerald-400' : check.state === 'failed' ? 'text-red-400' : check.state === 'running' ? 'text-royal-gold' : 'text-gray-500'}`}>{check.state}</span><RoyalButton variant="secondary" size="sm" disabled={check.state === 'running' || runningAll} onClick={() => void runCheck(check.id)}>Run</RoyalButton></div>
              </div>
              {check.detail && <pre className={`mt-4 p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap ${check.state === 'failed' ? 'bg-red-950/30 text-red-200' : 'bg-black/20 text-gray-300'}`}>{check.detail}</pre>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsScreen;