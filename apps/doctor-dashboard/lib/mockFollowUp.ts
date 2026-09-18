export const mockFollowUp = [
  {
    id: 'fu001',
    name: 'Anita Desai',
    abha: '91-3456-1234-5678',
    lastVisit: '2023-10-20',
    log: [
      {
        date: '2023-10-23',
        method: 'IVR',
        sentiment: 'negative',
        summary: 'Patient reported worsening of cough and slight fever.',
        escalated: true,
        escalationReason: 'Symptom worsening post-treatment'
      }
    ]
  },
  {
    id: 'fu002',
    name: 'Vikram Singh',
    abha: '91-5678-2345-6789',
    lastVisit: '2023-10-21',
    log: [
      {
        date: '2023-10-22',
        method: 'SMS',
        sentiment: 'neutral',
        summary: 'Medication reminder sent. Patient confirmed taking meds.',
        escalated: false
      },
      {
        date: '2023-10-24',
        method: 'IVR',
        sentiment: 'positive',
        summary: 'Patient feeling much better, pain reduced by 80%.',
        escalated: false
      }
    ]
  },
  {
    id: 'fu003',
    name: 'Priya Patel',
    abha: '91-8901-3456-7890',
    lastVisit: '2023-10-18',
    log: [
      {
        date: '2023-10-25',
        method: 'IVR',
        sentiment: 'neutral',
        summary: 'Routine 1-week follow up. No new issues reported.',
        escalated: false
      }
    ]
  },
  {
    id: 'fu004',
    name: 'Ramesh Gupta',
    abha: '91-2345-8901-2345',
    lastVisit: '2023-10-19',
    log: [
      {
        date: '2023-10-21',
        method: 'SMS',
        sentiment: 'neutral',
        summary: 'Patient asked about diet restrictions.',
        escalated: false
      }
    ]
  }
]
