import 'package:flutter/material.dart';

class OptionCard extends StatefulWidget {
  final String title;
  final Color backgroundColor;
  final IconData icon;
  final VoidCallback onTap;
  const OptionCard(
      {super.key,
      required this.title,
      required this.backgroundColor,
      required this.icon,
      required this.onTap});

  @override
  State<OptionCard> createState() => _OptionCardState();
}

class _OptionCardState extends State<OptionCard> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: GestureDetector(
        onTap: widget.onTap,
        child: Container(
          width: 150,
          height: 170,
          decoration: BoxDecoration(
            color: widget.backgroundColor,
            borderRadius: BorderRadius.circular(16),
          ),
          alignment: Alignment.center,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                widget.icon,
                color: Colors.white,
              ),
              const SizedBox(
                height: 2,
              ),
              Text(
                widget.title,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white, fontSize: 18),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
