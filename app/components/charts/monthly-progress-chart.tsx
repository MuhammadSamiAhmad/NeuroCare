// import type React from "react";
// import { View, StyleSheet, Dimensions, Text } from "react-native";
// import { LineChart } from "react-native-chart-kit";
// import { colors } from "../../theme/colors";

// interface MonthlyData {
//   day: number;
//   heartRate: number;
//   sessionDuration: number;
// }

// interface MonthlyProgressChartProps {
//   data: MonthlyData[];
// }

// export const MonthlyProgressChart: React.FC<MonthlyProgressChartProps> = ({
//   data,
// }) => {
//   // Validate data to prevent errors
//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return (
//       <View style={[styles.container, styles.emptyContainer]}>
//         <Text style={styles.emptyText}>No monthly data available</Text>
//       </View>
//     );
//   }

//   try {
//     // Extract data for the chart
//     const days = data.map((item) => (item.day || 0).toString());
//     const heartRateData = data.map((item) => item.heartRate || 0);

//     // Determine how many days to skip based on data length
//     const skipFactor = data.length > 15 ? 5 : data.length > 10 ? 3 : 2;

//     // Filter days to show only every nth day to avoid crowding
//     const filteredLabels = days.filter(
//       (_, index) => index % skipFactor === 0 || index === days.length - 1
//     );

//     // Calculate min and max values for better Y-axis scaling
//     const minValue = Math.max(0, Math.min(...heartRateData) - 10);
//     const maxValue = Math.max(...heartRateData) + 10;

//     const chartConfig = {
//       backgroundGradientFrom: colors.cardBackground,
//       backgroundGradientTo: colors.cardBackground,
//       decimalPlaces: 0,
//       color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
//       labelColor: (opacity = 1) => colors.textLight,
//       style: {
//         borderRadius: 16,
//       },
//       propsForDots: {
//         r: "3",
//         strokeWidth: "1",
//       },
//       propsForBackgroundLines: {
//         strokeDasharray: "",
//       },
//     };

//     return (
//       <View style={styles.container}>
//         <LineChart
//           data={{
//             labels: filteredLabels,
//             datasets: [
//               {
//                 data: heartRateData,
//                 color: (opacity = 1) => colors.chart1,
//                 strokeWidth: 2,
//               },
//             ],
//             legend: ["Heart Rate"],
//           }}
//           width={Dimensions.get("window").width - 64}
//           height={220}
//           chartConfig={chartConfig}
//           bezier
//           style={styles.chart}
//           withInnerLines={false}
//           withOuterLines={true}
//           withShadow={false}
//           withDots={true}
//           withVerticalLines={false}
//           withHorizontalLines={true}
//           yAxisSuffix=" bpm"
//           yAxisInterval={1}
//           segments={5}
//           fromZero={minValue === 0}
//         />
//       </View>
//     );
//   } catch (error) {
//     console.error("Error rendering monthly progress chart:", error);
//     return (
//       <View style={[styles.container, styles.emptyContainer]}>
//         <Text style={styles.emptyText}>Error displaying chart data</Text>
//       </View>
//     );
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     width: "100%",
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 8,
//   },
//   emptyContainer: {
//     height: 220,
//     justifyContent: "center",
//     backgroundColor: colors.cardBackground,
//     borderRadius: 8,
//     width: Dimensions.get("window").width - 64,
//   },
//   emptyText: {
//     color: colors.textLight,
//     textAlign: "center",
//   },
// });
