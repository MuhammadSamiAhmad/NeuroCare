import { useState, useEffect, useRef } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Define structure for recommendation data
export interface SessionRecommendation {
  sessionNumber: number; // For labeling Session 1, 2, etc.
  sessionDate: string;
  frequency: number; // in Hz
  duration: number; // in minutes
  justification: string; // brief justification
}

// Define types for MediSearch API
interface MediSearchSettings {
  language: string;
  filters: {
    sources: string[];
    year_start?: number | null;
    year_end?: number | null;
    only_high_quality: boolean;
    article_types: string[];
  };
  model_type: string;
}

export function useAiRecommendations() {
  const [recommendations, setRecommendations] = useState<
    SessionRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const responseBufferRef = useRef<string>("");

  // Cleanup function to abort fetch request
  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Generate recommendations based on session data
  const generateRecommendations = (
    sessionData: any[]
  ): SessionRecommendation[] => {
    if (!Array.isArray(sessionData) || sessionData.length === 0) {
      return [];
    }

    // Sort sessions by timestamp (newest first)
    const sortedSessions = [...sessionData].sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });

    // Generate recommendations for each session
    return sortedSessions.map((session, index) => {
      // Format date
      const sessionDate = session.timestamp?.seconds
        ? new Date(session.timestamp.seconds * 1000).toLocaleDateString()
        : "Unknown date";

      // Calculate recommended frequency based on vibration intensity and heart rate
      let frequency = 50; // Default

      if (session.vibrationIntensity <= 30) {
        // Lower intensity = higher frequency (120-166 Hz)
        frequency = Math.min(
          166,
          120 + Math.floor(session.vibrationIntensity * 1.5)
        );
      } else if (session.vibrationIntensity <= 70) {
        // Medium intensity = medium frequency (80-119 Hz)
        frequency = 80 + Math.floor((session.vibrationIntensity - 30) * 1);
      } else {
        // Higher intensity = lower frequency (40-79 Hz)
        frequency = 40 + Math.floor((session.vibrationIntensity - 70) * 1.3);
      }

      // Adjust frequency based on heart rate if available
      if (session.averageHeartRate) {
        if (session.averageHeartRate > 90) {
          // Reduce frequency for higher heart rates
          frequency = Math.max(40, frequency - 15);
        } else if (session.averageHeartRate < 60) {
          // Increase frequency for lower heart rates
          frequency = Math.min(166, frequency + 10);
        }
      }

      // Calculate recommended duration based on previous session duration
      let duration = 15; // Default recommendation

      if (session.duration) {
        const previousDurationMinutes = Math.floor(session.duration / 60);

        if (previousDurationMinutes < 10) {
          duration = Math.min(20, previousDurationMinutes + 5);
        } else if (previousDurationMinutes < 20) {
          duration = Math.min(25, previousDurationMinutes + 2);
        } else {
          duration = Math.min(30, previousDurationMinutes);
        }
      }

      // Generate justification based on session data
      let justification =
        "Optimal for peripheral circulation and neuropathic pain relief.";

      if (session.averageHeartRate && session.averageHeartRate > 80) {
        justification =
          "Balances circulatory benefits while preventing excessive heart rate elevation.";
      } else if (
        session.averageTemperature &&
        session.averageTemperature > 37.5
      ) {
        justification =
          "Promotes circulation while minimizing heat buildup in affected tissues.";
      } else if (session.vibrationIntensity > 70) {
        justification =
          "Lower frequency counterbalances high intensity for better tolerance.";
      }

      return {
        sessionNumber: index + 1,
        sessionDate,
        frequency,
        duration,
        justification,
      };
    });
  };

  const fetchRecommendations = async (sessionData?: any) => {
    setLoading(true);

    try {
      // If sessionData is provided directly, use it
      if (sessionData) {
        const recs = generateRecommendations(
          Array.isArray(sessionData) ? sessionData : [sessionData]
        );
        setRecommendations(recs);
        setLoading(false);

        // Mock sources
        setSources([
          {
            title: "Vibration therapy for neuropathic pain",
            url: "https://example.com/1",
          },
          {
            title: "Frequency optimization in peripheral neuropathy",
            url: "https://example.com/2",
          },
          {
            title: "Duration effects in vibration therapy",
            url: "https://example.com/3",
          },
        ]);

        return;
      }

      // Otherwise, fetch sessions from Firebase
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        setLoading(false);
        return;
      }

      const db = getFirestore();
      const sessionsRef = collection(db, "sessions");
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const sessions: any[] = [];

      querySnapshot.forEach((doc) => {
        // Add the document ID as the session ID
        sessions.push({
          ...doc.data(),
          id: doc.id, // This ensures each session has an ID even if not in the data
        });
      });

      if (sessions.length === 0) {
        setLoading(false);
        return;
      }

      // Generate recommendations from the fetched sessions
      const recs = generateRecommendations(sessions);
      setRecommendations(recs);

      // Mock sources
      setSources([
        {
          title: "Vibration therapy for neuropathic pain",
          url: "https://example.com/1",
        },
        {
          title: "Frequency optimization in peripheral neuropathy",
          url: "https://example.com/2",
        },
        {
          title: "Duration effects in vibration therapy",
          url: "https://example.com/3",
        },
      ]);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    sources,
    loading,
    fetchRecommendations,
  };
}
