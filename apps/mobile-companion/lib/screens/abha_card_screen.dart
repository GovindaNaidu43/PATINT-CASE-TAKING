import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../models/patient_data.dart';
import '../services/mock_patient_service.dart';
import '../theme/medikiosk_theme.dart';
import '../widgets/mandala_background.dart';
import '../widgets/royal_components.dart';

class AbhaCardScreen extends StatelessWidget {
  final PatientProfile patient = MockPatientService.currentPatient;

  AbhaCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return MandalaBackgroundScaffold(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Ayushman Bharat Digital Mission',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: MediKioskTheme.royalGold,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Digital ABHA ID',
                      style: theme.textTheme.displayMedium,
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: MediKioskTheme.royalGoldLight.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: MediKioskTheme.royalBorder),
                  ),
                  child: const Icon(Icons.verified_user_outlined, color: MediKioskTheme.royalGold),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Official Golden ABHA Card
            RoyalCard(
              glowing: true,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Card Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: MediKioskTheme.royalGoldLight,
                              border: Border.all(color: MediKioskTheme.royalGoldAccent),
                            ),
                            child: const Center(
                              child: Icon(Icons.spa, color: MediKioskTheme.royalGold, size: 22),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'National Health Authority',
                                style: theme.textTheme.labelSmall?.copyWith(fontSize: 10),
                              ),
                              Text(
                                'ABHA Card',
                                style: theme.textTheme.titleMedium?.copyWith(
                                  color: MediKioskTheme.royalGold,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: MediKioskTheme.royalTeal.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'M1 VERIFIED',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF5A7A55),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: MediKioskTheme.royalBorder, height: 28),

                  // Middle Section: Details + QR
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Patient Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              patient.name,
                              style: theme.textTheme.displayMedium?.copyWith(fontSize: 22),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'ABHA Number',
                              style: theme.textTheme.labelSmall,
                            ),
                            Text(
                              patient.abhaId,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: MediKioskTheme.royalIvory,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'ABHA Address',
                              style: theme.textTheme.labelSmall,
                            ),
                            Text(
                              patient.abhaAddress,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: MediKioskTheme.royalGold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${patient.gender} • ${patient.age} Yrs • Blood ${patient.bloodGroup}',
                              style: theme.textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),

                      // QR Code for Fast Kiosk Check-In
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: MediKioskTheme.royalBorder),
                          boxShadow: [
                            BoxShadow(
                              color: MediKioskTheme.royalGold.withOpacity(0.12),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                        child: QrImageView(
                          data: patient.abhaId,
                          version: QrVersions.auto,
                          size: 96,
                          eyeStyle: const QrEyeStyle(
                            eyeShape: QrEyeShape.square,
                            color: MediKioskTheme.royalDarkBrown,
                          ),
                          dataModuleStyle: const QrDataModuleStyle(
                            dataModuleShape: QrDataModuleShape.square,
                            color: MediKioskTheme.royalDarkBrown,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Bottom Badge in Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: MediKioskTheme.royalGoldLight.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Scan this QR at the MediKiosk scanner',
                          style: TextStyle(fontSize: 11, color: MediKioskTheme.royalMuted, fontWeight: FontWeight.w600),
                        ),
                        const Icon(Icons.qr_code_scanner, size: 16, color: MediKioskTheme.royalGold),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Live OPD Queue Card
            RoyalCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.access_time_rounded, color: MediKioskTheme.royalGold, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            'TODAY\'S OPD STATUS',
                            style: theme.textTheme.labelSmall?.copyWith(color: MediKioskTheme.royalGold),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: MediKioskTheme.royalGoldAccent.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          MockPatientService.activeToken.status,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: MediKioskTheme.royalGold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            MockPatientService.activeToken.tokenNumber,
                            style: theme.textTheme.displayMedium?.copyWith(
                              fontSize: 24,
                              color: MediKioskTheme.royalGold,
                            ),
                          ),
                          Text(
                            MockPatientService.activeToken.department,
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
                          ),
                          Text(
                            MockPatientService.activeToken.doctorName,
                            style: theme.textTheme.bodyLarge,
                          ),
                          Text(
                            MockPatientService.activeToken.room,
                            style: theme.textTheme.bodyMedium,
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: MediKioskTheme.royalGoldLight.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: MediKioskTheme.royalBorder),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'Ahead in Queue',
                              style: TextStyle(fontSize: 10, color: MediKioskTheme.royalMuted),
                            ),
                            Text(
                              '${MockPatientService.activeToken.queueAhead}',
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.bold,
                                color: MediKioskTheme.royalGold,
                              ),
                            ),
                            Text(
                              DateFormat('hh:mm a').format(MockPatientService.activeToken.appointmentTime),
                              style: const TextStyle(fontSize: 11, color: MediKioskTheme.royalMuted),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Pre-Consultation Instructions
            RoyalCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Step-by-Step Kiosk Instructions',
                    style: theme.textTheme.titleMedium?.copyWith(color: MediKioskTheme.royalIvory),
                  ),
                  const SizedBox(height: 10),
                  _buildStepRow('1', 'Hold your ABHA QR to the kiosk scanner lens.'),
                  _buildStepRow('2', 'Speak naturally in your local language (SOCRATES interview).'),
                  _buildStepRow('3', 'Place old prescriptions on the camera pad for AI OCR.'),
                  _buildStepRow('4', 'Look into the camera for the Jihva (tongue) supporting capture.'),
                  _buildStepRow('5', 'Proceed to Dr. Priya Sharma\'s room — history is already on screen!'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepRow(String number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 20,
            height: 20,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: MediKioskTheme.royalGold,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 13, color: MediKioskTheme.royalIvory, height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}
