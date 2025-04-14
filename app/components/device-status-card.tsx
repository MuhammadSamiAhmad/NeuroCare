import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

import { Card } from "./ui/card"
import { colors } from "../theme/colors"

interface DeviceStatusCardProps {
  connected: boolean
  batteryLevel: number
  onConnect?: () => void
}

export const DeviceStatusCard: React.FC<DeviceStatusCardProps> = ({ connected, batteryLevel, onConnect }) => {
  const getBatteryIcon = () => {
    if (batteryLevel > 75) return "battery-full-outline"
    if (batteryLevel > 50) return "battery-half-outline"
    if (batteryLevel > 20) return "battery-medium-outline"
    return "battery-dead-outline"
  }

  const getBatteryColor = () => {
    if (batteryLevel > 20) return colors.success
    if (batteryLevel > 10) return colors.warning
    return colors.error
  }

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={connected ? "bluetooth" : "bluetooth-outline"}
              size={24}
              color={connected ? colors.primary : colors.textLight}
            />
          </View>
          <View>
            <Text style={styles.title}>Device Status</Text>
            <Text style={[styles.status, { color: connected ? colors.success : colors.error }]}>
              {connected ? "Connected" : "Disconnected"}
            </Text>
          </View>
        </View>

        {connected ? (
          <View style={styles.batteryContainer}>
            <Ionicons name={getBatteryIcon()} size={20} color={getBatteryColor()} />
            <Text style={[styles.batteryText, { color: getBatteryColor() }]}>{batteryLevel}%</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    color: colors.textLight,
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  connectButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})
