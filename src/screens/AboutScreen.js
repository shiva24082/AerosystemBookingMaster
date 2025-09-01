import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();

  const handleOkPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App</Text>
            <Text style={styles.infoValue}>BluhMeet</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>49</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>74.128.2025022102</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>21 Feb 2025</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Copyright</Text>
            <Text style={styles.infoValue}>PGRL</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBackground: {
    backgroundColor: '#0066cc',
    borderRadius: 100,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  logo: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  okButton: {
    backgroundColor: '#0066cc',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  okButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AboutScreen;
