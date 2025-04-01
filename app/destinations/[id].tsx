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
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { MapPin, Star, MessageCircle, Phone } from "lucide-react-native";
import { destinations } from "@/constants/destinations";
import Button from "../components/Button";
import AmenityItem from "../components/AmenityItem";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <View style={styles.notFound}>
        <Text>Destination not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: destination.image }}
            style={styles.mainImage}
            contentFit="cover"
          />
          {Platform.OS !== "web" && (
            <View style={styles.playButton}>
              <View style={styles.playIcon} />
            </View>
          )}
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.rating} fill={Colors.rating} />
            <Text style={styles.ratingText}>{destination.rating}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{destination.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={Colors.locationDot} />
              <Text style={styles.location}>{destination.location}</Text>
            </View>
          </View>

          {destination.guide && (
            <View style={styles.guideContainer}>
              <View style={styles.guideInfo}>
                <Image
                  source={{ uri: destination.guideImage }}
                  style={styles.guideImage}
                  contentFit="cover"
                />
                <View>
                  <Text style={styles.guideName}>{destination.guide}</Text>
                  <Text style={styles.guideTitle}>Tour Guide</Text>
                </View>
              </View>
              <View style={styles.guideActions}>
                <TouchableOpacity style={styles.guideActionButton}>
                  <MessageCircle size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.guideActionButton}>
                  <Phone size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{destination.description}</Text>
          </View>

          <View style={styles.gallerySection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {destination.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included?</Text>
            <View style={styles.amenitiesContainer}>
              <AmenityItem type="hotel" active={destination.amenities.hotel} />
              <AmenityItem
                type="flight"
                active={destination.amenities.flight}
              />
              <AmenityItem
                type="transport"
                active={destination.amenities.transport}
              />
              <AmenityItem type="food" active={destination.amenities.food} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Total price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${destination.price}</Text>
            <Text style={styles.perPerson}>/ Person</Text>
          </View>
        </View>
        <Button title="Book Now" onPress={() => {}} style={styles.bookButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: Colors.background,
    marginLeft: 5,
  },
  ratingContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  guideContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  guideInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  guideName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  guideTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  guideActions: {
    flexDirection: "row",
  },
  guideActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  gallerySection: {
    marginBottom: 24,
  },
  galleryImage: {
    width: width / 3 - 16,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  amenitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  perPerson: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  bookButton: {
    width: 150,
  },
});
