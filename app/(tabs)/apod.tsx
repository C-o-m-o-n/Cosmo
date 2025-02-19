import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated, ActivityIndicator, Button, Platform, TouchableOpacity } from "react-native";
import axios from "axios";
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";

const API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY;
const { width, height } = Dimensions.get("window");

export default function ApodScreen() {
  const [apod, setApod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Default to today

  const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity for fade effect

  const fetchApod = async (selectedDate: Date) => {
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format

    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formattedDate}`
      );
      setApod(response.data);
    } catch (error) {
      console.error("Error fetching APOD:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod(date);
  }, [date]);

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

  // Handle date selection
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false); // Hide picker on Android after selection
    if (selectedDate) setDate(selectedDate);
  };

  return (

    <>
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

      {/* Title & Explanation */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{apod?.title}</Text>
        <Text style={styles.description}>{apod?.explanation}</Text>
      </View>

    </ScrollView>

     {/* Show Date Picker */}
     {showPicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      {/* "Swipe Up" Indicator */}
      <Animated.View style={[styles.swipeIndicator, { opacity: fadeAnim }]}>
        <Text style={styles.swipeText}>Swipe up</Text>
        {/* <Text style={styles.arrow}>⬆️</Text> */}
      </Animated.View>

       {/* Date Picker Button */}
       <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={35} color="white" />
        {/* <Button title="Select Date"  /> */}
      </TouchableOpacity>
    </>
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
    bottom: "5%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  datePickerContainer: {
    position: "absolute",
    bottom: "5%",
    right: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 150, 0, 0.5)",
    padding: 10
  },

  swipeText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  arrow: { fontSize: 24, color: "#fff" },
});