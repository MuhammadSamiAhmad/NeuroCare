import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class ExerciseDetail extends StatefulWidget {
  final Map<String, dynamic> exercise;
  const ExerciseDetail({super.key, required this.exercise});

  @override
  State<ExerciseDetail> createState() => _ExerciseDetailState();
}

class _ExerciseDetailState extends State<ExerciseDetail> {
  late YoutubePlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = YoutubePlayerController(
      initialVideoId: widget.exercise['video'],
      flags: const YoutubePlayerFlags(
        autoPlay: false,
        mute: false,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return YoutubePlayerBuilder(
      player: YoutubePlayer(controller: _controller),
      builder: (context, player) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.exercise['description'],
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text("Duration: ${widget.exercise['duration']}",
                style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 20),
            player,
          ],
        );
      },
    );
  }
}

// import 'package:flutter/material.dart';

// class ExerciseDetail extends StatefulWidget {
//   final Map<String, dynamic> exercise;
//   const ExerciseDetail({super.key, required this.exercise});

//   @override
//   State<ExerciseDetail> createState() => _ExerciseDetailState();
// }

// class _ExerciseDetailState extends State<ExerciseDetail> {
//   @override
//   Widget build(BuildContext context) {
//     return Text("jj");
//   }
// }
