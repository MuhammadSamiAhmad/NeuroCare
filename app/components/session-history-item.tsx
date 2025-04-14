import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"

import { Card } from "./ui/card"
import { colors } from "../theme/colors"
import type { SessionData } from "../types/session"

interface SessionHistoryItemProps {
  session: SessionData
  detailed?: boolean
  onPress?: () => void
}

export const SessionHistoryItem: React.FC<SessionHistoryItemProps> = ({ session, detailed = false, onPress }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "Unknown date"
    const date = new Date(timestamp.seconds * 1000)
    return format(date, "MMM d, yyyy h:mm a")
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={styles.date}>{formatDate(session.timestamp)}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.duration}>{formatTime(session.duration)}</Text>
          </View>
        </View>

        {detailed && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vibration Intensity:</Text>
              <Text style={styles.detailValue}>{session.vibrationIntensity}%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Average Temperature:</Text>
              <Text style={styles.detailValue}>{session.averageTemperature}°C</Text>
            </View>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 6,
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
})
