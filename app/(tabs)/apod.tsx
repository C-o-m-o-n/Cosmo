// import { useEffect, useState } from "react";
// import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
// import axios from "axios";

// // const API_KEY = process.env.NASA_API_KEY;
// const API_KEY = "LWYIawDehsc4EFX4JZ9uHevfWe8Og03za8L62NIJ";

// export default function ApodScreen() {
//   const [apod, setApod] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     const fetchApod = async () => {
//       try {
//         const response = await axios.get(
//           `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
//         );
//         setApod(response.data);
//       } catch (error) {
//         console.error("Error fetching APOD:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApod();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={styles.loader} />;
//   }

//   return (
//     <View style={styles.container}>
//       {apod?.url && (
//         <Image source={{ uri: apod.url }} style={styles.image} resizeMode="cover" />
//       )}
//       <Text style={styles.title}>{apod?.title}</Text>
//       <Text style={styles.description}>{apod?.explanation}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#000" },
//   image: { width: "100%", height: "100%", borderRadius: 10 },
//   title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 10 },
//   description: { fontSize: 16, color: "#ccc", marginTop: 10, textAlign: "center" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
// });



// import { useEffect, useState } from "react";
// import { View, Text, ImageBackground, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
// import axios from "axios";
// import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// const API_KEY = "LWYIawDehsc4EFX4JZ9uHevfWe8Og03za8L62NIJ";
// const { height } = Dimensions.get("window");

// export default function ApodScreen() {
//   const [apod, setApod] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const translateY = useSharedValue(height);

//   useEffect(() => {
//     const fetchApod = async () => {
//       try {
//         const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
//         setApod(response.data);
//       } catch (error) {
//         console.error("Error fetching APOD:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApod();
//   }, []);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: withSpring(translateY.value) }],
//   }));

//   const onGestureEvent = (event: any) => {
//     if (event.nativeEvent.translationY < -50) {
//       translateY.value = 0;
//       console.log("swipe up");
//     } else if (event.nativeEvent.translationY > 50) {
//       translateY.value = height;
//       console.log("swipe down");
//     }
//   };

//   if (loading) {
//         return <ActivityIndicator size="large" style={styles.loading} />;
//       }

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <ImageBackground source={{ uri: apod?.url }} style={styles.image}>
//         <View style={styles.overlay}>
//           <Text style={styles.title}>{apod?.title}</Text>
//         </View>
//       </ImageBackground>

//       {/* Sliding Panel */}
//       <PanGestureHandler onGestureEvent={onGestureEvent}>
//         <Animated.View style={[styles.bottomSheet, animatedStyle]}>
//           <Text style={styles.description}>{apod?.explanation}</Text>
//         </Animated.View>
//       </PanGestureHandler>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   image: { flex: 1, justifyContent: "flex-end" },
//   overlay: {
//     backgroundColor: "rgba(0,0,0,0.5)",
//     padding: 20,
//     alignItems: "center",
//   },
//   title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
//   bottomSheet: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     height: height / 2,
//     backgroundColor: "#111",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   description: { fontSize: 16, color: "#fff" },
//   loading: { flex: 1, justifyContent: "center", alignItems: "center", color: "#fff" },
// });

// const API_KEY =  "LWYIawDehsc4EFX4JZ9uHevfWe8Og03za8L62NIJ";
import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, Animated } from "react-native";
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
    return <Text style={styles.loading}>Loading...</Text>;
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

