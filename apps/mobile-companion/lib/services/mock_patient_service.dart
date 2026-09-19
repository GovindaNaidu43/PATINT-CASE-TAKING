import '../models/patient_data.dart';

class MockPatientService {
  static final PatientProfile currentPatient = PatientProfile(
    abhaId: '91-1234-5678-9012',
    abhaAddress: 'rajesh.kumar@abdm',
    name: 'Rajesh Kumar',
    age: 46,
    gender: 'Male',
    mobileNumber: '+91 98765 43210',
    bloodGroup: 'B+',
    prakritiSignal: 'Kapha-Vata Dominant',
  );

  static final OPDToken activeToken = OPDToken(
    tokenNumber: 'AIIA-OPD-042',
    department: 'Kayachikitsa (Internal Medicine)',
    doctorName: 'Dr. Priya Sharma (BAMS, MD)',
    room: 'Room 204, 2nd Floor',
    status: 'Ready for Kiosk Intake',
    queueAhead: 3,
    appointmentTime: DateTime.now().add(const Duration(minutes: 25)),
  );

  static final List<ClinicalSummaryRecord> pastSummaries = [
    ClinicalSummaryRecord(
      id: 'REC-2026-0914',
      date: DateTime.now().subtract(const Duration(days: 4)),
      hospital: 'All India Institute of Ayurveda, New Delhi',
      chiefComplaint: 'Chronic acidity, sluggish digestion (Mandagni), and morning lethargy',
      sourceId: 'kiosk-turn-04',
      medications: [
        'Triphala Churna - 1 tsp at bedtime',
        'Avipattikar Churna - 3g with warm water before meals',
        'Abhayarishta - 20ml post-lunch with equal water',
      ],
      jihvaSignal: 'Mild white coating along posterior third (Kapha tendency)',
      prakritiSignal: 'Kapha 55%, Pitta 30%, Vata 15%',
      physicianConfirmed: true,
    ),
    ClinicalSummaryRecord(
      id: 'REC-2026-0610',
      date: DateTime.now().subtract(const Duration(days: 100)),
      hospital: 'All India Institute of Ayurveda, New Delhi',
      chiefComplaint: 'Seasonal allergic rhinitis and joint stiffness (Sandhivata)',
      sourceId: 'kiosk-turn-01',
      medications: [
        'Sitopaladi Churna - with honey twice daily',
        'Yograj Guggulu - 2 tablets after food',
      ],
      jihvaSignal: 'Clear margins, slight dry dorsal ridge',
      prakritiSignal: 'Vata-Kapha Tendency',
      physicianConfirmed: true,
    ),
  ];

  static final List<FollowUpCheckIn> followUpSchedule = [
    FollowUpCheckIn(
      id: 'FUP-101',
      scheduledDate: DateTime.now().add(const Duration(days: 3)),
      title: 'Day 7 Symptom & Digestion Check',
      type: 'Automated IVR Call / App Survey',
      status: 'Pending',
    ),
    FollowUpCheckIn(
      id: 'FUP-102',
      scheduledDate: DateTime.now().add(const Duration(days: 10)),
      title: 'Day 14 Medication Adherence & Red-Flag Audit',
      type: 'Interactive Voice Bot',
      status: 'Pending',
    ),
    FollowUpCheckIn(
      id: 'FUP-099',
      scheduledDate: DateTime.now().subtract(const Duration(days: 14)),
      title: 'Post-Prescription Tolerance Review',
      type: 'Completed via IVR',
      status: 'Completed',
      responseSummary: 'No adverse reaction reported. Digestion improved moderately.',
    ),
  ];
}
