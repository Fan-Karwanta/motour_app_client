
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function ExploreScreen() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsUpdatingLocation(true);
      } else {
        setLoading(true);
      }
      
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        if (isRefresh) {
          setIsUpdatingLocation(false);
        } else {
          setLoading(false);
        }
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      setErrorMsg(null);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get current location');
    } finally {
      if (isRefresh) {
        setIsUpdatingLocation(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleLocationPress = () => {
    getCurrentLocation(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.errorTitle}>Location Access Required</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleLocationPress}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
          <Ionicons name="locate" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {location && (
        <View style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body { margin: 0; padding: 0; }
                      #map { height: 100vh; width: 100%; }
                    </style>
                  </head>
                  <body>
                    <div id="map"></div>
                    <script>
                      let map;
                      let marker;
                      
                      function initMap() {
                        const userLocation = { lat: ${location.latitude}, lng: ${location.longitude} };
                        map = new google.maps.Map(document.getElementById("map"), {
                          zoom: 15,
                          center: userLocation,
                          mapTypeControl: true,
                          streetViewControl: true,
                          fullscreenControl: false,
                        });
                        
                        marker = new google.maps.Marker({
                          position: userLocation,
                          map: map,
                          title: "Your Location",
                          animation: google.maps.Animation.DROP,
                        });
                        
                        const infoWindow = new google.maps.InfoWindow({
                          content: "<div style='padding: 5px;'><strong>Your Current Location</strong><br/>You are here!</div>"
                        });
                        
                        marker.addListener("click", () => {
                          infoWindow.open(map, marker);
                        });
                      }
                      
                      function recenterMap(lat, lng) {
                        if (map && marker) {
                          const newLocation = { lat: lat, lng: lng };
                          map.panTo(newLocation);
                          marker.setPosition(newLocation);
                          marker.setAnimation(google.maps.Animation.BOUNCE);
                          setTimeout(() => {
                            marker.setAnimation(null);
                          }, 2000);
                        }
                      }
                      
                      // Listen for messages from React Native
                      window.addEventListener('message', function(event) {
                        const data = JSON.parse(event.data);
                        if (data.type === 'recenter') {
                          recenterMap(data.latitude, data.longitude);
                        }
                      });
                    </script>
                    <script async defer 
                      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCIXzIIZVAmK2dMqD08C55l5gNNQiKWzXs&callback=initMap">
                    </script>
                  </body>
                </html>
              `
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            onMessage={(event) => {
              // Handle messages from WebView if needed
            }}
            ref={(webview) => {
              if (webview && location) {
                webview.postMessage(JSON.stringify({
                  type: 'recenter',
                  latitude: location.latitude,
                  longitude: location.longitude
                }));
              }
            }}
          />
          
          {/* Current Location Button 
          <TouchableOpacity 
            style={styles.currentLocationButton} 
            onPress={handleLocationPress}
            disabled={isUpdatingLocation}
          >
            {isUpdatingLocation ? (
              <ActivityIndicator size="small" color={Colors.background} />
            ) : (
              <Ionicons name="locate" size={20} color={Colors.background} />
            )}
          </TouchableOpacity> */}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  locationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
