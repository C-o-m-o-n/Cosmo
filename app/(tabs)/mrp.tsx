import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";

const API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY;
const { width, height } = Dimensions.get("window");

export default function MarsRoverPhotosScreen() {
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date()); // Default to today
  const [rover, setRover] = useState("Curiosity");
  const [roverPhotos, setRoverPhotos] = useState<any[]>([]);

  const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity for fade effect

  // Function to fetch rover photos
  const fetchRoverPhotos = async (selectedRover: string, selectedDate: Date) => {
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    try {
      const response = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos?earth_date=${formattedDate}&api_key=${API_KEY}`
      );
      setRoverPhotos(response.data.photos || []);
    } catch (error) {
      console.error("Error fetching Mars Rover photos:", error);
    }
  };

  // UseEffect to fetch photos when rover or date changes
  useEffect(() => {
    fetchRoverPhotos(rover, date); // Fetch photos with default rover (Curiosity) and today's date on initial load
  }, [date, rover]);

  // Fetch default rover photo when component loads
  useEffect(() => {
    fetchRoverPhotos(rover, date); // Fetch initial photo using default rover and date
    setLoading(false); // Set loading state to false after first fetch
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Handle date selection
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false); // Hide picker on Android after selection
    if (selectedDate) setDate(selectedDate);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} scrollEventThrottle={16}>
      {/* Date Picker Button */}
      <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={35} color="white" />
      </TouchableOpacity>

      {/* Show Date Picker */}
      {showPicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      {/* "Swipe Up" Indicator */}
      <Animated.View style={[styles.swipeIndicator, { opacity: fadeAnim }]}>
        <Text style={styles.swipeText}>Swipe up</Text>
      </Animated.View>

      {/* Rover Selection */}
      <View style={styles.roverPickerContainer}>
        <Text style={styles.roverPickerLabel}>Select Rover:</Text>
        <Picker selectedValue={rover} onValueChange={(itemValue) => setRover(itemValue)}>
          <Picker.Item label="Curiosity" value="Curiosity" />
          <Picker.Item label="Opportunity" value="Opportunity" />
          <Picker.Item label="Spirit" value="Spirit" />
        </Picker>
      </View>

      {/* Rover Photos */}
      <View style={styles.roverPhotosContainer}>
        <Text style={styles.roverPhotosTitle}>Mars Rover Photos</Text>
        {roverPhotos.length === 0 ? (
          <Text style={styles.noPhotosText}>No photos for this date</Text>
        ) : (
          roverPhotos.map((photo: any) => (
            <Image key={photo.id} source={{ uri: photo.img_src }} style={styles.roverImage} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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

  datePickerContainer: {
    position: "fixed",
    bottom: "40%",
    right: 0,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 150, 0, 0.5)",
    padding: 10,
    zIndex:10,
  },

  swipeText: { fontSize: 16, color: "#fff", fontWeight: "bold" },

  // Rover Photos
  roverPickerContainer: { padding: 20 },
  roverPickerLabel: { fontSize: 18, color: "#fff", marginBottom: 10 },
  roverPhotosContainer: { paddingHorizontal: 20 },
  roverPhotosTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  roverImage: { width: "100%", height: 200, marginBottom: 10, borderRadius: 10 },
  noPhotosText: { color: "#fff", fontSize: 16 },
});
