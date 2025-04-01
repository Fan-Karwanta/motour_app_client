// Travel App Code
// Template Creator: VuDungDev
// Template Created Date: 2025-04-01 10:00:00
// For any inquiries, please contact: https://www.facebook.com/vudungjapan
// © 2025 VuDungDev. All rights reserved
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Button from "./components/Button";
import Colors from "@/constants/colors";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#0A84FF", "#4CC2FF"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      >
        <View style={styles.topSection}>
          <View style={styles.sunContainer}>
            <View style={styles.sun} />
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=1000",
            }}
            style={styles.cloudImage}
            resizeMode="contain"
          />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1533757114113-c591aa4a1567?q=80&w=1000",
            }}
            style={styles.travelerImage}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Let's Discover World</Text>
        <Text style={styles.subtitle}>
          Traveling has the ability to make you joyful. A stroll might help you
          enjoy your holiday time while also calming you down.
        </Text>

        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.activeDot]} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>

        <Button
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientBackground: {
    height: "60%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  topSection: {
    flex: 1,
    position: "relative",
  },
  sunContainer: {
    position: "absolute",
    top: 40,
    right: 40,
    zIndex: 1,
  },
  sun: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
  },
  cloudImage: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 80,
  },
  travelerImage: {
    width: "100%",
    height: 300,
    position: "absolute",
    bottom: -20,
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  button: {
    marginTop: 24,
  },
});
