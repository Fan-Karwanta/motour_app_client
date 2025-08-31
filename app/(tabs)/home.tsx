
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Bell, ChevronRight, MapPin, Star } from "lucide-react-native";
import { router } from "expo-router";
import SearchBar from "../components/SearchBar";
import CategoryItem from "../components/CategoryItem";
import SectionHeader from "../components/SectionHeader";
import DestinationCard from "../components/DestinationCard";
import { categories } from "@/constants/destinations";
import Colors from "@/constants/colors";
import destinationService, { Destination } from "../../services/destinationService";

const DATA = [
  { type: "header" },
  { type: "search" },
  { type: "categories" },
  { type: "popular" },
  { type: "newDestinations" },
];

export default function HomeScreen() {
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [newDestinations, setNewDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [popular, newest] = await Promise.all([
        destinationService.getPopularDestinations(3),
        destinationService.getNewDestinations(5)
      ]);
      
      setPopularDestinations(popular);
      setNewDestinations(newest);
    } catch (err) {
      console.error('Error loading destinations:', err);
      setError('Failed to load destinations. Please try again.');
      Alert.alert('Error', 'Failed to load destinations. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} color="#FFD700" fill="#FFD700" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} color="#FFD700" fill="#FFD700" style={{ opacity: 0.5 }} />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} color="#E0E0E0" />
      );
    }
    
    return stars;
  };
  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case "header":
        return (
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("@/assets/motour_logo.png")}
                  style={styles.avatar}
                />
              </View>
              <View>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.userName}>Hi, John Romel</Text>
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
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : (
                <FlatList
                  data={popularDestinations}
                  keyExtractor={(item) => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.popularCard}
                      onPress={() => router.push(`/destinations/${item._id}`)}
                    >
                      <View style={styles.popularImageContainer}>
                        <Image
                          source={{ 
                            uri: item.photos?.main || 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=400'
                          }}
                          style={styles.popularImage}
                          contentFit="cover"
                          transition={200}
                        />
                        <View style={styles.popularRatingContainer}>
                          <Star size={14} color="#FFD700" fill="#FFD700" />
                          <Text style={styles.ratingText}>{item.averageRating?.toFixed(1) || '0.0'}</Text>
                        </View>
                      </View>
                      <View style={styles.popularInfo}>
                        <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                        <View style={styles.popularLocation}>
                          <MapPin size={12} color={Colors.locationDot} />
                          <Text style={styles.popularLocationText} numberOfLines={1}>
                            {item.address || `${item.geo?.lat?.toFixed(2) || '0'}, ${item.geo?.lng?.toFixed(2) || '0'}`}
                          </Text>
                        </View>
                        <Text style={styles.popularCategory}>{item.category}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.horizontalList}
                />
              )}
            </View>
          </View>
        );
      case "newDestinations":
        return (
          <View style={styles.content}>
            <View style={styles.section}>
              <SectionHeader title="New Destinations" onViewAll={() => {}} />
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : (
                <View style={styles.newDestinationsContainer}>
                  {newDestinations.map((item) => (
                    <TouchableOpacity 
                      key={item._id} 
                      style={styles.newDestinationCard}
                      onPress={() => router.push(`/destinations/${item._id}`)}
                    >
                      <View style={styles.newDestinationImageContainer}>
                        <Image
                          source={{ 
                            uri: item.photos?.main || 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=400'
                          }}
                          style={styles.newDestinationImage}
                          contentFit="cover"
                          transition={200}
                        />
                        <View style={styles.newDestinationOverlay}>
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                          </View>
                          <View style={styles.newDestinationRating}>
                            <Star size={14} color="#FFD700" fill="#FFD700" />
                            <Text style={styles.newRatingText}>{item.averageRating?.toFixed(1) || '0.0'}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.newDestinationInfo}>
                        <Text style={styles.newDestinationName}>{item.name}</Text>
                        <View style={styles.newDestinationLocation}>
                          <MapPin size={14} color={Colors.locationDot} />
                          <Text style={styles.newDestinationLocationText}>
                            {item.address || `${item.geo?.lat?.toFixed(2) || '0'}, ${item.geo?.lng?.toFixed(2) || '0'}`}
                          </Text>
                        </View>
                        <Text style={styles.newDestinationDescription} numberOfLines={2}>
                          {item.description || 'Discover this amazing destination'}
                        </Text>
                        <View style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>{item.category}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
  // New Destinations Styles
  newDestinationsContainer: {
    gap: 16,
    marginTop: 16,
  },
  newDestinationCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newDestinationImageContainer: {
    position: 'relative',
    height: 200,
  },
  newDestinationImage: {
    width: '100%',
    height: '100%',
  },
  newDestinationOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  newBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: Colors.buttonText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  newDestinationInfo: {
    padding: 16,
  },
  newDestinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  newDestinationLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newDestinationLocationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  newDestinationDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // Loading container
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Popular destinations styles
  popularCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  popularImageContainer: {
    position: 'relative',
    height: 120,
  },
  popularImage: {
    width: '100%',
    height: '100%',
  },
  popularRatingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  popularInfo: {
    padding: 12,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  popularLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  popularLocationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  popularCategory: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // New destinations rating styles
  newDestinationRating: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  categoryTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
