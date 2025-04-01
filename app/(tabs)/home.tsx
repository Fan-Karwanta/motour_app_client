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
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { Bell, ChevronRight, MapPin } from "lucide-react-native";
import SearchBar from "../components/SearchBar";
import CategoryItem from "../components/CategoryItem";
import SectionHeader from "../components/SectionHeader";
import DestinationCard from "../components/DestinationCard";
import { categories, destinations } from "@/constants/destinations";
import Colors from "@/constants/colors";

const DATA = [
  { type: "header" },
  { type: "search" },
  { type: "categories" },
  { type: "popular" },
  { type: "newDestinations" },
];

export default function HomeScreen() {
  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case "header":
        return (
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../../assets/avatar.jpg")}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.userName}>Hi, Vudungdev</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
        );
      case "search":
        return (
          <View style={styles.content}>
            <Text style={styles.questionText}>Where do you want to go?</Text>
            <SearchBar placeholder="Search here..." />
          </View>
        );
      case "categories":
        return (
          <View style={styles.content}>
            <View style={styles.categoriesContainer}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <CategoryItem
                    name={item.name}
                    image={item.image}
                    onPress={() => {}}
                  />
                )}
                contentContainerStyle={styles.categoriesList}
              />
            </View>
          </View>
        );
      case "popular":
        return (
          <View style={styles.content}>
            <View style={styles.section}>
              <SectionHeader title="Popular" onViewAll={() => {}} />
              <FlatList
                data={destinations.slice(0, 3)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <DestinationCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    location={item.location}
                    rating={item.rating}
                    image={item.image}
                  />
                )}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          </View>
        );
      case "newDestinations":
        return (
          <View style={styles.content}>
            <View style={styles.section}>
              <SectionHeader title="New Destinations" />
              <View>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=200",
                    }}
                    style={{ width: 80, height: 80, borderRadius: 12 }}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                      Merapi Mount
                    </Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color={Colors.locationDot} />
                      <Text style={styles.location} numberOfLines={1}>
                        Sleman city
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=200",
                    }}
                    style={{ width: 80, height: 80, borderRadius: 12 }}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                      Baron Beach
                    </Text>
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color={Colors.locationDot} />
                      <Text style={styles.location} numberOfLines={1}>
                        Gunung Kidul, Indc
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: Colors.backgroundAlt,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
  },
  categoriesContainer: {
    marginBottom: 32,
  },
  categoriesList: {
    paddingRight: 16,
  },
  section: {},
  horizontalList: {
    paddingRight: 24,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 16,
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
    color: Colors.text,
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
