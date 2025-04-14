"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import App from "./app"
import { useAuthStore } from "./app/stores/auth-store"
import { firebaseConfig } from "./firebase-config"

// Initialize Firebase
initializeApp(firebaseConfig)

export default function Layout() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <App />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
