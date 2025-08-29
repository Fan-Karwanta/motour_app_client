import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Share2,
  Camera,
  MessageCircle,
  Send,
} from 'lucide-react-native';
import Colors from '../../constants/colors';
import destinationService, { Destination } from '../../services/destinationService';
import ratingService, { Rating } from '../../services/ratingService';
import savedDestinationService from '../../services/savedDestinationService';

const { width, height } = Dimensions.get('window');

export default function DestinationDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingDestination, setSavingDestination] = useState(false);

  useEffect(() => {
    if (id) {
      loadDestinationDetails();
      checkIfSaved();
    }
  }, [id]);

  const loadDestinationDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch from API
      const result = await destinationService.getDestinationById(id as string);
      setDestination(result.destination);
      setRatings(result.ratings || []);
    } catch (error) {
      console.error('Error loading destination details:', error);
      Alert.alert('Error', 'Failed to load destination details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!id) return;
    
    try {
      const saved = await savedDestinationService.checkIfSaved(id as string);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    }
  };

  const toggleSaveDestination = async () => {
    if (!destination) return;
    
    setSavingDestination(true);
    try {
      const result = await savedDestinationService.toggleSavedDestination(destination._id);
      setIsSaved(result.isSaved);
      Alert.alert('Success', result.message);
    } catch (error) {
      Alert.alert('Error', 'Failed to update saved destination');
    } finally {
      setSavingDestination(false);
    }
  };

  const submitRating = async () => {
    if (userRating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!destination) return;

    try {
      setSubmittingRating(true);
      
      // Submit to real API
      const newRating = await ratingService.submitRating(destination._id, userRating, userComment);
      setRatings(prev => [newRating, ...prev]);
      
      // Update destination average rating
      const updatedRatings = [newRating, ...ratings];
      const avgRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;
      setDestination(prev => prev ? { ...prev, averageRating: avgRating } : null);
      
      setShowRatingModal(false);
      setUserRating(0);
      setUserComment('');
      
      Alert.alert('Success', 'Your rating has been submitted!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please check your connection and try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating: number, size: number = 16, interactive: boolean = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={interactive ? () => setUserRating(i) : undefined}
          disabled={!interactive}
        >
          <Star
            size={size}
            color={i <= rating ? '#FFD700' : '#E0E0E0'}
            fill={i <= rating ? '#FFD700' : 'transparent'}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const openGoogleMaps = () => {
    if (destination) {
      const url = `https://www.google.com/maps/search/?api=1&query=${destination.geo.lat},${destination.geo.lng}`;
      Alert.alert(
        'Open Maps',
        'This would open Google Maps with the destination location',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading destination...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!destination) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Destination not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const allImages = [destination.photos.main, ...(destination.photos.others || [])].filter(Boolean);
  const fallbackImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header with Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: allImages[currentImageIndex] || fallbackImage }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
            placeholder={{ uri: fallbackImage }}
          />
          
          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />
          
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity 
                style={[styles.headerButton, isSaved && styles.savedButton]} 
                onPress={toggleSaveDestination}
                disabled={savingDestination}
              >
                {savingDestination ? (
                  <ActivityIndicator size={20} color="#FFFFFF" />
                ) : (
                  <Heart 
                    size={24} 
                    color={isSaved ? "#FF6B6B" : "#FFFFFF"} 
                    fill={isSaved ? "#FF6B6B" : "transparent"}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Share2 size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Indicators */}
          {allImages.length > 1 && (
            <View style={styles.imageIndicators}>
              {allImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{destination.name}</Text>
            <View style={styles.ratingSection}>
              <View style={styles.starsRow}>
                {renderStars(destination.averageRating, 20)}
                <Text style={styles.ratingNumber}>{destination.averageRating.toFixed(1)}</Text>
              </View>
              <Text style={styles.reviewCount}>({ratings.length} reviews)</Text>
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity style={styles.locationSection} onPress={openGoogleMaps}>
            <View style={styles.locationIcon}>
              <MapPin size={18} color={Colors.primary} />
            </View>
            <Text style={styles.locationText}>{destination.address}</Text>
          </TouchableOpacity>

          {/* Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{destination.category}</Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{destination.description}</Text>
          </View>

          {/* Tags */}
          {destination.tags.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {destination.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowRatingModal(true)}
              >
                <MessageCircle size={16} color={Colors.buttonText} />
                <Text style={styles.addReviewText}>Write Review</Text>
              </TouchableOpacity>
            </View>

            {ratings.length === 0 ? (
              <View style={styles.noReviewsContainer}>
                <MessageCircle size={48} color={Colors.textSecondary} />
                <Text style={styles.noReviewsText}>No reviews yet</Text>
                <Text style={styles.noReviewsSubtext}>Be the first to share your experience!</Text>
              </View>
            ) : (
              ratings.map((rating) => (
                <View key={rating._id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>
                          {(rating.userId.name || rating.userId.email).charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.reviewerDetails}>
                        <Text style={styles.reviewerName}>
                          {rating.userId.name || rating.userId.email.split('@')[0]}
                        </Text>
                        <Text style={styles.reviewDate}>
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      {renderStars(rating.rating, 16)}
                    </View>
                  </View>
                  {rating.comment && (
                    <Text style={styles.reviewComment}>{rating.comment}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate your experience</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.ratingInput}>
              <Text style={styles.ratingLabel}>How was your visit?</Text>
              <View style={styles.starRatingContainer}>
                {renderStars(userRating, 40, true)}
              </View>
              {userRating > 0 && (
                <Text style={styles.ratingDescription}>
                  {userRating === 1 ? 'Poor' : 
                   userRating === 2 ? 'Fair' :
                   userRating === 3 ? 'Good' :
                   userRating === 4 ? 'Very Good' : 'Excellent'}
                </Text>
              )}
            </View>

            <View style={styles.commentInput}>
              <Text style={styles.commentLabel}>Share your thoughts (Optional)</Text>
              <TextInput
                style={styles.commentTextInput}
                multiline
                numberOfLines={4}
                placeholder="Tell others about your experience..."
                placeholderTextColor={Colors.textSecondary}
                value={userComment}
                onChangeText={setUserComment}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{userComment.length}/500</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRatingModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, userRating === 0 && styles.submitButtonDisabled]}
                onPress={submitRating}
                disabled={submittingRating || userRating === 0}
              >
                {submittingRating ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.buttonText,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.5,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    marginTop: -20,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 38,
  },
  ratingSection: {
    alignItems: 'flex-start',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    fontWeight: '500',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  categoryText: {
    color: Colors.buttonText,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  reviewsSection: {
    marginBottom: 40,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addReviewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addReviewText: {
    color: Colors.buttonText,
    fontSize: 14,
    fontWeight: '600',
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  reviewItem: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundAlt,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerInitial: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: '700',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewRating: {
    marginLeft: 12,
  },
  reviewComment: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  ratingInput: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  starRatingContainer: {
    marginBottom: 12,
  },
  ratingDescription: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  commentInput: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
    fontWeight: '500',
  },
  commentTextInput: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.backgroundAlt,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
});
