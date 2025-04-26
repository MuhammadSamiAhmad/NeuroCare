"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { colors } from "../theme/colors";
import { Card } from "../components/ui/card";
import { ProgressChart } from "../components/charts/progress-chart";
import { SessionHistoryItem } from "../components/session-history-item";
import type { NavigationProp } from "../types/navigation";
import type { SessionData, ProgressData } from "../types/session";

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp<"Dashboard">>();
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressData>({
    bloodFlow: 0,
    painReduction: 0,
    sessionDuration: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecentSessions = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      const db = getFirestore();
      const sessionsRef = collection(db, "sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const sessions: SessionData[] = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as SessionData);
      });

      setRecentSessions(sessions);
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        // Fallback to default values if no user
        setWeeklyProgress({
          bloodFlow: 0,
          painReduction: 0,
          sessionDuration: 0,
        });
        return;
      }

      const db = getFirestore();
      const sessionsRef = collection(db, "sessions");
      // Filter sessions from the last 7 days
      const oneWeekAgo = Timestamp.fromMillis(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      );
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        where("timestamp", ">=", oneWeekAgo),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const weeklySessions: SessionData[] = [];
      querySnapshot.forEach((doc) => {
        weeklySessions.push({ id: doc.id, ...doc.data() } as SessionData);
      });

      // Calculate progress metrics based on session data
      if (weeklySessions.length > 0) {
        const totalDuration = weeklySessions.reduce(
          (sum, session) => sum + session.duration,
          0
        );
        const avgVibrationIntensity =
          weeklySessions.reduce(
            (sum, session) => sum + session.vibrationIntensity,
            0
          ) / weeklySessions.length;
        // Mock calculations for bloodFlow and painReduction since these aren't directly in data
        // In a real app, these could be based on user feedback or sensor data
        const bloodFlow = Math.min(
          100,
          Math.round(avgVibrationIntensity * 0.8)
        ); // Example: higher intensity = better blood flow
        const painReduction = Math.min(
          100,
          Math.round(weeklySessions.length * 10)
        ); // Example: more sessions = more pain reduction

        setWeeklyProgress({
          bloodFlow,
          painReduction,
          sessionDuration: Math.min(100, Math.round(totalDuration / 60)), // Cap at 100 for display purposes (assuming max 60 minutes as 100%)
        });
      } else {
        setWeeklyProgress({
          bloodFlow: 0,
          painReduction: 0,
          sessionDuration: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      setWeeklyProgress({
        bloodFlow: 0,
        painReduction: 0,
        sessionDuration: 0,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRecentSessions(), fetchWeeklyProgress()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRecentSessions();
    fetchWeeklyProgress();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.startSessionCard}>
          <Text style={styles.cardTitle}>Ready for your therapy?</Text>
          <Text style={styles.cardDescription}>
            Start a new session to manage your neuropathy symptoms
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate("SessionControl")}
          >
            <Text style={styles.startButtonText}>Start Session</Text>
            <Ionicons name="play-circle" size={24} color="white" />
          </TouchableOpacity>
        </Card>
        <Card style={styles.startSessionCard}>
          <Text style={styles.cardTitle}>Explore More Resources</Text>
          <Text style={styles.cardDescription}>
            Get personalized recommendations to improve your therapy experience
            or explore simple exercises to enhance blood circulation and manage
            neuropathy symptoms effectively.
          </Text>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate("Recommendations")}
          >
            <Text style={styles.navigationButtonText}>AI Recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => navigation.navigate("ExerciseVideos")}
          >
            <Text style={styles.navigationButtonText}>Exercise Videos</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <Card style={styles.progressCard}>
            <ProgressChart data={weeklyProgress} />
            <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: colors.chart1 },
                  ]}
                />
                <Text style={styles.legendText}>Blood Flow</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: colors.chart2 },
                  ]}
                />
                <Text style={styles.legendText}>Pain Reduction</Text>
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
        </View>

        <View style={styles.recentSessionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProgressTracking")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <SessionHistoryItem key={session.id} session={session} />
            ))
          ) : (
            <Card style={styles.emptySessionsCard}>
              <Text style={styles.emptySessionsText}>
                No recent sessions found. Start your first therapy session!
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  startSessionCard: {
    padding: 16,
    marginVertical: 16,
    backgroundColor: colors.cardBackground,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
  progressSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  progressCard: {
    padding: 16,
    backgroundColor: colors.cardBackground,
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
  recentSessionsSection: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: "600",
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
  navigationButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  navigationButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
