
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
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#000000", "#1A1A1A"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      >
        <View style={styles.topSection}>
          <View style={styles.sunContainer}>
            <View style={styles.sun} />
          </View>

          <Image
            source={require("@/assets/motour_logo.png")}
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
