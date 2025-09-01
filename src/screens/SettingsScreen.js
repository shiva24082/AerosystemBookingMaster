import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const SettingItem = ({ icon, title, subtitle, onPress }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        {icon}
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <SettingItem
          icon={<Feather name="user" size={24} color="#333" />}
          title="Profile"
          onPress={() => navigation.navigate('Profile')}
        />
        <SettingItem
          icon={<Icon name="language" size={24} color="#333" />}
          title="Language Settings"
          subtitle="English"
          onPress={() => navigation.navigate('Language')}
        />
        <SettingItem
          icon={<Feather name="user-plus" size={24} color="#333" />}
          title="Invite a Friend"
          onPress={() => navigation.navigate('Invite')}
        />
        <SettingItem
          icon={
            <Icon name="information-circle-outline" size={24} color="#333" />
          }
          title="About"
          onPress={() => navigation.navigate('About')}
        />
        <SettingItem
          icon={<MaterialIcon name="policy" size={24} color="#333" />}
          title="Privacy Policy"
        />
        <SettingItem
          icon={<MaterialIcon name="description" size={24} color="#333" />}
          title="Terms and Conditions"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  list: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});

export default SettingsScreen;
