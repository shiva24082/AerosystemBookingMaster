import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLocationContext } from '../hooks/LocationContext';
import { sampleProviders } from '../utils/sampleProviders';

const haversineDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const ProvidersScreen = () => {
  const navigation = useNavigation();
  const { location } = useLocationContext();
  const [filteredProviders, setFilteredProviders] = useState([]);

  useEffect(() => {
    if (location && location.coords) {
      const filtered = sampleProviders.filter(provider => {
        const distance = haversineDistance(location.coords, {
          latitude: provider.latitude,
          longitude: provider.longitude,
        });
        return distance >= 0 && distance <= 100;
      });
      setFilteredProviders(filtered);
    } else {
      setFilteredProviders([]);
    }
  }, [location]);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User location not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchIcon}>
            <Icon name="search" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search for providers, services..."
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.moreIcon}>
          <Icon name="ellipsis-vertical" size={22} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.distanceChipContainer}>
        <View style={styles.distanceChip}>
          <Text style={styles.distanceChipText}>Within 90-100 km</Text>
        </View>
      </View>

      <Text style={styles.heading}>Select provider to create request</Text>

      <ScrollView style={styles.providerList}>
        {filteredProviders.length === 0 ? (
          <Text style={styles.noProvidersText}>
            No providers found within 90-100 km range.
          </Text>
        ) : (
          filteredProviders.map(provider => {
            const distance = haversineDistance(location.coords, {
              latitude: provider.latitude,
              longitude: provider.longitude,
            });
            return (
              <TouchableOpacity
                key={provider.id}
                style={styles.providerCard}
                onPress={() => navigation.navigate('Spraying')}
              >
                <View style={styles.providerAvatar}>
                  <Text style={styles.providerInitial}>
                    {provider.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerDistance}>
                    {distance.toFixed(1)} km Away
                  </Text>
                  <Text style={styles.providerLocation}>
                    {provider.city}, {provider.state.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 32,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  searchIcon: {
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#374151',
  },
  moreIcon: {
    marginLeft: 8,
  },
  distanceChipContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  distanceChip: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  distanceChipText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  heading: {
    paddingHorizontal: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  providerList: {
    paddingHorizontal: 16,
  },
  noProvidersText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  providerInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  providerDistance: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  providerLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default ProvidersScreen;
