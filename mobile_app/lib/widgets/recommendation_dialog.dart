import 'package:flutter/material.dart';
import 'package:circu_flow/helper_functions.dart';
import 'package:firebase_database/firebase_database.dart';

class RecommendationDialog extends StatefulWidget {
  final String age;
  final String limb;
  final double temp;

  const RecommendationDialog({
    super.key,
    required this.age,
    required this.limb,
    required this.temp,
  });

  @override
  RecommendationDialogState createState() => RecommendationDialogState();
}

class RecommendationDialogState extends State<RecommendationDialog> {
  bool isLoading = false;
  int painLevel = 0;
  int numbnessLevel = 0;
  double frequency = 120.0;
  double duration = 20.0;
  String justification = "";
  int currentPage = 0;
  double tempFrequency = 0.0;
  double tempDuration = 0.0;
  final DatabaseReference startRef = FirebaseDatabase.instance.ref('start');
  final DatabaseReference freqRef = FirebaseDatabase.instance.ref('frequency');
  final DatabaseReference durationRef =
      FirebaseDatabase.instance.ref('duration');
  final DatabaseReference painRef = FirebaseDatabase.instance.ref('painLevel');
  final DatabaseReference numbnessRef =
      FirebaseDatabase.instance.ref('numbnessLevel');
  final DatabaseReference tempBreforeRef =
      FirebaseDatabase.instance.ref('tempBefore');
  final DatabaseReference tempRef = FirebaseDatabase.instance.ref('Temp');

  final TextEditingController freqController = TextEditingController();
  final TextEditingController durationController = TextEditingController();

  void _nextPage() async {
    if (painLevel < 0 ||
        painLevel > 10 ||
        numbnessLevel < 0 ||
        numbnessLevel > 10) {
      return;
    }

    setState(() {
      isLoading = true;
    });

    final recommendation = await fetchRecommendation(
      widget.age,
      widget.limb,
      widget.temp,
      painLevel,
      numbnessLevel,
    );

    setState(() {
      isLoading = false;
    });

    if (recommendation.containsKey('error')) {
      return;
    }

    setState(() {
      frequency = recommendation['frequency'];
      duration = recommendation['duration'];
      justification = recommendation['justification'];
      currentPage++;
    });
  }

  void _previousPage() {
    setState(() {
      if (currentPage > 0) currentPage--;
    });
  }

  void _startSession() {
    startRef.set(true);
    freqRef.set(frequency);
    durationRef.set(duration);
    painRef.set(painLevel);
    numbnessRef.set(numbnessLevel);
    tempRef.once().then((DatabaseEvent event) {
      final data = event.snapshot.value;
      tempBreforeRef.set(data);
    });

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: StatefulBuilder(
        builder: (context, setState) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (currentPage == 0)
                isLoading
                    ? const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                            SizedBox(
                              height: 150,
                            ),
                            CircularProgressIndicator(),
                          ])
                    : Flexible(
                        child: SingleChildScrollView(
                          child: Column(
                            children: [
                              const Text(
                                "Rate Your Symptoms:",
                                style: TextStyle(
                                    fontSize: 22, fontWeight: FontWeight.bold),
                              ),
                              Slider(
                                value: painLevel.toDouble(),
                                min: 0,
                                max: 10,
                                divisions: 10,
                                label: painLevel.toString(),
                                onChanged: (value) {
                                  setState(() {
                                    painLevel = value.toInt();
                                  });
                                },
                              ),
                              Text(
                                "Pain Level: $painLevel (0 = No pain, 10 = Worst pain imaginable)",
                                style: const TextStyle(fontSize: 16),
                              ),
                              Slider(
                                value: numbnessLevel.toDouble(),
                                min: 0,
                                max: 10,
                                divisions: 10,
                                label: numbnessLevel.toString(),
                                onChanged: (value) {
                                  setState(() {
                                    numbnessLevel = value.toInt();
                                  });
                                },
                              ),
                              Text(
                                  "Numbness Level: $numbnessLevel (0 = Normal sensation, 10 = Complete numbness)",
                                  style: const TextStyle(fontSize: 16)),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  ElevatedButton(
                                    onPressed: _nextPage,
                                    child: const Text("Next"),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      )
              else if (currentPage == 1)
                Flexible(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "AI Recommendation:",
                          style: TextStyle(
                              fontSize: 24, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(
                          height: 16,
                        ),
                        RichText(
                          text: TextSpan(
                            style: const TextStyle(
                                fontSize: 18, color: Colors.black),
                            children: [
                              const TextSpan(
                                text: 'Frequency: ',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(
                                text: '$frequency Hz',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 4),
                        RichText(
                          text: TextSpan(
                            style: const TextStyle(
                                fontSize: 18, color: Colors.black),
                            children: [
                              const TextSpan(
                                text: 'Duration: ',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(
                                text: '$duration min',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 4),
                        RichText(
                          text: TextSpan(
                            style: const TextStyle(
                                fontSize: 18, color: Colors.black),
                            children: [
                              const TextSpan(
                                text: 'Justification: ',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              TextSpan(
                                text: justification,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(
                          height: 32,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  tempFrequency = frequency;
                                  tempDuration = duration;
                                  currentPage = 2;
                                });
                              },
                              child: const Text("Modify"),
                            ),
                            ElevatedButton(
                              onPressed: _startSession,
                              child: const Text("Start Session"),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                )
              else if (currentPage == 2)
                Flexible(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        const Text(
                          "Modify Frequency and Duration (Max: 166 Hz, Max: 45 min)",
                          style: TextStyle(fontSize: 18),
                        ),
                        const SizedBox(height: 16),
                        const Text("Frequency (Hz)",
                            style: TextStyle(fontSize: 14)),
                        Slider(
                          value: tempFrequency,
                          min: 0,
                          max: 166,
                          divisions: 166,
                          label: tempFrequency.toStringAsFixed(0),
                          onChanged: (value) {
                            setState(() {
                              tempFrequency = value;
                            });
                          },
                        ),
                        Text("${tempFrequency.toStringAsFixed(0)} Hz",
                            style: const TextStyle(fontSize: 16)),
                        const SizedBox(height: 16),
                        const Text("Duration (min)",
                            style: TextStyle(fontSize: 14)),
                        Slider(
                          value: tempDuration,
                          min: 0,
                          max: 45,
                          divisions: 45,
                          label: tempDuration.toStringAsFixed(0),
                          onChanged: (value) {
                            setState(() {
                              tempDuration = value;
                            });
                          },
                        ),
                        Text("${tempDuration.toStringAsFixed(0)} min",
                            style: const TextStyle(fontSize: 16)),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            ElevatedButton(
                              onPressed: _previousPage,
                              child: const Text("Back"),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  frequency = tempFrequency;
                                  duration = tempDuration;
                                });
                                _startSession();
                              },
                              child: const Text("Start"),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                )
              else
                const Center(
                  child: Text("Unknown Page"),
                ),
            ],
          );
        },
      ),
    );
  }
}
