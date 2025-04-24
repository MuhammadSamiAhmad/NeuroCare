import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';

class SesssionDetail extends StatelessWidget {
  final Map detail;
  const SesssionDetail({super.key, required this.detail});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SizedBox(
        height: 320,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Date: ${detail["date"]}",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Duration: ${detail["duration"]} minutes",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Frequency: ${detail["frequency"]} Hz",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Limb temperature before session: ${detail["tempBefore"]} ℃",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Limb temperature after session: ${detail["tempAfter"]} ℃",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Numbness level: ${detail["numbnessLevel"]}",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(
              height: 4,
            ),
            Text(
              "Pain level: ${detail["painLevel"]}",
              style: TextStyle(color: textColor, fontSize: 16),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                const Spacer(),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Close"),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
