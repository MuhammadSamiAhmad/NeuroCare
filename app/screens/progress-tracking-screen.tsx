"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"

import { colors } from "../theme/colors"
import { Card } from "../components/ui/card"
import { ProgressChart } from "../components/charts/progress-chart"
import { SessionHistoryItem } from "../components/session-history-item"
import { MonthlyProgressChart } from "../components/charts/monthly-progress-chart"
import type { NavigationProp } from "../types/navigation"
import type { SessionData, MonthlyData, ProgressData } from "../types/session"

export default function ProgressTrackingScreen() {
  const navigation = useNavigation<NavigationProp<"ProgressTracking">>()
  const [activeTab, setActiveTab] = useState("weekly")
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState<ProgressData>({
    bloodFlow: 0,
    painReduction: 0,
    sessionDuration: 0,
  })
  const [monthlyProgress, setMonthlyProgress] = useState<MonthlyData[]>([])

  const fetchSessions = async () => {
    try {
      const auth = getAuth()
      const userId = auth.currentUser?.uid

      if (!userId) return

      const db = getFirestore()
      const sessionsRef = collection(db, "sessions")
      const q = query(sessionsRef, where("userId", "==", userId), orderBy("timestamp", "desc"))

      const querySnapshot = await getDocs(q)
      const sessionData: SessionData[] = []
      querySnapshot.forEach((doc) => {
        sessionData.push({ id: doc.id, ...doc.data() } as SessionData)
      })

      setSessions(sessionData)

      // Calculate progress metrics based on session data
      calculateProgressMetrics(sessionData)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const calculateProgressMetrics = (sessionData: SessionData[]) => {
    // In a real app, this would calculate progress based on actual session data
    // For now, we'll use mock data

    // Weekly progress
    setWeeklyProgress({
      bloodFlow: 65,
      painReduction: 72,
      sessionDuration: 85,
    })

    // Monthly progress (mock data for 30 days)
    const mockMonthlyData: MonthlyData[] = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      bloodFlow: Math.floor(Math.random() * 30) + 50,
      painReduction: Math.floor(Math.random() * 30) + 50,
      sessionDuration: Math.floor(Math.random() * 30) + 50,
    }))

    setMonthlyProgress(mockMonthlyData)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

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
          <Text style={[styles.tabText, activeTab === "weekly" && styles.activeTabText]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "monthly" && styles.activeTab]}
          onPress={() => setActiveTab("monthly")}
        >
          <Text style={[styles.tabText, activeTab === "monthly" && styles.activeTabText]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
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
                  <View style={[styles.legendColor, { backgroundColor: colors.chart1 }]} />
                  <Text style={styles.legendText}>Blood Flow</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.chart2 }]} />
                  <Text style={styles.legendText}>Pain Reduction</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.chart3 }]} />
                  <Text style={styles.legendText}>Session Duration</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>Weekly Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sessions.length}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>120 min</Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>72%</Text>
                  <Text style={styles.statLabel}>Pain Reduction</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.tipsCard}>
              <Text style={styles.cardTitle}>Recommendations</Text>
              <Text style={styles.tipText}>• Maintain consistent daily sessions for optimal results</Text>
              <Text style={styles.tipText}>• Gradually increase vibration intensity as comfort allows</Text>
              <Text style={styles.tipText}>• Stay hydrated before and after therapy sessions</Text>
            </Card>
          </View>
        )}

        {activeTab === "monthly" && (
          <View style={styles.tabContent}>
            <Card style={styles.progressCard}>
              <Text style={styles.cardTitle}>Monthly Progress</Text>
              <MonthlyProgressChart data={monthlyProgress} />
              <View style={styles.progressLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.chart1 }]} />
                  <Text style={styles.legendText}>Blood Flow</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.chart2 }]} />
                  <Text style={styles.legendText}>Pain Reduction</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.statsCard}>
              <Text style={styles.cardTitle}>Monthly Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{sessions.length}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>480 min</Text>
                  <Text style={styles.statLabel}>Total Time</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>65%</Text>
                  <Text style={styles.statLabel}>Improvement</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {activeTab === "history" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Session History</Text>

            {sessions.length > 0 ? (
              sessions.map((session) => <SessionHistoryItem key={session.id} session={session} detailed />)
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
  )
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
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
})
