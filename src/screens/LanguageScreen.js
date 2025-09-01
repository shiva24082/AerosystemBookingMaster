import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const LanguageScreen = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'ka', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ma', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'pu', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  ];

  const filteredLanguages = languages.filter(
    lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#8e8e93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchLanguages') || 'Search languages'}
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>
          {t('selectPreferredLanguage') || 'Select Preferred Language'}
        </Text>
        <Text style={styles.subtitle}>
          {t('languageSelectionDescription') ||
            'Choose the language you prefer to use in the app'}
        </Text>

        <View style={styles.languagesContainer}>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageButton,
                  i18n.language === language.code && styles.selectedLanguage,
                ]}
                onPress={() => changeLanguage(language.code)}
              >
                <View style={styles.languageContent}>
                  <View>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.languageNativeName}>
                      {language.nativeName}
                    </Text>
                  </View>
                  {i18n.language === language.code && (
                    <Icon name="check" size={24} color="#007AFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Icon name="error-outline" size={24} color="#8e8e93" />
              <Text style={styles.noResultsText}>
                {t('noLanguagesFound') || 'No languages found'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1c1c1e',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1c1c1e',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 24,
    color: '#636366',
    lineHeight: 22,
  },
  languagesContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  languageButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5ea',
  },
  selectedLanguage: {
    backgroundColor: '#f5f5f7',
  },
  languageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 17,
    color: '#1c1c1e',
    fontWeight: '500',
  },
  languageNativeName: {
    fontSize: 15,
    color: '#636366',
    marginTop: 2,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  noResultsText: {
    marginLeft: 8,
    color: '#8e8e93',
    fontSize: 16,
  },
});

export default LanguageScreen;
