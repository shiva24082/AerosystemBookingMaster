import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useLocationContext } from '../hooks/LocationContext';
import { useTranslation } from 'react-i18next';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../constants/firebase';
import styles from '../styles/HomeScreenStyles';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { location } = useLocationContext();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const docRef = doc(db, 'users', 'defaultUser');

    const unsubscribe = onSnapshot(
      docRef,
      docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || '');
        } else {
          setUserName('');
        }
      },
      error => {
        console.error('Error syncing user name:', error);
        setUserName('');
      },
    );

    return () => unsubscribe();
  }, []);

  const locationDisplay = location
    ? location.address ||
      `${location.coords.latitude.toFixed(
        4,
      )}, ${location.coords.longitude.toFixed(4)}`
    : t('fetching_location');

  useEffect(() => {
    const fetchWeather = async () => {
      if (location?.coords) {
        try {
          setWeatherLoading(true);
          setWeatherError(null);

          const { latitude, longitude } = location.coords;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timeformat=unixtime&timezone=auto`,
          );

          if (!response.ok) {
            throw new Error(
              `API Error: ${response.status} ${response.statusText}`,
            );
          }

          const data = await response.json();
          setWeather(data);
        } catch (error) {
          setWeatherError(
            error instanceof Error ? error.message : 'Unknown error occurred',
          );
        } finally {
          setWeatherLoading(false);
        }
      }
    };

    fetchWeather();
  }, [location]);

  const formatWeatherData = data => {
    if (!data || !data.current) return null;

    return {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    };
  };

  const weatherData = formatWeatherData(weather);

  const WEATHER_DESCRIPTIONS = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  const getWeatherDescription = code => {
    if (code === undefined) return 'Unknown';
    return WEATHER_DESCRIPTIONS[code] || 'Unknown';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Drone Image and Request Banner */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/images/drone.jpg')}
            style={styles.droneImage}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="person" size={24} color="white" />
              <Text style={styles.greetingText}>
                {t('greeting')} {userName || 'User'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <Icon name="notifications-none" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Location Bar */}
          <TouchableOpacity
            style={styles.locationBar}
            onPress={() => navigation.navigate('Location')}
          >
            <Icon name="location-on" size={20} color="white" />
            <Text style={styles.locationText}>
              {t('current_location')}: {locationDisplay}
            </Text>
          </TouchableOpacity>

          <View style={styles.requestBanner}>
            <Text style={styles.requestText}>{t('create_request_txt')}</Text>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => navigation.navigate('Providers')}
            >
              <Text style={styles.requestButtonText}>
                {t('create_request').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>{t('featured_for_you')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.featuredCard}>
              <Text style={styles.cardTitle}>{t('get_discount')}</Text>
              <Text style={styles.cardDescription}>{t('save_offer')}</Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => navigation.navigate('Providers')}
              >
                <Text style={styles.cardButtonText}>
                  {t('create_request').toUpperCase()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>T&C Apply</Text>
            </View>

            <View style={[styles.featuredCard, styles.orangeCard]}>
              <Text style={styles.cardTitle}>{t('refer_earn')}</Text>
              <Text style={styles.cardDescription}>{t('refer_friends')}</Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => navigation.navigate('Invite')}
              >
                <Text style={[styles.cardButtonText, styles.orangeButtonText]}>
                  {t('refer_earn').toUpperCase()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.termsText}>T&C Apply</Text>
            </View>
          </ScrollView>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherSection}>
          <Text style={styles.sectionTitle}>{t('todays_weather')}</Text>
          <View style={styles.weatherCard}>
            {weatherLoading ? (
              <View style={styles.weatherLoading}>
                <ActivityIndicator color="white" size="large" />
                <Text style={styles.weatherLoadingText}>
                  {t('fetching_weather')}
                </Text>
              </View>
            ) : weatherError ? (
              <View style={styles.weatherError}>
                <Feather name="alert-circle" size={36} color="white" />
                <Text style={styles.weatherErrorText}>
                  {t('error')}: {weatherError}
                </Text>
              </View>
            ) : weatherData ? (
              <View style={styles.weatherContent}>
                <View style={styles.weatherMain}>
                  <Text style={styles.temperature}>
                    {Math.round(weatherData.temp)}°C
                  </Text>
                  <Text style={styles.weatherDescription}>
                    {getWeatherDescription(weatherData.weatherCode)}
                  </Text>
                </View>
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.detailLabel}>
                      {t('humidity').toUpperCase()}
                    </Text>
                    <Text style={styles.detailValue}>
                      {weatherData.humidity}%
                    </Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.detailLabel}>
                      {t('wind_speed').toUpperCase()}
                    </Text>
                    <Text style={styles.detailValue}>
                      {Math.round(weatherData.windSpeed)} km/h
                    </Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.detailLabel}>
                      {t('location').toUpperCase()}
                    </Text>
                    <Text style={styles.detailValue}>
                      {location?.address || 'Unknown'}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.weatherEmpty}>
                <Feather name="cloud" size={36} color="white" />
                <Text style={styles.weatherEmptyText}>
                  {location?.address
                    ? 'Weather data unavailable'
                    : t('fetching_weather')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
