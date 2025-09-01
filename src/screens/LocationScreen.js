import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useLocation } from '../hooks/useLocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../constants/firebase';

const LocationScreen = () => {
  const navigation = useNavigation();
  const { location, address, isLoading, errorMsg, refreshLocation } =
    useLocation();

  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressName, setAddressName] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const addressesCollection = collection(db, 'savedAddresses');
      const addressesSnapshot = await getDocs(addressesCollection);
      const addressesList = [];
      addressesSnapshot.forEach(doc => {
        const data = doc.data();
        addressesList.push({
          id: doc.id,
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
        });
      });
      setSavedAddresses(addressesList);
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
      Alert.alert('Error', 'Failed to load saved addresses.');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddAddress = () => {
    setMapModalVisible(true);
  };

  const handleUseCurrentLocation = async () => {
    if (location) {
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address?.formattedAddress || 'Current Location',
      });
      setAddressName('Current Location');
      setMapModalVisible(true);
    } else {
      await refreshLocation();
    }
  };

  const saveAddress = async () => {
    if (selectedLocation && addressName) {
      try {
        const addressesCollection = collection(db, 'savedAddresses');
        const docRef = await addDoc(addressesCollection, {
          name: addressName,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          address: selectedLocation.address || 'Unknown address',
        });

        setSavedAddresses([
          ...savedAddresses,
          {
            id: docRef.id,
            name: addressName,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            address: selectedLocation.address || 'Unknown address',
          },
        ]);

        setMapModalVisible(false);
        setSelectedLocation(null);
        setAddressName('');

        Alert.alert('Success', 'Address saved successfully!');
      } catch (error) {
        console.error('Error saving address:', error);
        Alert.alert('Error', 'Failed to save address.');
      }
    } else {
      Alert.alert(
        'Validation',
        'Please select a location and provide a name for this address',
      );
    }
  };

  const onMapPress = e => {
    const { coordinate } = e.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      address: 'Selected Location', // You would implement reverse geocoding here
    });
  };

  const MapModal = () => {
    if (!isMapModalVisible) return null;

    return (
      <View style={styles.modalContainer}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMapModalVisible(false)}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <TouchableOpacity onPress={saveAddress}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Google Places Autocomplete */}
          <GooglePlacesAutocomplete
            placeholder="Search for a place"
            onPress={(data, details = null) => {
              if (details && details.geometry && details.geometry.location) {
                const { lat, lng } = details.geometry.location;
                setSelectedLocation({
                  latitude: lat,
                  longitude: lng,
                  address: data.description,
                });
                setAddressName(data.description);

                if (mapRef.current) {
                  mapRef.current.animateToRegion(
                    {
                      latitude: lat,
                      longitude: lng,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    },
                    300,
                  );
                }
              }
            }}
            query={{
              key: 'AIzaSyAkbaerd5P6hNhceyK6kKWDC6KgudhW01E',
              language: 'en',
            }}
            fetchDetails={true}
            styles={{
              container: { flex: 0, margin: 16 },
              textInputContainer: { backgroundColor: 'transparent' },
              textInput: {
                height: 44,
                color: '#5d5d5d',
                fontSize: 16,
                backgroundColor: '#f2f2f2',
                borderRadius: 8,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: { backgroundColor: 'white' },
            }}
          />

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location?.coords?.latitude || 19.9975,
                longitude: location?.coords?.longitude || 73.7898,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              onPress={onMapPress}
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  pinColor="#0066cc"
                />
              )}
            </MapView>
          </View>

          {/* Selected Location Details */}
          {selectedLocation && (
            <View style={styles.locationDetails}>
              <Text style={styles.detailsTitle}>Selected Location</Text>
              <Text style={styles.detailsAddress}>
                {selectedLocation.address || 'Unknown address'}
              </Text>

              <View style={styles.nameInputContainer}>
                <Text style={styles.nameLabel}>Save as:</Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Add a name for this address"
                  value={addressName}
                  onChangeText={setAddressName}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Location Options */}
      <View style={styles.optionsContainer}>
        {/* Use Current Location Option */}
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handleUseCurrentLocation}
          disabled={isLoading}
        >
          <View style={styles.optionIcon}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#0066cc" />
            ) : (
              <Icon name="locate" size={20} color="#0066cc" />
            )}
          </View>
          <Text style={styles.optionText}>Use Current Location</Text>
        </TouchableOpacity>

        {/* Add Address Option */}
        <TouchableOpacity style={styles.optionItem} onPress={handleAddAddress}>
          <View style={styles.optionIcon}>
            <Icon name="add" size={24} color="#0066cc" />
          </View>
          <Text style={styles.optionText}>Add Address</Text>
        </TouchableOpacity>
      </View>

      {/* Saved Addresses Section */}
      <View style={styles.savedAddressesContainer}>
        <Text style={styles.sectionTitle}>Saved Address</Text>

        {loadingAddresses ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
          </View>
        ) : savedAddresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't saved any address!</Text>
            <Text style={styles.emptySubtext}>
              You haven't saved any addresses here
            </Text>

            <TouchableOpacity onPress={handleAddAddress}>
              <Text style={styles.addAddressText}>Add Address+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.addressesList}>
            {savedAddresses.map(address => (
              <TouchableOpacity key={address.id} style={styles.addressItem}>
                <View style={styles.addressIcon}>
                  <Icon name="location" size={20} color="#0066cc" />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.name}</Text>
                  <Text style={styles.addressDetails} numberOfLines={2}>
                    {address.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Map Modal */}
      <MapModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  optionsContainer: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    color: '#0066cc',
    fontSize: 16,
  },
  savedAddressesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 16,
  },
  addAddressText: {
    color: '#0066cc',
    fontSize: 16,
  },
  addressesList: {
    flex: 1,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  addressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    color: '#0066cc',
    fontWeight: '500',
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  locationDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailsAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  nameInputContainer: {
    marginBottom: 16,
  },
  nameLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default LocationScreen;
