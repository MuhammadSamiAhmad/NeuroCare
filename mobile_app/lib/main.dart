import 'package:circu_flow/views/home.dart';
import 'package:circu_flow/views/set_up.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
    const CircuFlow(),
  );
}

class CircuFlow extends StatelessWidget {
  const CircuFlow({super.key});
  static const bool setUpFlag = true;

  @override
  Widget build(BuildContext context) {
    if (setUpFlag == true) {
      return const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: Home(),
      );
    } else {
      return const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: SetUp(),
      );
    }
  }
}
