
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Star, MapPin, ChevronRight } from "lucide-react-native";
import { Link } from "expo-router";
import Colors from "@/constants/colors";

interface DestinationCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  isLarge?: boolean;
}

const DestinationCard = ({
  id,
  name,
  location,
  rating,
  image,
  isLarge = false,
}: DestinationCardProps) => {
  // Create card content as a separate component to reuse in both Link implementations
  const CardContent = () => (
    <>
      <View
        style={[styles.imageContainer, isLarge && styles.largeImageContainer]}
      >
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.ratingContainer}>
          <Star size={12} color={Colors.rating} fill={Colors.rating} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.locationContainer}>
          <MapPin size={12} color={Colors.locationDot} />
          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
      {isLarge && (
        <View style={styles.arrowContainer}>
          <ChevronRight size={20} color={Colors.primary} />
        </View>
      )}
    </>
  );

  // Use different approaches for web vs native
  if (Platform.OS === "web") {
    return (
      <Link
        href={`/destinations/${id}`}
        style={[styles.container, isLarge && styles.largeContainer]}
      >
        <CardContent />
      </Link>
    );
  }

  return (
    <Link href={`/destinations/${id}`} asChild>
      <TouchableOpacity
        style={[styles.container, isLarge && styles.largeContainer]}
      >
        <CardContent />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    width: Dimensions.get("window").width * 0.7,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    display: "flex", // Needed for web
  },
  largeContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
    backgroundColor: Colors.backgroundAlt, // Thêm màu nền ở đây
  },
  largeImageContainer: {
    height: 80, // Fixed height
    width: 80, // Fixed width
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: Colors.backgroundAlt, // Thêm màu nền ở đây
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
    marginRight: 12,
  },
  ratingContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: Colors.card, // Thêm màu nền cho phần thông tin
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  arrowContainer: {
    paddingRight: 16,
  },
});

export default DestinationCard;
