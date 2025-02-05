import React from "react";
import { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, FlatList, Dimensions, Animated, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";
import {Photo} from "../../constants/Types";

const API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY;
const { width, height } = Dimensions.get("window");

const screenWidth = Dimensions.get("window").width;

const MarsRoverPhotosScreen = () => {

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

      console.log("response: ", response.data.photos[0].rover);
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


  const renderPhoto = ({ item }: { item: { id: string; img_src: string } }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item.img_src }} style={styles.photo} />
      <Text></Text>
    </View>
  );

  const handleSetRover = (selectedRover: string) => {
    setRover(selectedRover);
    fetchRoverPhotos(selectedRover, date);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mars Rover Photos</Text>

      {/* Show Date Picker */}
      {showPicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}

      {/* Rover Selection */}
      <View style={styles.roverPickerContainer}>
        <Text style={styles.roverPickerLabel}>Select Rover:</Text>

        <View style={styles.roverBtnsContainer}>
          <TouchableOpacity style={styles.roverBtn} onPress={() => handleSetRover("Curiosity")}>
            <Text style={{color: "#fff",}}>Curiosity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roverBtn} onPress={() => handleSetRover("Opportunity")}>
            <Text style={{color: "#fff",}}>Opportunity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roverBtn} onPress={() => handleSetRover("Spirit")}>
            <Text style={{color: "#fff",}}>Spirit</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker Button */}
      <TouchableOpacity style={styles.datePickerContainer} onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={30} color="white" />
      </TouchableOpacity>
      </View>

      <FlatList
        data={roverPhotos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={3} // Adjust number of columns based on design
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F5F5F5",
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  grid: {
    paddingHorizontal: 8,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center", color: "#fff" },

  photoContainer: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF",
    elevation: 2,
  },
  photo: {
    width: (screenWidth - 32) / 3, // Adjust for numColumns
    height: (screenWidth - 32) / 3,
    resizeMode: "cover",
  },

    datePickerContainer: {
      position: "absolute",
      // bottom: "70%",
      right: 0,
      borderRadius: "50%",
      backgroundColor: "rgba(0, 150, 0, 0.5)",
      padding: 6,
      zIndex:10,
    },
    swipeText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  
    // Rover Photos
    roverPickerContainer: { padding: 2, color: "#fff" },
    roverPickerLabel: { fontSize: 18, color: "#fff", marginBottom: 10 },
    roverBtnsContainer: {
      paddingHorizontal: 20,
       display: "flex", 
       flexDirection: "row",
       gap: 10,
        justifyContent:"center",
      },
    roverPhotosTitle: { fontSize: 20, fontWeight: "bold", color: "red", marginBottom: 10 },
    roverImage: { width:"20%", marginBottom: 10, borderRadius: 10 },
    noPhotosText: { color: "#fff", fontSize: 16 },
    roverImageContainer: { 
      display: "flex",
      borderWidth: 1, 
      borderColor: "red", 
      borderRadius: 10 },

      roverBtn: {
        backgroundColor: "blue",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
        marginBottom: 10,
      },
});

export default MarsRoverPhotosScreen;
