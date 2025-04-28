"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { colors } from "../../theme/colors";
import { auth, database } from "../../lib/firebase";
import { useAuthStore } from "../../stores/auth-store";
import type { RootStackParamList } from "../../types/navigation";

// Create a typed navigation prop
type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { setUser, setInitialized } = useAuthStore();

  // Initialize user data in Firebase Realtime Database
  const initializeUserData = async (userId: string) => {
    const userRef = ref(database, `users/${userId}`);
    try {
      // Initialize with default values
      await set(userRef, {
        session: {
          isActive: false,
          vibrationLevel: 50,
        },
        device: {
          temperature: 0,
          heartRate: 0,
          isConnected: false,
        },
      });
      setInitialized(true);
    } catch (error: any) {
      console.error("Error initializing user data:", error);
      Alert.alert("Error", "Failed to initialize user data.");
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: name });

      // Initialize user data in Firebase Realtime Database
      await initializeUserData(user.uid);

      // Set user in auth store
      setUser(user);

      // Navigation will be handled by the auth state listener in App.tsx
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            defaultSource={require("../../../assets/images/logo-placeholder.png")}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join NeuroCare to manage your therapy
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            leftIcon={
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
              />
            }
          />

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
            }
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.primary}
              />
            }
          />

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.primary}
              />
            }
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            style={styles.signupButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 999999999,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 5,
  },
  form: {
    width: "100%",
    gap: 16,
  },
  signupButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    color: colors.text,
  },
  loginText: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
