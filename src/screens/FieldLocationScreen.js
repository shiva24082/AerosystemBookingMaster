import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';

const FieldLocationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMapPress = event => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    // In a real app, you would reverse geocode here
    setAddress('Selected Location');
  };

  const handleConfirmSelection = () => {
    if (selectedLocation) {
      navigation.navigate('Spraying', {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        address,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Location</Text>
        <Text style={styles.headerSubtitle}>
          {loading
            ? 'Fetching address...'
            : address || 'Tap on the map to select a location'}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 19.9975,
            longitude: 73.7898,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Location" />
          )}
        </MapView>
      </View>

      <View style={styles.footer}>
        {loading && <ActivityIndicator size="small" color="#3b82f6" />}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedLocation && styles.disabledButton,
          ]}
          onPress={handleConfirmSelection}
          disabled={!selectedLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FieldLocationScreen;
