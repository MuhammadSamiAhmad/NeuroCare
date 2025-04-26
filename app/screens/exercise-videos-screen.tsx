"use client";

import { useNavigation } from "@react-navigation/native"; // For navigation
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { format } from "date-fns";

const upperLimbExercises = [
  {
    description: "Wrist circles to improve blood flow in arms.",
    duration: "2 minutes",
    video: "kGHD1rhBvS4",
  },
  {
    description: "Shoulder shrugs to enhance upper body circulation.",
    duration: "1 minute",
    video: "q3EcVqr24OQ",
  },
  {
    description: "Arm swings to stimulate blood flow.",
    duration: "3 minutes",
    video: "BHmBWVRDbXw",
  },
];

const lowerLimbExercises = [
  {
    description: "Brisk walking to boost leg circulation.",
    duration: "20 minutes",
    video: "nmvVfgrExAg",
  },
  {
    description: "Ankle pumps to improve lower leg blood flow.",
    duration: "3 minutes",
    video: "tZ8XkQkhg2o",
  },
  {
    description: "Calf raises to enhance circulation in the legs.",
    duration: "2 minutes",
    video: "a-x_NR-ibos",
  },
];

export default function ExerciseVideosScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: (typeof upperLimbExercises)[0] }) => (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(`https://www.youtube.com/watch?v=${item.video}`)
      }
    >
      <View style={styles.videoCard}>
        <Image
          source={{
            uri: `https://img.youtube.com/vi/${item.video}/mqdefault.jpg`,
          }}
          style={styles.thumbnail}
        />
        <Text style={styles.videoTitle}>{item.description}</Text>
        <Text style={styles.videoDuration}>Duration: {item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Exercise Videos</Text>
          <View style={{ width: 24 }} />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Upper Limb Exercises</Text>
          <FlatList
            data={upperLimbExercises}
            renderItem={renderItem}
            keyExtractor={(item) => item.video}
            contentContainerStyle={styles.list}
          />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Lower Limb Exercises</Text>
          <FlatList
            data={lowerLimbExercises}
            renderItem={renderItem}
            keyExtractor={(item) => item.video}
            contentContainerStyle={styles.list}
          />
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  videoCard: {
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    overflow: "hidden",
    padding: 8,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  videoTitle: {
    paddingTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  videoDuration: {
    fontSize: 14,
    color: colors.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  exerciseCard: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  exerciseDuration: {
    fontSize: 14,
    color: colors.secondary,
  },
});
