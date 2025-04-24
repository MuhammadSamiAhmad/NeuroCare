import 'package:flutter/material.dart';
import 'package:circu_flow/constants.dart';
import 'package:fl_chart/fl_chart.dart';

class Charts extends StatelessWidget {
  final List<Map<String, dynamic>> sessions;

  const Charts({super.key, required this.sessions});

  List<FlSpot> getSpots(String key) {
    return List.generate(
      sessions.length,
      (i) => FlSpot(i.toDouble(), (sessions[i][key] as num).toDouble()),
    );
  }

  List<String> getDates() {
    return sessions
        .map((s) => (s["date"] as String).split("/").take(2).join("/"))
        .toList();
  }

  Widget buildChart({
    required String title,
    required String key,
    required Color color,
    double? minY,
    double? maxY,
  }) {
    final spots = getSpots(key);
    final dates = getDates();

    // Dynamic Y bounds only for temperature chart
    double actualMinY = minY ??
        (key == "tempAfter"
            ? (spots.map((e) => e.y).reduce((a, b) => a < b ? a : b) - 1)
                .clamp(0, 100)
            : 0);
    double actualMaxY = maxY ??
        (key == "tempAfter"
            ? (spots.map((e) => e.y).reduce((a, b) => a > b ? a : b) + 1)
                .clamp(0, 100)
            : 10);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        SizedBox(
          height: 200,
          child: LineChart(
            LineChartData(
              minY: actualMinY,
              maxY: actualMaxY,
              titlesData: FlTitlesData(
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    interval: 1,
                    getTitlesWidget: (value, _) {
                      int index = value.toInt();
                      if (index < 0 || index >= dates.length) {
                        return const SizedBox.shrink();
                      }
                      return Text(dates[index],
                          style: const TextStyle(fontSize: 10));
                    },
                  ),
                ),
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    interval: 1,
                    getTitlesWidget: (value, _) {
                      return Text("${value.toInt()}",
                          style: const TextStyle(fontSize: 10));
                    },
                  ),
                ),
                topTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
                rightTitles: const AxisTitles(
                  sideTitles: SideTitles(showTitles: false),
                ),
              ),
              borderData: FlBorderData(
                show: true,
                border: const Border(
                  left: BorderSide(color: Colors.black, width: 1),
                  bottom: BorderSide(color: Colors.black, width: 1),
                  right: BorderSide(color: Colors.transparent),
                  top: BorderSide(color: Colors.transparent),
                ),
              ),
              gridData: const FlGridData(show: true),
              lineBarsData: [
                LineChartBarData(
                  spots: spots,
                  isCurved: true,
                  color: color,
                  barWidth: 3,
                  dotData: const FlDotData(show: true),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Charts",
          style: TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: const Icon(Icons.arrow_back, color: Colors.white),
        ),
        backgroundColor: textColor,
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            buildChart(
              title: "Numbness Level",
              key: "numbnessLevel",
              color: Colors.blue,
              minY: 0,
              maxY: 10,
            ),
            buildChart(
              title: "Pain Level",
              key: "painLevel",
              color: Colors.red,
              minY: 0,
              maxY: 10,
            ),
            buildChart(
              title: "Post-Session Temperature",
              key: "tempAfter",
              color: Colors.orange,
            ),
          ],
        ),
      ),
    );
  }
}
