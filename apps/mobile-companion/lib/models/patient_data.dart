class PatientProfile {
  final String abhaId;
  final String abhaAddress;
  final String name;
  final int age;
  final String gender;
  final String mobileNumber;
  final String bloodGroup;
  final String prakritiSignal; // e.g. "Kapha-Pitta Tendency"

  const PatientProfile({
    required this.abhaId,
    required this.abhaAddress,
    required this.name,
    required this.age,
    required this.gender,
    required this.mobileNumber,
    required this.bloodGroup,
    required this.prakritiSignal,
  });
}

class OPDToken {
  final String tokenNumber;
  final String department;
  final String doctorName;
  final String room;
  final String status; // 'Awaiting Kiosk', 'Kiosk Complete', 'In Consult', 'Completed'
  final int queueAhead;
  final DateTime appointmentTime;

  const OPDToken({
    required this.tokenNumber,
    required this.department,
    required this.doctorName,
    required this.room,
    required this.status,
    required this.queueAhead,
    required this.appointmentTime,
  });
}

class ClinicalSummaryRecord {
  final String id;
  final DateTime date;
  final String hospital;
  final String chiefComplaint;
  final String sourceId;
  final List<String> medications;
  final String jihvaSignal;
  final String prakritiSignal;
  final bool physicianConfirmed;

  const ClinicalSummaryRecord({
    required this.id,
    required this.date,
    required this.hospital,
    required this.chiefComplaint,
    required this.sourceId,
    required this.medications,
    required this.jihvaSignal,
    required this.prakritiSignal,
    required this.physicianConfirmed,
  });
}

class FollowUpCheckIn {
  final String id;
  final DateTime scheduledDate;
  final String title;
  final String type; // 'IVR Call' or 'App Question'
  final String status; // 'Pending', 'Completed', 'Escalated'
  final String? responseSummary;

  const FollowUpCheckIn({
    required this.id,
    required this.scheduledDate,
    required this.title,
    required this.type,
    required this.status,
    this.responseSummary,
  });
}
