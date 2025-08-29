import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/constants/api';

export interface Rating {
  _id: string;
  destinationId: string;
  userId: {
    _id: string;
    email: string;
    name?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface RatingResponse {
  success: boolean;
  data: Rating;
  message?: string;
  error?: string | string[];
}

export interface RatingsResponse {
  success: boolean;
  count: number;
  data: Rating[];
}

class RatingService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getRatingsForDestination(destinationId: string): Promise<Rating[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.DESTINATION_RATINGS(destinationId), {
        method: 'GET',
        headers,
      });

      const result: RatingsResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.success ? 'Failed to fetch ratings' : 'Network error');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  }

  async submitRating(destinationId: string, rating: number, comment: string = ''): Promise<Rating> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.DESTINATION_RATINGS(destinationId), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const result: RatingResponse = await response.json();

      if (!response.ok) {
        throw new Error(Array.isArray(result.error) ? result.error.join(', ') : result.error || 'Failed to submit rating');
      }

      return result.data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }
}

export default new RatingService();
