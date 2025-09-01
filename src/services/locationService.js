import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
  }

  async requestPermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to provide location-based services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  getCurrentLocation(options = {}) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        ...options,
      };

      Geolocation.getCurrentPosition(
        position => {
          this.currentLocation = position;
          resolve(position);
        },
        error => {
          console.error('Error getting current location:', error);
          reject(error);
        },
        defaultOptions,
      );
    });
  }

  watchPosition(onSuccess, onError, options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      distanceFilter: 10,
      interval: 10000,
      fastestInterval: 5000,
      ...options,
    };

    this.watchId = Geolocation.watchPosition(
      position => {
        this.currentLocation = position;
        onSuccess(position);
      },
      error => {
        console.error('Error watching position:', error);
        if (onError) onError(error);
      },
      defaultOptions,
    );

    return this.watchId;
  }

  stopWatching() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = value => (value * Math.PI) / 180;

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
    const distance = R * c;

    return distance;
  }

  isWithinRadius(lat1, lon1, lat2, lon2, radiusKm) {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusKm;
  }

  formatCoordinates(latitude, longitude, precision = 6) {
    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
  }

  async reverseGeocode(latitude, longitude) {
    try {
      return {
        latitude,
        longitude,
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        street: 'Unknown Street',
        city: 'Unknown City',
        region: 'Unknown Region',
        country: 'Unknown Country',
        postalCode: '00000',
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  }

  async getRouteInfo(origin, destination, travelMode = 'driving') {
    try {
      const distance = this.calculateDistance(
        origin.latitude,
        origin.longitude,
        destination.latitude,
        destination.longitude,
      );

      let duration;
      switch (travelMode) {
        case 'walking':
          duration = distance * 15;
          break;
        case 'bicycling':
          duration = distance * 5;
          break;
        case 'driving':
        default:
          duration = distance * 2;
          break;
      }

      return {
        distance: {
          text: `${distance.toFixed(1)} km`,
          value: distance * 1000,
        },
        duration: {
          text: `${Math.round(duration)} min`,
          value: duration * 60,
        },
        travelMode,
      };
    } catch (error) {
      console.error('Error getting route info:', error);
      throw error;
    }
  }

  async checkLocationServices() {
    try {
      if (Platform.OS === 'android') {
        const status = await Geolocation.requestAuthorization();
        return status === 'granted';
      }

      return true;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  getLastKnownLocation() {
    return this.currentLocation;
  }

  clear() {
    this.stopWatching();
    this.currentLocation = null;
  }
}

const locationService = new LocationService();

export default locationService;
