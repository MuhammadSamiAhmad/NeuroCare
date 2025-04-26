"use client";

import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { Redirect } from "expo-router";

import LoginScreen from "./screens/auth/login-screen";
import SignupScreen from "./screens/auth/signup-screen";
import OnboardingScreen from "./screens/onboarding-screen";
import DashboardScreen from "./screens/dashboard-screen";
import SessionControlScreen from "./screens/session-control-screen";
import ProgressTrackingScreen from "./screens/progress-tracking-screen";
import RecommendationsScreen from "./screens/recommendations-screen";
import ExerciseVideosScreen from "./screens/exercise-videos-screen";
import ProfileScreen from "./screens/profile-screen";
import type { RootStackParamList } from "./types/navigation";
import { useAuthStore } from "./stores/auth-store";
import { auth } from "./lib/firebase";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="SessionControl"
              component={SessionControlScreen}
            />
            <Stack.Screen
              name="ProgressTracking"
              component={ProgressTrackingScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="Recommendations"
              component={RecommendationsScreen}
            />
            <Stack.Screen
              name="ExerciseVideos"
              component={ExerciseVideosScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export function Index() {
  const { user } = useAuthStore();

  // Redirect based on authentication status
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/dashboard" />;
}
