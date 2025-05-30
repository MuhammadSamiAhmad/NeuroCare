"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, set, get } from "firebase/database";
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
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { setUser, setInitialized, isInitialized } = useAuthStore();

  // Initialize user data in Firebase Realtime Database
  const initializeUserData = async (userId: string) => {
    const userRef = ref(database, `users/${userId}`);
    try {
      // Check if data already exists
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // Initialize with default values
        await set(userRef, {
          session: {
            isActive: false,
            vibrationLevel: 50,
          },
          device: {
            temperature: 0,
            isConnected: false,
          },
        });
      }
      setInitialized(true);
    } catch (error: any) {
      console.error("Error initializing user data:", error);
      Alert.alert("Error", "Failed to initialize user data.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      if (!isInitialized) {
        await initializeUserData(user.uid);
      }
      // Navigation will be handled by the auth state listener in App.tsx
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          defaultSource={require("../../../assets/images/logo-placeholder.png")}
        />
        <Text style={styles.title}>NeuroCare</Text>
        <Text style={styles.subtitle}>Your personal neuropathy companion</Text>
      </View>

      <View style={styles.form}>
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

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Info", "Reset password feature would be here")
          }
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 999999999,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
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
  forgotPassword: {
    color: colors.primary,
    textAlign: "right",
    marginTop: -8,
  },
  loginButton: {
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
  signupText: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
