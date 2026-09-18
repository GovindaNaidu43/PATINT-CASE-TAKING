export const mockSummary = {
  sessionId: 'sess-2026-09-18-001',
  patientAbha: '91-1234-5678-9012',
  chiefComplaint: { text: 'Chest tightness and breathlessness on exertion for 1 week.', sourceId: 'q1-q3', sourceTurns: [1, 2, 3] },
  historyOfPresentIllness: { text: 'Pressure-type chest discomfort radiating to left arm. Severity 7/10. Worsens on climbing stairs.', sourceId: 'q3-q4-q5', sourceTurns: [3, 4, 5] },
  medicalBackground: { text: 'Known T2DM on Metformin. Hypertension on Amlodipine. Also taking Triphala Churna.', sourceId: 'doc-prescription_scan_001' },
  jihvaSignal: { text: 'Mild white coating noted. Suggestive of Kapha tendency.', sourceId: 'jihva-capture-001', isSignalOnly: true },
  redFlags: ['Chest pain + left arm radiation — Priority cardiac triage requested'],
  physicianConfirmed: false,
};
