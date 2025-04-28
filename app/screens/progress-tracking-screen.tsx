"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  writeBatch,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { colors } from "../theme/colors";
import { Card } from "../components/ui/card";
import { ProgressChart } from "../components/charts/progress-chart";
import { SessionHistoryItem } from "../components/session-history-item";
// Comment out MonthlyProgressChart import
// import { MonthlyProgressChart } from "../components/charts/monthly-progress-chart";
import type { NavigationProp } from "../types/navigation";
// Update the import to remove MonthlyData
import type { SessionData, ProgressData } from "../types/session";
import { useAiRecommendations } from "../hooks/use-ai-recommendations";

export default function ProgressTrackingScreen() {
  const navigation = useNavigation<NavigationProp<"ProgressTracking">>();
  const [activeTab, setActiveTab] = useState("weekly");
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressData>({
    heartRate: 0,
    sessionDuration: 0,
  });
  // Comment out monthly progress state
  // const [monthlyProgress, setMonthlyProgress] = useState<MonthlyData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    averageHeartRate: 0,
  });
  // Comment out monthly stats state
  // const [monthlyStats, setMonthlyStats] = useState({
  //   totalSessions: 0,
  //   totalTime: 0,
  //   improvement: 0,
  // });

  const { recommendations, sources, loading, fetchRecommendations } =
    useAiRecommendations();

  const fetchSessions = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      const db = getFirestore();
      const sessionsRef = collection(db, "sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const sessionData: SessionData[] = [];
      querySnapshot.forEach((doc) => {
        sessionData.push({ id: doc.id, ...doc.data() } as SessionData);
      });

      setSessions(sessionData);

      // Calculate progress metrics based on session data
      calculateProgressMetrics(sessionData);

      // Fetch AI recommendations
      fetchRecommendations(sessionData);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const calculateProgressMetrics = (sessionData: SessionData[]) => {
    if (!sessionData.length) {
      setWeeklyProgress({ heartRate: 0, sessionDuration: 0 });
      // Comment out monthly progress reset
      // setMonthlyProgress([]);
      setWeeklyStats({ totalSessions: 0, totalTime: 0, averageHeartRate: 0 });
      // Comment out monthly stats reset
      // setMonthlyStats({ totalSessions: 0, totalTime: 0, improvement: 0 });
      return;
    }

    // Weekly progress (last 7 days)
    const oneWeekAgo = Timestamp.fromMillis(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    const weeklySessions = sessionData.filter((session) => {
      const sessionDate = new Date(session.timestamp.seconds * 1000);
      return sessionDate >= oneWeekAgo.toDate();
    });

    if (weeklySessions.length > 0) {
      const totalDuration = weeklySessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );

      // Calculate average heart rate from sessions that have it
      const sessionsWithHeartRate = weeklySessions.filter(
        (session) => session.averageHeartRate
      );
      const avgHeartRate =
        sessionsWithHeartRate.length > 0
          ? Math.round(
              sessionsWithHeartRate.reduce(
                (sum, session) => sum + (session.averageHeartRate || 0),
                0
              ) / sessionsWithHeartRate.length
            )
          : 0;

      setWeeklyProgress({
        heartRate: avgHeartRate,
        sessionDuration: Math.min(100, Math.round(totalDuration / 60)),
      });

      setWeeklyStats({
        totalSessions: weeklySessions.length,
        totalTime: Math.round(totalDuration / 60), // Convert seconds to minutes
        averageHeartRate: avgHeartRate,
      });
    } else {
      setWeeklyProgress({ heartRate: 0, sessionDuration: 0 });
      setWeeklyStats({ totalSessions: 0, totalTime: 0, averageHeartRate: 0 });
    }

    // Comment out all monthly progress calculation code
    /*
    // Monthly progress (last 30 days)
    const oneMonthAgo = Timestamp.fromMillis(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    );
    const monthlySessions = sessionData.filter((session) => {
      const sessionDate = new Date(session.timestamp.seconds * 1000);
      return sessionDate >= oneMonthAgo.toDate();
    });

    if (monthlySessions.length > 0) {
      const totalDuration = monthlySessions.reduce(
        (sum, session) => sum + session.duration,
        0
      );
      
      // Calculate average heart rate
      const sessionsWithHeartRate = monthlySessions.filter(session => session.averageHeartRate);
      const avgHeartRate = sessionsWithHeartRate.length > 0 
        ? Math.round(sessionsWithHeartRate.reduce((sum, session) => sum + (session.averageHeartRate || 0), 0) / sessionsWithHeartRate.length)
        : 0;
      
      const improvement = Math.min(100, Math.round(avgHeartRate * 0.65)); // Example calculation

      setMonthlyStats({
        totalSessions: monthlySessions.length,
        totalTime: Math.round(totalDuration / 60), // Convert seconds to minutes
        improvement,
      });

      // Group sessions by day for the last 30 days
      const monthlyData: MonthlyData[] = [];
      const now = new Date();
      for (let i = 0; i < 30; i++) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const dayStart =
          new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime() /
          1000;
        const dayEnd =
          new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate() + 1
          ).getTime() / 1000;

        const daySessions = monthlySessions.filter((session) => {
          const sessionTime = session.timestamp.seconds;
          return sessionTime >= dayStart && sessionTime < dayEnd;
        });

        // Calculate heart rate for the day
        const daySessionsWithHeartRate = daySessions.filter(session => session.averageHeartRate);
        const dayHeartRate = daySessionsWithHeartRate.length > 0
          ? Math.round(daySessionsWithHeartRate.reduce((sum, s) => sum + (s.averageHeartRate || 0), 0) / daySessionsWithHeartRate.length)
          : 0;
          
        const daySessionDuration = daySessions.length
          ? Math.min(
              100,
              Math.round(
                daySessions.reduce((sum, s) => sum + s.duration, 0) / 60
              )
            )
          : 0;

        monthlyData.unshift({
          day: i + 1,
          heartRate: dayHeartRate,
          sessionDuration: daySessionDuration,
        });
      }

      setMonthlyProgress(monthlyData);
    } else {
      setMonthlyProgress([]);
      setMonthlyStats({ totalSessions: 0, totalTime: 0, improvement: 0 });
    }
    */
  };

  const handleDeleteAllSessions = () => {
    Alert.alert(
      "Delete All Sessions",
      "Are you sure you want to delete all your session history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const auth = getAuth();
              const userId = auth.currentUser?.uid;

              if (!userId) return;

              const db = getFirestore();
              const sessionsRef = collection(db, "sessions");
              const q = query(sessionsRef, where("userId", "==", userId));

              const querySnapshot = await getDocs(q);

              const batch = writeBatch(db);
              querySnapshot.forEach((document) => {
                batch.delete(doc(db, "sessions", document.id));
              });

              await batch.commit();

              // Refresh the sessions list
              setSessions([]);
              setWeeklyProgress({ heartRate: 0, sessionDuration: 0 });
              // Comment out monthly progress reset
              // setMonthlyProgress([]);
              setWeeklyStats({
                totalSessions: 0,
                totalTime: 0,
                averageHeartRate: 0,
              });
              // Comment out monthly stats reset
              // setMonthlyStats({ totalSessions: 0, totalTime: 0, improvement: 0 });

              Alert.alert("Success", "All sessions have been deleted");
            } catch (error) {
              console.error("Error deleting sessions:", error);
              Alert.alert("Error", "Failed to delete sessions");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Progress Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "weekly" && styles.activeTab]}
          onPress={() => setActiveTab("weekly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "weekly" && styles.activeTabText,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        {/* Comment out monthly tab
        <TouchableOpacity
          style={[styles.tab, activeTab === "monthly" && styles.activeTab]}
          onPress={() => setActiveTab("monthly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "monthly" && styles.activeTabText,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
        */}
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "weekly" && (
          <View style={styles.tabContent}>
            <Card style={styles.progressCard}>
              <Text style={styles.cardTitle}>Weekly Progress</Text>
              <ProgressChart data={weeklyProgress} />
              <View style={styles.progressLegend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: colors.chart1 },
                    ]}
                  />
                  <Text style={styles.legendText}>Heart Rate</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: colors.chart3 },
                    ]}
                  />
                  <Text style={styles.legendText}>Session Duration</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>Weekly Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {weeklyStats.totalSessions}
                  </Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {weeklyStats.totalTime} min
                  </Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {weeklyStats.averageHeartRate} bpm
                  </Text>
                  <Text style={styles.statLabel}>Avg Heart Rate</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.tipsCard}>
              <View style={styles.recommendationHeader}>
                <Text style={styles.cardTitle}>Recommendations</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Recommendations")}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>
                    Generating recommendations...
                  </Text>
                </View>
              ) : recommendations.length > 0 ? (
                <View style={styles.recommendationContainer}>
                  <View style={styles.recommendationRow}>
                    <View style={styles.recommendationItem}>
                      <View style={styles.recommendationIconContainer}>
                        <Ionicons
                          name="pulse"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.recommendationLabel}>Frequency</Text>
                      <Text style={styles.recommendationValue}>
                        {recommendations[0].frequency} Hz
                      </Text>
                    </View>

                    <View style={styles.recommendationItem}>
                      <View style={styles.recommendationIconContainer}>
                        <Ionicons
                          name="time"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.recommendationLabel}>Duration</Text>
                      <Text style={styles.recommendationValue}>
                        {recommendations[0].duration} min
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.justificationText}>
                    {recommendations[0].justification}
                  </Text>
                </View>
              ) : (
                <Text style={styles.emptyRecommendationText}>
                  No recommendations available. Complete more therapy sessions
                  to receive personalized recommendations.
                </Text>
              )}
            </Card>
          </View>
        )}

        {/* Comment out monthly tab content
        {activeTab === "monthly" && (
          <View style={styles.tabContent}>
            <Card style={styles.progressCard}>
              <Text style={styles.cardTitle}>Monthly Progress</Text>
              <MonthlyProgressChart data={monthlyProgress} />
              <View style={styles.progressLegend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: colors.chart1 },
                    ]}
                  />
                  <Text style={styles.legendText}>Heart Rate</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>Monthly Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {monthlyStats.totalSessions}
                  </Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {monthlyStats.totalTime} min
                  </Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {monthlyStats.improvement}%
                  </Text>
                  <Text style={styles.statLabel}>Improvement</Text>
                </View>
              </View>
            </Card>
          </View>
        )}
        */}

        {activeTab === "history" && (
          <View style={styles.tabContent}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Session History</Text>
              {sessions.length > 0 && (
                <TouchableOpacity
                  onPress={handleDeleteAllSessions}
                  style={styles.deleteAllButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={colors.error}
                  />
                  <Text style={styles.deleteAllText}>Delete All</Text>
                </TouchableOpacity>
              )}
            </View>

            {sessions.length > 0 ? (
              sessions.map((session) => (
                <SessionHistoryItem
                  key={session.id}
                  session={session}
                  detailed
                  onDelete={fetchSessions}
                />
              ))
            ) : (
              <Card style={styles.emptySessionsCard}>
                <Text style={styles.emptySessionsText}>
                  No session history found. Start your first therapy session!
                </Text>
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600",
  },
  tabContent: {
    padding: 16,
  },
  progressCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  progressLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textLight,
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  tipsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  deleteAllButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  deleteAllText: {
    fontSize: 14,
    color: colors.error,
    marginLeft: 4,
    fontWeight: "500",
  },
  emptySessionsCard: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
  },
  emptySessionsText: {
    color: colors.textLight,
    textAlign: "center",
  },
  viewSourcesButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  viewSourcesText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  tipSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  recommendationItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  sessionMiniTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
  },
  recommendationMiniDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailMiniText: {
    fontSize: 14,
    color: colors.text,
  },
  justificationMini: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: "italic",
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textLight,
  },
  recommendationContainer: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    padding: 12,
  },
  recommendationRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  recommendationLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  justificationText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  emptyRecommendationText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    padding: 12,
  },
});
