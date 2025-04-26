"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { Button } from "../components/ui/button";
import type { NavigationProp } from "../types/navigation";

const { width } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome to NeuroCare",
    description:
      "Your personal companion for managing neuropathy symptoms. Let's get started on your journey to better health.",
    image: require("../../assets/images/onboarding-1.jpg"), // Replace with a relevant image
  },
  {
    id: "2",
    title: "Start Therapy Sessions",
    description:
      "Easily start therapy sessions to manage your symptoms. Adjust vibration intensity and monitor temperature in real-time.",
    image: require("../../assets/images/onboarding-1.jpg"), // Replace with a relevant image
  },
  {
    id: "3",
    title: "Track Your Progress",
    description:
      "Monitor your improvement over time with detailed charts and session history. Stay motivated by seeing your progress.",
    image: require("../../assets/images/onboarding-1.jpg"), // Replace with a relevant image
  },
  {
    id: "4",
    title: "Get Personalized Recommendations",
    description:
      "Receive AI-powered recommendations tailored to your needs. Optimize your therapy sessions for the best results.",
    image: require("../../assets/images/onboarding-1.jpg"), // Replace with a relevant image
  },
  {
    id: "5",
    title: "Ready to Begin?",
    description:
      "Connect your NeuroCare device and start your personalized therapy journey today. Take control of your health!",
    image: require("../../assets/images/onboarding-1.jpg"), // Replace with a relevant image
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp<"Onboarding">>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("Dashboard");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Dashboard");
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <TouchableOpacity onPress={() => setCurrentIndex(currentIndex - 1)}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={
            currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"
          }
          onPress={handleNext}
          style={styles.nextButton}
        />
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
  skipText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  nextButton: {
    width: "100%",
  },
});
