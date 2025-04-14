import type React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { colors } from "../../theme/colors"

interface MonthlyData {
  day: number
  bloodFlow: number
  painReduction: number
  sessionDuration: number
}

interface MonthlyProgressChartProps {
  data: MonthlyData[]
}

export const MonthlyProgressChart: React.FC<MonthlyProgressChartProps> = ({ data }) => {
  // Extract data for the chart
  const days = data.map((item) => item.day.toString())
  const bloodFlowData = data.map((item) => item.bloodFlow)
  const painReductionData = data.map((item) => item.painReduction)

  // Filter days to show only every 5th day to avoid crowding
  const filteredDays = days.filter((_, index) => index % 5 === 0)

  const chartConfig = {
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => colors.textLight,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
    },
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: filteredDays,
          datasets: [
            {
              data: bloodFlowData,
              color: (opacity = 1) => colors.chart1,
              strokeWidth: 2,
            },
            {
              data: painReductionData,
              color: (opacity = 1) => colors.chart2,
              strokeWidth: 2,
            },
          ],
          legend: ["Blood Flow", "Pain Reduction"],
        }}
        width={Dimensions.get("window").width - 64}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withShadow={false}
        withDots={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        yAxisSuffix="%"
        yAxisInterval={1}
        segments={5}
        fromZero
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
