import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

const BuyDroneScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          });
        });
        setLocation(position);
      } catch (error) {
        setErrorMsg('Permission to access location was denied');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buy a Drone</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/622/622669.png',
            }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for manufactures..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Drone Image */}
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fJWEVg4enh/326gvd4i_expires_30_days.png',
          }}
          resizeMode="stretch"
          style={styles.droneImage}
        />

        <Text style={styles.noManufacturersText}>
          No manufacturers right now
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    shadowColor: '#0000001F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  droneImage: {
    width: 294,
    height: 168,
    marginBottom: 29,
    marginTop: 80,
    alignSelf: 'center',
  },
  noManufacturersText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default BuyDroneScreen;
