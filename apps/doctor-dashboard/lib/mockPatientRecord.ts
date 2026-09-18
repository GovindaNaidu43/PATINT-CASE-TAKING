export const mockPatientRecord = {
  id: 'p001',
  name: 'Rajesh Kumar',
  abha: '91-1234-5678-9012',
  age: 45,
  sex: 'M',
  physicianConfirmed: false,
  summary: {
    chiefComplaint: 'Patient reports chest tightness and breathlessness starting 2 hours ago. Pain radiates to left shoulder.',
    hpi: 'Onset was sudden while resting. Severity 7/10. No relief with rest.',
    medicalHistory: 'Hypertension (diagnosed 5 years ago), Type 2 Diabetes.',
    jihvaSummary: 'Pale coating observed, slight dryness. Possible Vata-Kapha imbalance.',
    sources: {
      chiefComplaint: 'conv-turns-1-3',
      hpi: 'conv-turns-4-6',
      medicalHistory: 'conv-turns-7-9',
      jihva: 'kiosk-vision-01'
    }
  },
  documents: [
    {
      filename: 'Recent_ECG.pdf',
      date: '2023-10-15',
      type: 'Radiology',
      confidence: 95,
      ocrText: 'SINUS RHYTHM\nNORMAL ECG\nHR: 75 BPM\nPR INTERVAL: 0.16s\nQRS DURATION: 0.08s',
      patientConfirmed: true
    },
    {
      filename: 'Lab_Results_Aug.pdf',
      date: '2023-08-20',
      type: 'Lab Report',
      confidence: 88,
      ocrText: 'HbA1c: 7.2%\nFasting Glucose: 130 mg/dL\nCholesterol: 210 mg/dL',
      patientConfirmed: false
    }
  ],
  jihvaSignal: {
    captureTime: '2023-10-25T08:35:00Z',
    coatingColor: 'Pale White',
    texture: 'Dry, fissured',
    moisture: 'Low',
    analysisNote: 'Vata aggravation indicated by dryness and fissures.'
  },
  prakritiData: { vata: 35, pitta: 25, kapha: 80 },
  redFlags: [
    { id: 'f1', text: 'Chest pain radiating to shoulder', source: 'Chief Complaint NLP', timestamp: '2023-10-25T08:33:00Z' }
  ]
}
