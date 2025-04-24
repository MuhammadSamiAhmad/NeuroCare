import 'package:circu_flow/widgets/exercise_detail.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:circu_flow/constants.dart';

class Exercise extends StatelessWidget {
  final String limb;
  const Exercise({super.key, required this.limb});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> upperLimbExercises = [
      {
        "description": "Wrist circles to improve blood flow in arms.",
        "duration": "2 minutes",
        "video": "kGHD1rhBvS4"
      },
      {
        "description": "Shoulder shrugs to enhance upper body circulation.",
        "duration": "1 minute",
        "video": "q3EcVqr24OQ"
      },
      {
        "description": "Arm swings to stimulate blood flow.",
        "duration": "3 minutes",
        "video": "BHmBWVRDbXw"
      },
    ];

    final List<Map<String, dynamic>> lowerLimbExercises = [
      {
        "description": "Brisk walking to boost leg circulation.",
        "duration": "20 minutes",
        "video": "nmvVfgrExAg"
      },
      {
        "description": "Ankle pumps to improve lower leg blood flow.",
        "duration": "3 minutes",
        "video": "tZ8XkQkhg2o"
      },
      {
        "description": "Calf raises to enhance circulation in the legs.",
        "duration": "2 minutes",
        "video": "a-x_NR-ibos"
      },
    ];

    final DateTime now = DateTime.now();
    final int dayOfYear = int.parse(DateFormat("D").format(now));

    final List<Map<String, dynamic>> exercises =
        limb.toLowerCase() == 'upper' ? upperLimbExercises : lowerLimbExercises;

    final selectedExercise = exercises[dayOfYear % exercises.length];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Today's Exercise",
          style: TextStyle(color: Colors.white),
        ),
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
        child: ExerciseDetail(exercise: selectedExercise),
      ),
    );
  }
}
