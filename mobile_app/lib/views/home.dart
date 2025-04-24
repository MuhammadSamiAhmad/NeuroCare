import 'package:circu_flow/views/charts.dart';
import 'package:circu_flow/views/exercise.dart';
import 'package:circu_flow/views/sessions.dart';
import 'package:circu_flow/views/tips.dart';
import 'package:circu_flow/widgets/double_dots.dart';
import 'package:circu_flow/widgets/option_card.dart';
import 'package:circu_flow/widgets/recommendation_dialog.dart';
import 'package:circu_flow/widgets/time_card.dart';
import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import 'package:circu_flow/helper_functions.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  String? name = "Nada";
  String? age = "22";
  double? temp = 30.0;
  String? sessionTime = "";
  String? limb = "upper";
  Timer? _timer;
  Timer? _timer2;
  String? hour;
  String? minute;
  String? second;
  dynamic duration = 1;
  double tempBefore = 30;
  double aftreTemp = 30;
  dynamic frequency = 60;
  dynamic numbnessLevel = 0;
  dynamic painLevel = 0;
  bool _dialogShown = false;

  List<Map<String, dynamic>> sessions = [];
  final DatabaseReference nameRef = FirebaseDatabase.instance.ref('Name');
  final DatabaseReference ageRef = FirebaseDatabase.instance.ref('Age');
  final DatabaseReference limbRef =
      FirebaseDatabase.instance.ref('Extremities');
  final DatabaseReference tempRef = FirebaseDatabase.instance.ref('Temp');
  final DatabaseReference sessionTimeRef =
      FirebaseDatabase.instance.ref('sessionTime');
  final DatabaseReference sessionsRef =
      FirebaseDatabase.instance.ref('sessions');
  final DatabaseReference durationRef =
      FirebaseDatabase.instance.ref('duration');
  final DatabaseReference frequencyRef =
      FirebaseDatabase.instance.ref('frequency');
  final DatabaseReference tempBeforeRef =
      FirebaseDatabase.instance.ref('tempBrfore');
  final DatabaseReference numbnessLevelRef =
      FirebaseDatabase.instance.ref('numbnessLevel');
  final DatabaseReference painLevelRef =
      FirebaseDatabase.instance.ref('painLevel');
  final DatabaseReference startRef = FirebaseDatabase.instance.ref('start');
  @override
  void initState() {
    super.initState();

    // Set up listeners
    nameRef.onValue.listen((event) {
      final newName = event.snapshot.value.toString();
      setState(() {
        name = newName;
      });
    });

    tempRef.onValue.listen((event) {
      final newTemp = event.snapshot.value;
      setState(() {
        temp = double.tryParse(newTemp.toString());
      });
    });

    limbRef.onValue.listen((event) {
      final newLimb = event.snapshot.value.toString();
      setState(() {
        limb = newLimb;
      });
    });

    sessionTimeRef.onValue.listen((event) {
      final newSessionTime = event.snapshot.value.toString();
      setState(() {
        sessionTime = newSessionTime;
      });
    });

    sessionsRef.onValue.listen((DatabaseEvent event) {
      final data = event.snapshot.value;

      if (data != null && data is Map) {
        final List<Map<String, dynamic>> loadedSessions = [];

        data.forEach((key, value) {
          if (value is Map) {
            loadedSessions.add(Map<String, dynamic>.from(value));
          }
        });
        final DateFormat formatter = DateFormat('dd/MM/yyyy');

        loadedSessions.sort((a, b) {
          final dateA = formatter.parse(a['date']);
          final dateB = formatter.parse(b['date']);
          return dateA.compareTo(dateB);
        });

        setState(() {
          sessions = loadedSessions;
        });
      }
    });

    ageRef.onValue.listen((event) {
      final newAge = event.snapshot.value.toString();
      setState(() {
        age = newAge;
      });
    });

    _timer = Timer.periodic(
      const Duration(seconds: 1),
      (_) async {
        Duration remaining = getRemainingTime(sessionTime);
        if (remaining <= const Duration(minutes: 1) && !_dialogShown) {
          _dialogShown = true;

          await showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: SizedBox(
                height: 350,
                child: RecommendationDialog(
                  age: age!,
                  limb: limb!,
                  temp: temp!,
                ),
              ),
            ),
          );
          durationRef.once().then((DatabaseEvent event) {
            duration = event.snapshot.value;
          });
          numbnessLevelRef.once().then((DatabaseEvent event) {
            numbnessLevel = event.snapshot.value;
          });
          painLevelRef.once().then((DatabaseEvent event) {
            painLevel = event.snapshot.value;
          });
          frequencyRef.once().then((DatabaseEvent event) {
            frequency = event.snapshot.value;
          });
          tempBeforeRef.once().then((DatabaseEvent event) {
            tempBefore = double.tryParse(event.snapshot.value.toString())!;
          });
          _timer2 = Timer(Duration(minutes: duration), () {
            startRef.set(false);
            String formattedDate =
                "${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}";
            final Map<String, dynamic> session = {
              "date": formattedDate,
              "tempBefore": tempBefore,
              "painLevel": painLevel,
              "numbnessLevel": numbnessLevel,
              "frequency": frequency,
              "duration": duration,
              "tempAfter": temp!,
            };
            sessionsRef.push().set(session);
          });
        } else if (remaining > const Duration(minutes: 1)) {
          _dialogShown = false;
        }
        if (!_dialogShown) {
          setState(() {
            hour = getTimeUnitValue(remaining, "hour");
            minute = getTimeUnitValue(remaining, "minute");
            second = getTimeUnitValue(remaining, "second");
          });
        }
      },
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _timer2?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            children: [
              const SizedBox(
                height: 150,
              ),
              Text(
                "Hi $name, your next session in:",
                style: TextStyle(
                    color: textColor,
                    fontSize: 26,
                    fontWeight: FontWeight.bold),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TimeCard(time: hour ?? "00", timeUnit: "hour"),
                    const DoubleDots(),
                    TimeCard(time: minute ?? "00", timeUnit: 'minute'),
                    const DoubleDots(),
                    TimeCard(time: second ?? "00", timeUnit: 'second')
                  ],
                ),
              ),
              Text(
                "Current Limb Temperature: $temp ℃",
                style: TextStyle(
                    color: textColor,
                    fontWeight: FontWeight.w300,
                    fontSize: 18),
              ),
              const SizedBox(
                height: 60,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  OptionCard(
                    title: "Previous Sessions",
                    backgroundColor: option1Color,
                    icon: Icons.history,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Sessions(
                                  sessions: sessions,
                                )),
                      );
                    },
                  ),
                  OptionCard(
                    title: "Charts",
                    backgroundColor: option2Color,
                    icon: Icons.bar_chart,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Charts(
                                  sessions: sessions,
                                )),
                      );
                    },
                  ),
                ],
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  OptionCard(
                    title: "Exercise",
                    backgroundColor: option3Color,
                    icon: Icons.fitness_center,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Exercise(
                                  limb: limb!,
                                )),
                      );
                    },
                  ),
                  OptionCard(
                    title: "Tip of the Day",
                    backgroundColor: option4Color,
                    icon: Icons.tips_and_updates,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Tips(
                                  limb: limb!,
                                )),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
