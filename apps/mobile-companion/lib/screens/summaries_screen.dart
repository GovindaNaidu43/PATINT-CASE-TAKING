import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/patient_data.dart';
import '../services/mock_patient_service.dart';
import '../theme/medikiosk_theme.dart';
import '../widgets/mandala_background.dart';
import '../widgets/royal_components.dart';

class SummariesScreen extends StatelessWidget {
  const SummariesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final summaries = MockPatientService.pastSummaries;

    return MandalaBackgroundScaffold(
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          // Screen Title
          Text(
            'ABDM Encrypted Health Records',
            style: theme.textTheme.labelSmall?.copyWith(color: MediKioskTheme.royalGold),
          ),
          const SizedBox(height: 2),
          Text(
            'Clinical Summaries',
            style: theme.textTheme.displayMedium,
          ),
          const SizedBox(height: 6),
          Text(
            'Structured EHR summaries generated at MediKiosk and approved by your attending Ayurvedic physician.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 18),

          // Summaries List
          ...summaries.map((summary) => _buildSummaryCard(context, summary)),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(BuildContext context, ClinicalSummaryRecord summary) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('dd MMM yyyy, hh:mm a');

    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: RoyalCard(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top hospital & timestamp
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.account_balance, size: 16, color: MediKioskTheme.royalGold),
                    const SizedBox(width: 6),
                    Text(
                      dateFormat.format(summary.date),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: MediKioskTheme.royalGold,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: MediKioskTheme.royalTeal.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: MediKioskTheme.royalTeal.withOpacity(0.4)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check_circle, size: 12, color: Color(0xFF5A7A55)),
                      SizedBox(width: 4),
                      Text(
                        'Physician Verified',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF5A7A55),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              summary.hospital,
              style: theme.textTheme.bodyMedium?.copyWith(fontSize: 12),
            ),
            const Divider(color: MediKioskTheme.royalBorder, height: 20),

            // Chief Complaint
            Text(
              'CHIEF COMPLAINT (SOCRATES GROUNDED)',
              style: theme.textTheme.labelSmall?.copyWith(fontSize: 10, color: MediKioskTheme.royalMuted),
            ),
            const SizedBox(height: 4),
            Text(
              summary.chiefComplaint,
              style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),

            // Supporting AI Signals
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: MediKioskTheme.royalGoldLight.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: MediKioskTheme.royalBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'JIHVA SIGNAL',
                          style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: MediKioskTheme.royalGold),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          summary.jihvaSignal,
                          style: const TextStyle(fontSize: 11, color: MediKioskTheme.royalIvory),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: MediKioskTheme.royalGoldLight.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: MediKioskTheme.royalBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'VOICE PRAKRITI SIGNAL',
                          style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: MediKioskTheme.royalGold),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          summary.prakritiSignal,
                          style: const TextStyle(fontSize: 11, color: MediKioskTheme.royalIvory),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            const SignalBadgeWidget(),
            const SizedBox(height: 12),

            // Prescribed Medications
            Text(
              'PRESCRIBED MEDICATIONS',
              style: theme.textTheme.labelSmall?.copyWith(fontSize: 10, color: MediKioskTheme.royalMuted),
            ),
            const SizedBox(height: 6),
            ...summary.medications.map(
              (med) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2.0),
                child: Row(
                  children: [
                    const Icon(Icons.eco, size: 14, color: MediKioskTheme.royalTeal),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        med,
                        style: const TextStyle(fontSize: 12, color: MediKioskTheme.royalIvory, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Actions
            Row(
              children: [
                Expanded(
                  child: RoyalButton(
                    label: 'FHIR JSON',
                    isSecondary: true,
                    onPressed: () {
                      _showFhirModal(context, summary);
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: RoyalButton(
                    label: 'Share via ABDM',
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Record shared via ABDM Consent Manager (HIP/HIU)!'),
                          backgroundColor: MediKioskTheme.royalGold,
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showFhirModal(BuildContext context, ClinicalSummaryRecord summary) {
    showModalBottomSheet(
      context: context,
      backgroundColor: MediKioskTheme.royalSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'HL7 FHIR R4 Bundle Preview',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: MediKioskTheme.royalGold),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Container(
                height: 220,
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2C1F12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    '''{
  "resourceType": "Bundle",
  "type": "document",
  "id": "${summary.id}",
  "entry": [
    {
      "resource": {
        "resourceType": "Composition",
        "status": "final",
        "type": { "coding": [{ "system": "http://loinc.org", "code": "11488-4", "display": "Consultation note" }] },
        "subject": { "reference": "Patient/${summary.sourceId}" },
        "section": [
          { "title": "Chief Complaint", "text": "${summary.chiefComplaint}" },
          { "title": "Ayurvedic Assessment", "text": "${summary.prakritiSignal}" }
        ]
      }
    }
  ]
}''',
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: Color(0xFFFAF3E8),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'ABDM Compliant OPConsultRecord standard format.',
                style: TextStyle(fontSize: 11, color: MediKioskTheme.royalMuted),
              ),
            ],
          ),
        );
      },
    );
  }
}
