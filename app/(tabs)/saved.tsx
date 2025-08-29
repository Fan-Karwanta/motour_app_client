
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Heart, MapPin, Star, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import savedDestinationService, { SavedDestination } from "@/services/savedDestinationService";

export default function SavedScreen() {
  const router = useRouter();
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadSavedDestinations();
  }, []);

  const loadSavedDestinations = async () => {
    try {
      setLoading(true);
      const destinations = await savedDestinationService.getSavedDestinations();
      setSavedDestinations(destinations);
    } catch (error) {
      console.error('Error loading saved destinations:', error);
      Alert.alert('Error', 'Failed to load saved destinations');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedDestinations();
    setRefreshing(false);
  };

  const removeSavedDestination = async (destinationId: string) => {
    try {
      setRemovingId(destinationId);
      await savedDestinationService.toggleSavedDestination(destinationId);
      setSavedDestinations(prev => prev.filter(dest => dest._id !== destinationId));
      Alert.alert('Success', 'Destination removed from saved list');
    } catch (error) {
      console.error('Error removing saved destination:', error);
      Alert.alert('Error', 'Failed to remove destination');
    } finally {
      setRemovingId(null);
    }
  };

  const handleDestinationPress = (destinationId: string) => {
    router.push(`/destinations/${destinationId}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          color={i <= rating ? '#FFD700' : '#E0E0E0'}
          fill={i <= rating ? '#FFD700' : 'transparent'}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Destinations</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading saved destinations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Destinations</Text>
        <Text style={styles.headerSubtitle}>
          {savedDestinations.length} {savedDestinations.length === 1 ? 'destination' : 'destinations'}
        </Text>
      </View>

      {savedDestinations.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Heart size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Saved Destinations</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring and save your favorite destinations to see them here
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.exploreButtonText}>Explore Destinations</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.destinationsGrid}>
            {savedDestinations.map((destination) => (
              <View key={destination._id} style={styles.destinationCard}>
                <TouchableOpacity
                  onPress={() => handleDestinationPress(destination._id)}
                  style={styles.cardContent}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: destination.photos.main }}
                      style={styles.destinationImage}
                      contentFit="cover"
                      transition={300}
                    />
                    <View style={styles.ratingOverlay}>
                      {renderStars(destination.averageRating)}
                      <Text style={styles.ratingText}>
                        {destination.averageRating.toFixed(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName} numberOfLines={2}>
                      {destination.name}
                    </Text>
                    
                    <View style={styles.locationRow}>
                      <MapPin size={14} color={Colors.textSecondary} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {destination.address}
                      </Text>
                    </View>

                    <View style={styles.categoryContainer}>
                      <Text style={styles.categoryText}>{destination.category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSavedDestination(destination._id)}
                  disabled={removingId === destination._id}
                >
                  {removingId === destination._id ? (
                    <ActivityIndicator size={16} color="#FF6B6B" />
                  ) : (
                    <Trash2 size={16} color="#FF6B6B" />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundAlt,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  destinationsGrid: {
    padding: 16,
    gap: 16,
  },
  destinationCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  cardContent: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  destinationInfo: {
    padding: 16,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
