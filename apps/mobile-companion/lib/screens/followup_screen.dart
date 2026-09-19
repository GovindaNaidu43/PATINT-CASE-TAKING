import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/patient_data.dart';
import '../services/mock_patient_service.dart';
import '../theme/medikiosk_theme.dart';
import '../widgets/mandala_background.dart';
import '../widgets/royal_components.dart';

class FollowUpScreen extends StatefulWidget {
  const FollowUpScreen({super.key});

  @override
  State<FollowUpScreen> createState() => _FollowUpScreenState();
}

class _FollowUpScreenState extends State<FollowUpScreen> {
  int? _digestionFeeling = 1; // 0: worse, 1: same, 2: better
  bool _adherence = true;
  bool _newRedFlags = false;
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final schedule = MockPatientService.followUpSchedule;

    return MandalaBackgroundScaffold(
      child: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          Text(
            'Module F • Closed Loop Care',
            style: theme.textTheme.labelSmall?.copyWith(color: MediKioskTheme.royalGold),
          ),
          const SizedBox(height: 2),
          Text(
            'Post-Visit Follow-Up',
            style: theme.textTheme.displayMedium,
          ),
          const SizedBox(height: 6),
          Text(
            'Automated IVR/App check-ins monitoring your recovery and medication adherence. Only flagged concerns escalate to your physician.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 18),

          // Active Survey Card
          RoyalCard(
            glowing: true,
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: MediKioskTheme.royalGoldLight,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.phone_in_talk, size: 16, color: MediKioskTheme.royalGold),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'DAY 7 CHECK-IN',
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
                      child: const Text(
                        'DUE TODAY',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: MediKioskTheme.royalGold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'How is your digestion and energy since starting the herbal regimen?',
                  style: theme.textTheme.titleMedium,
                ),
                const SizedBox(height: 14),

                // Digestion Options
                Row(
                  children: [
                    _buildSentimentChip('😟 Slower / Worse', 0),
                    const SizedBox(width: 8),
                    _buildSentimentChip('😐 Same', 1),
                    const SizedBox(width: 8),
                    _buildSentimentChip('😊 Significantly Better', 2),
                  ],
                ),
                const SizedBox(height: 16),

                // Question 2: Taking meds
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Expanded(
                      child: Text(
                        'Taking prescribed Triphala & Avipattikar regularly?',
                        style: TextStyle(fontSize: 13, color: MediKioskTheme.royalIvory, fontWeight: FontWeight.w600),
                      ),
                    ),
                    Switch(
                      value: _adherence,
                      activeColor: MediKioskTheme.royalGold,
                      onChanged: (val) => setState(() => _adherence = val),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Question 3: Red Flags check
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Expanded(
                      child: Text(
                        'Experiencing severe pain, dizziness, or vomiting? (Red Flag)',
                        style: TextStyle(fontSize: 13, color: MediKioskTheme.royalCrimson, fontWeight: FontWeight.w600),
                      ),
                    ),
                    Switch(
                      value: _newRedFlags,
                      activeColor: MediKioskTheme.royalCrimson,
                      onChanged: (val) => setState(() => _newRedFlags = val),
                    ),
                  ],
                ),
                if (_newRedFlags) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: MediKioskTheme.royalCrimson.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: MediKioskTheme.royalCrimson.withOpacity(0.4)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.warning_amber_rounded, color: MediKioskTheme.royalCrimson, size: 18),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Warning: Priority Flag will be dispatched immediately to Dr. Priya Sharma.',
                            style: TextStyle(fontSize: 11, color: MediKioskTheme.royalCrimson, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 16),

                RoyalButton(
                  label: _submitted ? 'Recorded ✓' : 'Submit Check-In',
                  onPressed: _submitted
                      ? null
                      : () {
                          setState(() => _submitted = true);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                _newRedFlags
                                    ? 'Red flag recorded. Hospital triage alerted.'
                                    : 'Follow-up successfully recorded into your ABDM health timeline.',
                              ),
                              backgroundColor:
                                  _newRedFlags ? MediKioskTheme.royalCrimson : MediKioskTheme.royalGold,
                            ),
                          );
                        },
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Follow-Up Timeline
          Text(
            'SCHEDULED FOLLOW-UP EVENTS',
            style: theme.textTheme.labelSmall?.copyWith(color: MediKioskTheme.royalGold),
          ),
          const SizedBox(height: 10),
          ...schedule.map((item) => _buildScheduleTile(context, item)),
        ],
      ),
    );
  }

  Widget _buildSentimentChip(String label, int value) {
    final isSelected = _digestionFeeling == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _digestionFeeling = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
          decoration: BoxDecoration(
            color: isSelected
                ? MediKioskTheme.royalGoldLight
                : MediKioskTheme.royalSurface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? MediKioskTheme.royalGold : MediKioskTheme.royalBorder,
              width: isSelected ? 1.5 : 1.0,
            ),
          ),
          child: Center(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? MediKioskTheme.royalGold : MediKioskTheme.royalIvory,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScheduleTile(BuildContext context, FollowUpCheckIn item) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('dd MMM yyyy');

    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: RoyalCard(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: item.status == 'Completed'
                    ? MediKioskTheme.royalTeal.withOpacity(0.2)
                    : MediKioskTheme.royalGoldLight.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(
                item.status == 'Completed' ? Icons.check : Icons.calendar_today_outlined,
                size: 18,
                color: item.status == 'Completed' ? const Color(0xFF5A7A55) : MediKioskTheme.royalGold,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.title,
                    style: theme.textTheme.titleMedium?.copyWith(fontSize: 14),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${dateFormat.format(item.scheduledDate)} • ${item.type}',
                    style: theme.textTheme.bodyMedium?.copyWith(fontSize: 11),
                  ),
                  if (item.responseSummary != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Result: ${item.responseSummary!}',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF5A7A55), fontStyle: FontStyle.italic),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
