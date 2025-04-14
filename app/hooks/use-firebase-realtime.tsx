"use client"

import { useState, useEffect } from "react"
import { getDatabase, ref, onValue, off } from "firebase/database"

export function useFirebaseRealtime<T>(path: string): T | null {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    try {
      const db = getDatabase()
      const dataRef = ref(db, path)

      const unsubscribe = onValue(
        dataRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData(snapshot.val() as T)
          } else {
            setData(null)
          }
        },
        (error) => {
          console.error(`Error fetching data from ${path}:`, error)
        },
      )

      return () => {
        // Clean up the listener
        off(dataRef)
      }
    } catch (error) {
      console.error("Error setting up Firebase realtime listener:", error)
      return () => {}
    }
  }, [path])

  return data
}
