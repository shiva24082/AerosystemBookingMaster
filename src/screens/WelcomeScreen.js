import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ka', label: 'Kannada' },
  { code: 'ma', label: 'Marathi' },
  { code: 'pu', label: 'Punjabi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setModalVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  const changeLanguage = lang => {
    i18n.changeLanguage(lang);
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate('Otp');
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.welcomeText1}>{t('welcome1') || 'Welcome to'}</Text>
        <Text style={styles.welcomeText2}>{t('welcome2') || 'AeroSystem'}</Text>
      </Animated.View>

      {/* Language Selection Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('change_language') || 'Change Language'}
            </Text>

            <FlatList
              data={languages}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => setSelectedLanguage(item.code)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radio,
                        selectedLanguage === item.code && styles.radioSelected,
                      ]}
                    >
                      {selectedLanguage === item.code && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text style={styles.languageText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => changeLanguage(selectedLanguage)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A4D99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: '#2F6AAE',
    marginRight: -64,
    marginTop: -64,
  },
  circle2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#2F6AAE',
    marginLeft: -48,
    marginBottom: -48,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
  },
  welcomeText1: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  welcomeText2: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;
