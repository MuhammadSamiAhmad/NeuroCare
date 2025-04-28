import type React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../../theme/colors";

interface TemperatureGraphProps {
  data: number[];
}

export const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data }) => {
  // If no data is provided, zero is used.
  const chartData = data.length > 0 ? data : [0];

  // Always limit to the last 10 readings
  const limitedData = chartData.slice(-10);

  // Calculate the starting reading number (if we have more than 10 readings)
  // This is the position of the first reading in our limited data within the full dataset
  const startingReadingNumber = Math.max(
    1,
    chartData.length - limitedData.length + 1
  );

  // Generate 10 evenly distributed labels for the x-axis
  const labelCount = 10;
  const labels = [];

  if (limitedData.length <= labelCount) {
    // If we have 10 or fewer readings, show all of them
    for (let i = 0; i < limitedData.length; i++) {
      labels.push((startingReadingNumber + i).toString());
    }
  } else {
    // If we have more than 10 readings, distribute them evenly
    const step = Math.ceil(limitedData.length / labelCount);

    for (let i = 0; i < labelCount; i++) {
      const dataIndex = Math.min(i * step, limitedData.length - 1);
      const readingNumber = startingReadingNumber + dataIndex;
      labels.push(readingNumber.toString());
    }
  }

  const chartConfig = {
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textLight,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: limitedData,
            },
          ],
        }}
        width={Dimensions.get("window").width - 64}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        yAxisLabel=""
        yAxisSuffix="°C"
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
