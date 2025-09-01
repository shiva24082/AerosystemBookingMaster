import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const LocationContext = createContext(null);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      'useLocationContext must be used within a LocationProvider',
    );
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setLocation({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          address: 'Current Location',
        });
      },
      geoError => {
        setErrorMsg(geoError.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show nearby providers.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setErrorMsg('Location permission denied');
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    } else {
      getCurrentLocation();
    }
  }, [getCurrentLocation]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <LocationContext.Provider
      value={{ location, error: errorMsg, setLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};
