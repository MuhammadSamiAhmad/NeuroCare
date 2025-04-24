import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';

class DoubleDots extends StatefulWidget {
  const DoubleDots({super.key});

  @override
  State<DoubleDots> createState() => _DoubleDotsState();
}

class _DoubleDotsState extends State<DoubleDots> {
  final now = DateTime.now();
  @override
  Widget build(BuildContext context) {
    return Text(
      ":",
      style: TextStyle(
          color: textColor, fontSize: 24, fontWeight: FontWeight.bold),
    );
  }
}
