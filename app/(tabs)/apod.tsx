import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated, ActivityIndicator } from "react-native";
import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY;
const { width, height } = Dimensions.get("window");

export default function ApodScreen() {
  const [apod, setApod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity for fade effect

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
        );
        setApod(response.data);
      } catch (error) {
        console.error("Error fetching APOD:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApod();
  }, []);

  // Animation to fade in & out the indicator
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      onScroll={(e) => {
        if (e.nativeEvent.contentOffset.y > 10) {
          Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }
      }}
      scrollEventThrottle={16}
    >
      {/* Full-Screen Image */}
      <Image source={{ uri: apod?.url }} style={styles.image} />

      {/* "Swipe Up" Indicator */}
      <Animated.View style={[styles.swipeIndicator, { opacity: fadeAnim }]}>
        <Text style={styles.swipeText}>Swipe up</Text>
        {/* <Text style={styles.arrow}>⬆️</Text> */}
      </Animated.View>

      {/* Title & Explanation */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{apod?.title}</Text>
        <Text style={styles.description}>{apod?.explanation}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  image: { width, height, resizeMode: "cover" },
  textContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  description: { fontSize: 16, color: "#bbb", lineHeight: 22 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", color: "#fff" },
  
  // Swipe Up Indicator
  swipeIndicator: {
    position: "absolute",
    bottom: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  swipeText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  arrow: { fontSize: 24, color: "#fff" },
});

