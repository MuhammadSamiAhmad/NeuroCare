import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { colors } from "../../theme/colors"

interface TemperatureGraphProps {
  data: number[]
}

export const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data }) => {
  // If no data is provided, use mock data
  const chartData = data.length > 0 ? data : [36.5, 36.7, 37.0, 37.2, 37.1, 37.0, 36.9]

  // Generate labels based on data length
  const labels = chartData.map((_, index) => `${index + 1}m`)

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
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: chartData,
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
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
})
