"use client";

import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons"; // For Ionicons
import { useNavigation } from "@react-navigation/native"; // For navigation
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";

type VideoItem = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
};

export default function ExerciseVideosScreen() {
  const navigation = useNavigation();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=neuropathy+exercise+at+home&type=video&key=${YOUTUBE_API_KEY}&maxResults=10`
      );
      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(`https://www.youtube.com/watch?v=${item.id.videoId}`)
      }
    >
      <View style={styles.videoCard}>
        <Image
          source={{ uri: item.snippet.thumbnails.medium.url }}
          style={styles.thumbnail}
        />
        <Text style={styles.videoTitle}>{item.snippet.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercise Videos</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.videoId}
          contentContainerStyle={styles.list}
        />
      )}
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
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  videoTitle: {
    padding: 8,
    fontSize: 16,
    color: colors.text,
  },
});
