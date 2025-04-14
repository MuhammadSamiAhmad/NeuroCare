"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"

import { colors } from "../theme/colors"
import { Card } from "../components/ui/card"
import { ProgressChart } from "../components/charts/progress-chart"
import { SessionHistoryItem } from "../components/session-history-item"
import { DeviceStatusCard } from "../components/device-status-card"
import { useDeviceStore } from "../stores/device-store"
import type { NavigationProp } from "../types/navigation"
import type { SessionData } from "../types/session"

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp<"Dashboard">>()
  const { deviceConnected, deviceBattery } = useDeviceStore()
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState({
    bloodFlow: 0,
    painReduction: 0,
    sessionDuration: 0,
  })
  const [refreshing, setRefreshing] = useState(false)

  const fetchRecentSessions = async () => {
    try {
      const auth = getAuth()
      const userId = auth.currentUser?.uid

      if (!userId) return

      const db = getFirestore()
      const sessionsRef = collection(db, "sessions")
      const q = query(sessionsRef, where("userId", "==", userId), orderBy("timestamp", "desc"), limit(5))

      const querySnapshot = await getDocs(q)
      const sessions: SessionData[] = []
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as SessionData)
      })

      setRecentSessions(sessions)
    } catch (error) {
      console.error("Error fetching recent sessions:", error)
    }
  }

  const fetchWeeklyProgress = async () => {
    // In a real app, this would calculate progress based on session data
    // For now, we'll use mock data
    setWeeklyProgress({
      bloodFlow: 65,
      painReduction: 72,
      sessionDuration: 85,
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchRecentSessions(), fetchWeeklyProgress()])
    setRefreshing(false)
  }

  useEffect(() => {
    fetchRecentSessions()
    fetchWeeklyProgress()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <DeviceStatusCard connected={deviceConnected} batteryLevel={deviceBattery} />

        <Card style={styles.startSessionCard}>
          <Text style={styles.cardTitle}>Ready for your therapy?</Text>
          <Text style={styles.cardDescription}>Start a new session to manage your neuropathy symptoms</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("SessionControl")}>
            <Text style={styles.startButtonText}>Start Session</Text>
            <Ionicons name="play-circle" size={24} color="white" />
          </TouchableOpacity>
        </Card>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <Card style={styles.progressCard}>
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
        </View>

        <View style={styles.recentSessionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProgressTracking")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentSessions.length > 0 ? (
            recentSessions.map((session) => <SessionHistoryItem key={session.id} session={session} />)
          ) : (
            <Card style={styles.emptySessionsCard}>
              <Text style={styles.emptySessionsText}>No recent sessions found. Start your first therapy session!</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
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
})
