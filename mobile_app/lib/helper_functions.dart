import 'dart:convert';
import 'package:http/http.dart' as http;

Duration getRemainingTime(sessionTime) {
  final parts = sessionTime.split(":").map(int.parse).toList();

  final now = DateTime.now();

  DateTime targetTime = DateTime(
    now.year,
    now.month,
    now.day,
    parts[0],
    parts[1],
    parts[2],
  );

  if (targetTime.isBefore(now)) {
    targetTime = targetTime.add(const Duration(days: 1));
  }

  final remaining = targetTime.difference(now);
  return remaining;
}

String getTimeUnitValue(remaining, timeUnit) {
  switch (timeUnit) {
    case 'hour':
      return remaining.inHours.toString();
    case 'minute':
      return (remaining.inMinutes % 60).toString();
    case 'second':
      return (remaining.inSeconds % 60).toString();
    default:
      return 'Invalid time unit';
  }
}

double _parseNumber(dynamic value) {
  if (value == null) return 0.0;

  final regex = RegExp(r'(\d+\.?\d*)');
  final match = regex.firstMatch(value.toString());

  if (match != null) {
    return double.tryParse(match.group(1)!) ?? 0.0;
  }

  return 0.0;
}

Future<Map<String, dynamic>> fetchRecommendation(
  String age,
  String limb,
  double temp,
  int painLevel,
  int numbnessLevel,
) async {
  final url = Uri.parse('http://10.0.2.2:8000/recommend');
  final data = {
    'age': age,
    'limbType': limb,
    'temperature': temp,
    'painLevel': painLevel,
    'numbnessLevel': numbnessLevel,
  };

  final response = await http.post(
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    body: json.encode(data),
  );

  // Check if the response status is successful (200 OK)
  if (response.statusCode == 200) {
    // Parse the JSON response from the server
    final responseData = json.decode(response.body);
    // Extract the recommended frequency, duration, and justification from the response
    return {
      'frequency': _parseNumber(responseData['frequency']),
      'duration': _parseNumber(responseData['duration']),
      'justification': responseData["justification"],
    };
  } else {
    return {'error': 'Failed to fetch recommendation from server'};
  }
}

void startTimerBasedOnDuration(int duration, startRef) {
  Future.delayed(Duration(minutes: duration), () {
    startRef.set(false);
  });
}
