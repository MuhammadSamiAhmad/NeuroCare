"use client";

import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons"; // For Ionicons
import { useNavigation } from "@react-navigation/native"; // For navigation
import { TouchableOpacity } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAiRecommendations } from "../hooks/use-ai-recommendations";
import { colors } from "../theme/colors";

export default function RecommendationsScreen() {
  const navigation = useNavigation();
  const { recommendations, loading, fetchRecommendations } =
    useAiRecommendations();

  useEffect(() => {
    fetchRecommendations({ sessionDuration: 20, vibrationIntensity: 50 });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>AI Recommendations</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Text style={styles.recommendations}>
            {recommendations || "No recommendations available."}
          </Text>
        )}
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendations: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
});
