import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '../constants/api';

export interface SavedDestination {
  _id: string;
  name: string;
  photos: {
    main: string;
    others: string[];
  };
  geo: {
    lat: number;
    lng: number;
  };
  category: string;
  averageRating: number;
  description: string;
  address: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

class SavedDestinationService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async getAuthHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getSavedDestinations(): Promise<SavedDestination[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.SAVED_DESTINATIONS, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch saved destinations');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
      throw error;
    }
  }

  async toggleSavedDestination(destinationId: string): Promise<{ success: boolean; isSaved: boolean; message: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.SAVED_DESTINATION_TOGGLE(destinationId), {
        method: 'POST',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle saved destination');
      }

      return {
        success: data.success,
        isSaved: data.isSaved,
        message: data.message
      };
    } catch (error) {
      console.error('Error toggling saved destination:', error);
      throw error;
    }
  }

  async checkIfSaved(destinationId: string): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.SAVED_DESTINATION_CHECK(destinationId), {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check saved status');
      }

      return data.isSaved || false;
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  }

  async getSavedCount(destinationId: string): Promise<number> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SAVED_DESTINATIONS}/count/${destinationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get saved count');
      }

      return data.count || 0;
    } catch (error) {
      console.error('Error getting saved count:', error);
      return 0;
    }
  }
}

export default new SavedDestinationService();
