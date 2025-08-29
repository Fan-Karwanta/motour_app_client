import { Platform } from 'react-native';

// Get the correct API base URL based on platform and environment
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Use the local network IP for both Android and iOS physical devices
    const LOCAL_IP = '192.168.1.230';
    
    if (Platform.OS === 'android') {
      // Check if running on emulator vs physical device
      // For now, we'll use the local IP for both
      return `http://${LOCAL_IP}:3000`;
    } else if (Platform.OS === 'ios') {
      // For iOS simulator and physical device
      return `http://${LOCAL_IP}:3000`;
    } else {
      // For web
      return 'http://localhost:3000';
    }
  }
  
  // For production, use your deployed API URL
  // Replace this with your actual production server URL
  return 'https://motour_server_101.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl() + '/api';
export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  HEALTH: `${API_BASE_URL}/health`,
  PROFILE: `${API_BASE_URL}/profile`,
  PROFILE_IMAGE: `${API_BASE_URL}/profile/image`,
  PROFILE_UPLOAD_IMAGE: `${API_BASE_URL}/profile/upload-image`,
  PROFILE_EMAIL: `${API_BASE_URL}/profile/email`,
  PROFILE_PHONE: `${API_BASE_URL}/profile/phone`,
  PROFILE_STATS: `${API_BASE_URL}/profile/stats`,
  DESTINATIONS: `${API_BASE_URL}/destinations`,
  DESTINATION_BY_ID: (id: string) => `${API_BASE_URL}/destinations/${id}`,
  DESTINATION_RATINGS: (id: string) => `${API_BASE_URL}/destinations/${id}/ratings`,
  SAVED_DESTINATIONS: `${API_BASE_URL}/saved-destinations`,
  SAVED_DESTINATION_TOGGLE: (id: string) => `${API_BASE_URL}/saved-destinations/${id}`,
  SAVED_DESTINATION_CHECK: (id: string) => `${API_BASE_URL}/saved-destinations/check/${id}`,
};
