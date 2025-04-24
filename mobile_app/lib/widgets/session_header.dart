import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';

class SessionHeader extends StatefulWidget {
  final VoidCallback onTap;
  final String date;
  const SessionHeader({super.key, required this.date, required this.onTap});

  @override
  State<SessionHeader> createState() => _SessionHeaderState();
}

class _SessionHeaderState extends State<SessionHeader> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: GestureDetector(
        onTap: widget.onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Session Date: ${widget.date}",
              style: TextStyle(color: textColor, fontSize: 18),
            ),
            Divider(
              color: textColor,
              thickness: 2,
            )
          ],
        ),
      ),
    );
  }
}
