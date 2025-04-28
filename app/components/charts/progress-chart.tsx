import type React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors } from "../../theme/colors";

interface ProgressData {
  heartRate: number;
  sessionDuration: number;
}

interface ProgressChartProps {
  data: ProgressData;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartData = {
    labels: ["Heart Rate", "Session Duration"],
    datasets: [
      {
        data: [data.heartRate, data.sessionDuration],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => colors.text,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 64}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix="%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
