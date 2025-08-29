import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from '@/constants/api';

export interface Destination {
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
  description?: string;
  address?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationsResponse {
  success: boolean;
  count: number;
  data: Destination[];
}

class DestinationService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllDestinations(): Promise<Destination[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.DESTINATIONS, {
        method: 'GET',
        headers,
      });

      const result: DestinationsResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.success ? 'Failed to fetch destinations' : 'Network error');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  }

  async getPopularDestinations(limit: number = 3): Promise<Destination[]> {
    try {
      const destinations = await this.getAllDestinations();
      // Sort by average rating and return top destinations
      return destinations
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  }

  async getNewDestinations(limit: number = 5): Promise<Destination[]> {
    try {
      const destinations = await this.getAllDestinations();
      // Sort by creation date and return newest destinations
      return destinations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching new destinations:', error);
      throw error;
    }
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    try {
      const destinations = await this.getAllDestinations();
      return destinations.filter(dest => dest.category.toLowerCase() === category.toLowerCase());
    } catch (error) {
      console.error('Error fetching destinations by category:', error);
      throw error;
    }
  }

  async getDestinationById(id: string): Promise<{ destination: Destination; ratings: any[] }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(API_ENDPOINTS.DESTINATION_BY_ID(id), {
        method: 'GET',
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.success ? 'Failed to fetch destination' : 'Network error');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching destination by ID:', error);
      throw error;
    }
  }
}

export default new DestinationService();
