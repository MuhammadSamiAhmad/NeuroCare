import 'package:circu_flow/widgets/sesssion_detail.dart';
import 'package:circu_flow/widgets/session_header.dart';
import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';

class Sessions extends StatelessWidget {
  final List sessions;
  const Sessions({super.key, required this.sessions});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Previous Sessions",
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
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            const SizedBox(
              height: 8,
            ),
            ...sessions.map((session) {
              return SessionHeader(
                date: session["date"] as String,
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (context) => Dialog(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        child: SesssionDetail(detail: session)),
                  );
                },
              );
            }),
          ],
        ),
      ),
    );
  }
}
