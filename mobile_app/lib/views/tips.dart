import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';
import 'package:intl/intl.dart';

class Tips extends StatelessWidget {
  final String limb;
  const Tips({super.key, required this.limb});

  @override
  Widget build(BuildContext context) {
    final List<String> upperLimbTips = [
      'Keep your arms elevated periodically to aid circulation.',
      'Avoid prolonged static positions; move your arms regularly.',
      'Stay hydrated to support overall blood flow.',
    ];

    final List<String> lowerLimbTips = [
      'Elevate your legs when resting to improve circulation.',
      'Wear compression socks if recommended to aid blood flow.',
      'Avoid sitting for long periods; take short walks regularly.',
    ];

    final DateTime now = DateTime.now();
    final int dayOfYear = int.parse(DateFormat("D").format(now));
    final List<String> tips =
        limb.toLowerCase() == 'upper' ? upperLimbTips : lowerLimbTips;
    final String tip = tips[dayOfYear % tips.length];

    return Scaffold(
        appBar: AppBar(
          leading: IconButton(
              onPressed: () {
                Navigator.pop(context);
              },
              icon: const Icon(
                Icons.arrow_back,
                color: Colors.white,
              )),
          backgroundColor: textColor,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Container(
            height: 200,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: option3Color,
                width: 2.5,
              ),
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.tips_and_updates,
                      color: option3Color,
                      size: 30,
                    ),
                    const Spacer(
                      flex: 1,
                    ),
                    const Text(
                      'Tip of the Day',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const Spacer(
                      flex: 1,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const SizedBox(height: 8),
                Text(
                  tip,
                  style: TextStyle(fontSize: 16, color: textColor),
                ),
              ],
            ),
          ),
        ));
  }
}
