import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const BESScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BES</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fJWEVg4enh/4fx7e8mh_expires_30_days.png',
            }}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.comingSoon}>We are coming soon.</Text>
        </View>

        <Text style={styles.footerText}>
          We are coming with BES app soon.{'\n'}Stay tuned.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 18,
  },
  logo: {
    width: 110,
    height: 121,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  comingSoon: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  footerText: {
    color: '#847D7D',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
});

export default BESScreen;
