import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
  Dashboard: undefined;
  SessionControl: undefined;
  ProgressTracking: undefined;
  Profile: undefined;
  Recommendations: undefined;
  ExerciseVideos: undefined;
  // Add other screens as needed
};

export type NavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;
