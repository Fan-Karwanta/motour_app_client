import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Settings, User, Camera, MapPin, Mail, Edit3, Phone, Calendar, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [updatingPhone, setUpdatingPhone] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Philippines",
    memberSince: "",
    tripsCompleted: 0,
    savedDestinations: 0,
    totalDistance: "0 km"
  });

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    // Clear any stored user data/tokens here
    await AsyncStorage.removeItem('userToken');
    router.replace('/auth/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      console.log('Profile: Token check:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        console.log('Profile: No token found, redirecting to login');
        router.replace('/auth/login');
        return;
      }

      console.log('Profile: Making API request to:', `${API_BASE_URL}/profile`);
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile: API response status:', response.status);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        console.log('Profile: Response not OK, status:', response.status);
        if (response.status === 401) {
          console.log('Profile: 401 error - token invalid, clearing and redirecting');
          await AsyncStorage.removeItem('userToken');
          router.replace('/auth/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile: API response data:', data);
      
      // Fetch saved destinations count
      console.log('Profile: Fetching saved destinations count');
      const savedResponse = await fetch(`${API_BASE_URL}/saved-destinations/user/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      let savedCount = 0;
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        console.log('Profile: Saved destinations count response:', savedData);
        if (savedData.success) {
          savedCount = savedData.count;
        }
      } else {
        console.log('Profile: Failed to fetch saved destinations count, status:', savedResponse.status);
      }
      
      if (data.success && data.user) {
        console.log('Profile: Setting user data from API');
        setUserInfo({
          name: data.user.name || 'User',
          email: data.user.email || '',
          phone: data.user.phone || '',
          location: data.user.location || 'Philippines',
          memberSince: data.user.memberSince || 'Recently',
          tripsCompleted: data.user.tripsCompleted || 0,
          savedDestinations: savedCount,
          totalDistance: data.user.totalDistance || '0 km'
        });
        setProfileImage(data.user.profileImage || null);
      } else {
        console.log('Profile: API returned invalid data structure');
        throw new Error('Invalid response data');
      }
    } catch (error: unknown) {
      console.error('Profile: Fetch error:', error);
      // Only redirect on authentication errors, not network errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('Invalid token')) {
        console.log('Profile: Authentication error, clearing token and redirecting');
        await AsyncStorage.removeItem('userToken');
        router.replace('/auth/login');
      } else {
        // For network errors, show an alert but don't logout
        console.log('Profile: Network error, showing alert without logout');
        Alert.alert(
          'Network Error',
          'Unable to load profile data. Please check your connection and try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Profile: useEffect triggered, calling fetchUserProfile');
    fetchUserProfile();
  }, []);

  // Use useFocusEffect to handle tab focus - only fetch data if missing
  useFocusEffect(
    useCallback(() => {
      console.log('Profile: Tab focused');
      // Only fetch profile data if we don't have user info yet and not currently loading
      if (!loading && (!userInfo.name || userInfo.name === '' || userInfo.name === 'User')) {
        console.log('Profile: No user data found, fetching profile');
        fetchUserProfile();
      } else {
        console.log('Profile: User data already exists or loading, skipping fetch');
      }
      
      return () => {
        console.log('Profile: Tab unfocused');
      };
    }, [userInfo.name, loading])
  );

  const uploadImageToServer = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(API_ENDPOINTS.PROFILE_UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      console.log('Server upload response:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data.profileImage;
    } catch (error) {
      console.error('Server upload failed:', error);
      throw error;
    }
  };

  const updateProfileImage = async (imageUrl: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Profile image update error:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const uploadedUrl = await uploadImageToServer(result.assets[0].uri);
        setProfileImage(uploadedUrl);
        // Refresh profile data to ensure consistency
        await fetchUserProfile();
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploading(true);
      try {
        const uploadedUrl = await uploadImageToServer(result.assets[0].uri);
        setProfileImage(uploadedUrl);
        // Refresh profile data to ensure consistency
        await fetchUserProfile();
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to select your profile picture',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updatePhoneNumber = async () => {
    if (!newPhone.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setUpdatingPhone(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/profile/phone`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: newPhone }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserInfo(prev => ({ ...prev, phone: data.phone }));
        setShowPhoneModal(false);
        setNewPhone('');
        Alert.alert('Success', 'Phone number updated successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update phone number');
      }
    } catch (error) {
      console.error('Phone update error:', error);
      Alert.alert('Error', 'Failed to update phone number. Please try again.');
    } finally {
      setUpdatingPhone(false);
    }
  };

  const handleEditPhone = () => {
    setNewPhone(userInfo.phone);
    setShowPhoneModal(true);
  };

  const handleEditEmail = () => {
    setNewEmail(userInfo.email);
    setShowEmailModal(true);
  };

  const updateEmail = async () => {
    if (!newEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    setUpdatingEmail(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_BASE_URL}/profile/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserInfo(prev => ({ ...prev, email: data.email }));
        setShowEmailModal(false);
        setNewEmail('');
        Alert.alert('Success', 'Email updated successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to update email');
      }
    } catch (error) {
      console.error('Email update error:', error);
      Alert.alert('Error', 'Failed to update email. Please try again.');
    } finally {
      setUpdatingEmail(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImage && profileImage.length > 0 ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <User size={60} color={Colors.textSecondary} />
            )}
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={showImagePicker}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={Colors.buttonText} />
              ) : (
                <Camera size={16} color={Colors.buttonText} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{userInfo.location}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.tripsCompleted}</Text>
            <Text style={styles.statLabel}>Trips Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.savedDestinations}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.totalDistance}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Mail size={20} color={Colors.text} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userInfo.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditEmail}>
              <Edit3 size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Phone size={20} color={Colors.text} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userInfo.phone || 'Not set'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPhone}>
              <Edit3 size={16} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Calendar size={20} color={Colors.text} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{userInfo.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={cancelLogout}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Phone Update Modal */}
      <Modal
        visible={showPhoneModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Phone Number</Text>
            <TextInput
              style={styles.phoneInput}
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowPhoneModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={updatePhoneNumber}
                disabled={updatingPhone}
              >
                {updatingPhone ? (
                  <ActivityIndicator size="small" color={Colors.buttonText} />
                ) : (
                  <Text style={styles.confirmButtonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Email Update Modal */}
      <Modal
        visible={showEmailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Email Address</Text>
            <TextInput
              style={styles.phoneInput}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Enter email address"
              placeholderTextColor={Colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={updateEmail}
                disabled={updatingEmail}
              >
                {updatingEmail ? (
                  <ActivityIndicator size="small" color={Colors.buttonText} />
                ) : (
                  <Text style={styles.confirmButtonText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.backgroundAlt,
    marginVertical: 16,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    margin: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: Colors.buttonText,
    fontSize: 16,
    fontWeight: "600",
  },
});
