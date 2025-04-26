"use client";

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ref, onValue, set } from "firebase/database";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { colors } from "../theme/colors";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { TemperatureGraph } from "../components/charts/temperature-graph";
import { useDeviceStore } from "../stores/device-store";
import { database, firestore } from "../lib/firebase";
import type { NavigationProp } from "../types/navigation";

interface DeviceData {
  temperature: number;
  isConnected: boolean;
}

interface SessionControlData {
  isActive: boolean;
  vibrationLevel: number;
}

export default function SessionControlScreen() {
  const navigation = useNavigation<NavigationProp<"SessionControl">>();
  const { deviceConnected, setDeviceConnected } = useDeviceStore();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [vibrationIntensity, setVibrationIntensity] = useState(50);
  const [temperatureLevel, setTemperatureLevel] = useState(0);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [temperatureData, setTemperatureData] = useState<number[]>([]);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Listen for real-time device data (temperature and connection status)
  useEffect(() => {
    if (!userId) return;

    const deviceRef = ref(database, `users/${userId}/device`);
    const unsubscribeDevice = onValue(deviceRef, (snapshot) => {
      const data = snapshot.val() as DeviceData | null;
      if (data) {
        setTemperatureLevel(data.temperature || 0);
        setDeviceConnected(data.isConnected || false);
        setTemperatureData((prev) =>
          [...prev, data.temperature || 0].slice(-30)
        ); // Keep last 30 readings for graph
      }
    });

    const sessionRef = ref(database, `users/${userId}/session`);
    const unsubscribeSession = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val() as SessionControlData | null;
      if (data) {
        setSessionActive(data.isActive || false);
        setVibrationIntensity(data.vibrationLevel || 50);
      }
    });

    return () => {
      unsubscribeDevice();
      unsubscribeSession();
    };
  }, [userId, setDeviceConnected]);

  // Update Firebase with vibration intensity changes
  const updateVibrationIntensity = async (value: number) => {
    if (!userId) return;
    setVibrationIntensity(value);
    try {
      await set(ref(database, `users/${userId}/session/vibrationLevel`), value);
    } catch (error) {
      console.error("Error updating vibration level:", error);
    }
  };

  const startSession = async () => {
    if (!deviceConnected) {
      Alert.alert(
        "Device Not Connected",
        "Please connect your NeuroCare device to start a session."
      );
      return;
    }

    if (!userId) return;

    setSessionActive(true);

    // Start session timer
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);

    setSessionTimer(timer);

    // Update Firebase to start session
    try {
      await set(ref(database, `users/${userId}/session/isActive`), true);
    } catch (error) {
      console.error("Error starting session:", error);
      Alert.alert("Error", "Failed to start session.");
    }
  };

  const stopSession = async () => {
    if (!userId) return;

    // Clear timer
    if (sessionTimer) {
      clearInterval(sessionTimer);
      setSessionTimer(null);
    }

    setSessionActive(false);

    // Update Firebase to stop session
    try {
      await set(ref(database, `users/${userId}/session/isActive`), false);
    } catch (error) {
      console.error("Error stopping session:", error);
    }

    // Save session data to Firestore (for history)
    try {
      const sessionsRef = collection(firestore, "sessions");
      await addDoc(sessionsRef, {
        userId,
        duration: sessionDuration,
        vibrationIntensity,
        averageTemperature: temperatureLevel,
        timestamp: serverTimestamp(),
      });

      Alert.alert(
        "Session Completed",
        `Your therapy session has been saved. Duration: ${formatTime(
          sessionDuration
        )}`,
        [
          {
            text: "View Progress",
            onPress: () => navigation.navigate("ProgressTracking"),
          },
          { text: "OK", onPress: () => setSessionDuration(0) },
        ]
      );
    } catch (error) {
      console.error("Error saving session:", error);
      Alert.alert("Error", "Failed to save your session data.");
    }
  };

  const emergencyStop = () => {
    Alert.alert(
      "Emergency Stop",
      "Are you sure you want to stop the session immediately?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Stop", style: "destructive", onPress: stopSession },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Session Control</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Card style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle}>
              {sessionActive ? "Session in Progress" : "New Session"}
            </Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: sessionActive
                    ? colors.success
                    : colors.warning,
                },
              ]}
            />
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Duration</Text>
            <Text style={styles.timer}>{formatTime(sessionDuration)}</Text>
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.controlLabel}>Vibration Intensity</Text>
            <Slider
              value={vibrationIntensity}
              onValueChange={updateVibrationIntensity}
              minimumValue={0}
              maximumValue={100}
              step={1}
              disabled={!deviceConnected || !sessionActive}
            />
            <View style={styles.intensityLabels}>
              <Text style={styles.intensityLabel}>Low</Text>
              <Text style={styles.intensityLabel}>Medium</Text>
              <Text style={styles.intensityLabel}>High</Text>
            </View>
          </View>

          <View style={styles.temperatureSection}>
            <Text style={styles.controlLabel}>Temperature Monitoring</Text>
            <TemperatureGraph data={temperatureData} />
            <Text style={styles.temperatureValue}>
              Current: {temperatureLevel}°C
            </Text>
          </View>

          {sessionActive ? (
            <TouchableOpacity
              style={styles.emergencyStopButton}
              onPress={emergencyStop}
            >
              <Ionicons name="stop-circle" size={24} color="white" />
              <Text style={styles.emergencyStopText}>EMERGENCY STOP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.startButton,
                !deviceConnected && styles.disabledButton,
              ]}
              onPress={startSession}
              disabled={!deviceConnected}
            >
              <Ionicons name="play-circle" size={24} color="white" />
              <Text style={styles.startButtonText}>START SESSION</Text>
            </TouchableOpacity>
          )}
        </Card>

        <Card style={styles.deviceInfoCard}>
          <Text style={styles.deviceInfoTitle}>Device Information</Text>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Status:</Text>
            <Text
              style={[
                styles.deviceInfoValue,
                { color: deviceConnected ? colors.success : colors.error },
              ]}
            >
              {deviceConnected ? "Connected" : "Disconnected"}
            </Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Recommended Session:</Text>
            <Text style={styles.deviceInfoValue}>15-20 minutes</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Safe Temperature Range:</Text>
            <Text style={styles.deviceInfoValue}>35°C - 40°C</Text>
          </View>
        </Card>
      </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  sessionCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  timer: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
  },
  controlSection: {
    marginBottom: 24,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  intensityLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  temperatureSection: {
    marginBottom: 24,
  },
  temperatureValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
  },
  emergencyStopButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyStopText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  deviceInfoCard: {
    padding: 16,
    backgroundColor: colors.cardBackground,
  },
  deviceInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  deviceInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  deviceInfoLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  deviceInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
});
