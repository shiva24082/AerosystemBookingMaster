import { useEffect, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to provide you with nearby drone services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            'Location Access Denied',
            'The app needs location access to provide you with nearby drone services.',
            [{ text: 'OK' }],
          );
          return false;
        }
      }
      return true; 
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Error requesting location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 10,
        });
      });

      setLocation(position);

      setAddress({
        street: '123 Main Street',
        city: 'Nashik',
        region: 'Maharashtra',
        country: 'India',
        formattedAddress: '123 Main Street, Nashik, Maharashtra, India',
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get location. Please try again.');
      if (!__DEV__) {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [requestLocationPermission]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]); 

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  return {
    location,
    address,
    errorMsg,
    isLoading,
    refreshLocation,
    requestLocationPermission,
  };
}
