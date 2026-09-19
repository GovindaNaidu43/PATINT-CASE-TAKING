import 'dart:convert';
import 'package:http/http.dart' as http;

/// Base URL for the MediKiosk backend (override via env in production).
const _baseUrl = 'http://localhost:8000';

// ─── Request helper ──────────────────────────────────────────────────────────

Map<String, String> _headers({String? bearerToken}) => {
  'Content-Type': 'application/json',
  'X-Kiosk-Key': const String.fromEnvironment('KIOSK_API_KEY', defaultValue: ''),
  if (bearerToken != null) 'Authorization': 'Bearer $bearerToken',
};

// ─── Patient ─────────────────────────────────────────────────────────────────

/// Look up a patient by ABHA address via the ABDM connector.
Future<Map<String, dynamic>?> verifyAbhaAddress(String abhaAddress) async {
  final res = await http.post(
    Uri.parse('$_baseUrl/abdm/abha/verify'),
    headers: _headers(),
    body: jsonEncode({'abha_address': abhaAddress}),
  );
  if (res.statusCode == 200) return jsonDecode(res.body) as Map<String, dynamic>;
  return null;
}

/// Look up a local patient record by ABHA ID.
Future<Map<String, dynamic>?> getPatientByAbha(String abhaId) async {
  final res = await http.get(
    Uri.parse('$_baseUrl/patients?abha_id=${Uri.encodeComponent(abhaId)}'),
    headers: _headers(),
  );
  if (res.statusCode == 200) return jsonDecode(res.body) as Map<String, dynamic>;
  return null;
}

// ─── Consultation ────────────────────────────────────────────────────────────

/// Fetch a consultation (turns, red_flags, prescriptions, patient info).
Future<Map<String, dynamic>?> getConsultation(String consultationId) async {
  final res = await http.get(
    Uri.parse('$_baseUrl/consultations/${Uri.encodeComponent(consultationId)}'),
    headers: _headers(),
  );
  if (res.statusCode == 200) return jsonDecode(res.body) as Map<String, dynamic>;
  return null;
}

// ─── Follow-ups ──────────────────────────────────────────────────────────────

/// List follow-ups for a consultation.
Future<List<Map<String, dynamic>>> getFollowUps(String consultationId) async {
  final res = await http.get(
    Uri.parse('$_baseUrl/followups/${Uri.encodeComponent(consultationId)}'),
    headers: _headers(),
  );
  if (res.statusCode == 200) {
    final list = jsonDecode(res.body) as List<dynamic>;
    return list.cast<Map<String, dynamic>>();
  }
  return [];
}

/// Submit a patient follow-up response text (assessed by backend AI).
Future<Map<String, dynamic>?> submitFollowUpResponse(String text) async {
  final res = await http.post(
    Uri.parse('$_baseUrl/followups/response'),
    headers: _headers(),
    body: jsonEncode({'text': text}),
  );
  if (res.statusCode == 200) return jsonDecode(res.body) as Map<String, dynamic>;
  return null;
}
