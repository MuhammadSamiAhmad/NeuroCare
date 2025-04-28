"use client";

import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAiRecommendations } from "../hooks/use-ai-recommendations";
import { colors } from "../theme/colors";
import { Card } from "../components/ui/card";

export default function RecommendationsScreen() {
  const navigation = useNavigation();
  const { recommendations, loading, fetchRecommendations, sources } =
    useAiRecommendations();
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    // Fetch recommendations for all sessions from Firebase
    fetchRecommendations();
  }, []);

  const filteredRecommendations = () => {
    if (selectedFilter === "all") {
      return recommendations;
    } else if (selectedFilter === "recent") {
      return recommendations.slice(0, 5);
    } else if (selectedFilter === "older") {
      return recommendations.slice(5);
    }
    return recommendations;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>AI Recommendations</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Generating recommendations...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Recommended settings based on your session history
          </Text>

          {/* Filter options */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "all" && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "all" && styles.activeFilterText,
                ]}
              >
                All Sessions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "recent" && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter("recent")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "recent" && styles.activeFilterText,
                ]}
              >
                Recent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "older" && styles.activeFilter,
              ]}
              onPress={() => setSelectedFilter("older")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "older" && styles.activeFilterText,
                ]}
              >
                Older
              </Text>
            </TouchableOpacity>
          </View>

          {filteredRecommendations().length > 0 ? (
            filteredRecommendations().map((rec) => (
              <Card key={rec.sessionNumber} style={styles.recommendationCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionTitle}>
                    Session {rec.sessionNumber}
                  </Text>
                  <Text style={styles.sessionDate}>{rec.sessionDate}</Text>
                </View>
                <View style={styles.recommendationDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="pulse-outline"
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.detailLabel}>Frequency</Text>
                      <Text style={styles.detailValue}>{rec.frequency} Hz</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="time-outline"
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{rec.duration} min</Text>
                    </View>
                  </View>
                  <View style={styles.justificationContainer}>
                    <Text style={styles.justificationLabel}>
                      Justification:
                    </Text>
                    <Text style={styles.justification}>
                      {rec.justification}
                    </Text>
                  </View>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No recommendations available. Complete more therapy sessions to
                receive personalized recommendations.
              </Text>
            </View>
          )}

          {sources.length > 0 && (
            <Card style={styles.sourcesCard}>
              <Text style={styles.sourcesTitle}>Research Sources</Text>
              {sources.map((source, index) => (
                <Text key={index} style={styles.sourceItem}>
                  • {source.title}
                </Text>
              ))}
            </Card>
          )}
        </ScrollView>
      )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textLight,
  },
  recommendationCard: {
    marginBottom: 16,
    padding: 0,
    overflow: "hidden",
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: `${colors.primary}10`,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  recommendationDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 2,
  },
  justificationContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  justificationLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  justification: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
  },
  sourcesCard: {
    marginTop: 8,
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
  },
  sourcesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  sourceItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
});
