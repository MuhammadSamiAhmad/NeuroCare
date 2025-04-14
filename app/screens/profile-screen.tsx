"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";

import { colors } from "../theme/colors";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../stores/auth-store";
import type { NavigationProp } from "../types/navigation";
import { auth } from "../lib/firebase";

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<"Profile">>();
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not found");
      }

      // Update display name if changed
      if (name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: name });
      }

      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      // Update user in store
      setUser({ ...currentUser });

      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("User not found");
      }

      // Update password
      await updatePassword(currentUser, newPassword);

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Password changed successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Auth state listener in App.tsx will handle navigation
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitials}>
                  {user?.displayName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"}
                </Text>
              </View>
              <Text style={styles.profileName}>
                {user?.displayName || "User"}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.primary}
                />
              }
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.primary}
                />
              }
            />

            <Button
              title="Update Profile"
              onPress={handleUpdateProfile}
              loading={loading}
              style={styles.updateButton}
            />
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <Input
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
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
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
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
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
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
              title="Change Password"
              onPress={handleChangePassword}
              loading={loading}
              style={styles.updateButton}
            />
          </Card>

          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.preferenceItem}>
              <View>
                <Text style={styles.preferenceLabel}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>
                  Receive alerts for session reminders and tips
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View>
                <Text style={styles.preferenceLabel}>Data Sharing</Text>
                <Text style={styles.preferenceDescription}>
                  Share anonymous usage data to improve the app
                </Text>
              </View>
              <Switch
                value={dataSharing}
                onValueChange={setDataSharing}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </Card>

          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
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
    padding: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 12,
    color: colors.textLight,
    maxWidth: "80%",
  },
  logoutButton: {
    marginBottom: 24,
  },
});
