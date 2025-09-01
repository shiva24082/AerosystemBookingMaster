import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BottomDrawer from '../components/BottomDrawer';

const MoreScreen = () => {
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(prev => !prev);
  };

  const drawerOptions = [
    { name: 'Settings', icon: 'settings', route: 'Settings' },
    {
      name: 'BES',
      iconType: 'image',
      imagePath: require('../../assets/images/logo.png'),
      route: 'BES',
      iconStyle: { backgroundColor: 'black', borderRadius: 100, padding: 5 },
    },
    { name: 'Coupons', icon: 'local-offer', route: 'Coupons' },
    { name: 'Buy a Drone', icon: 'shopping-cart', route: 'BuyDrone' },
  ];

  const handleOptionPress = route => {
    setDrawerVisible(false);
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>More Options</Text>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.optionIcon}>
            <Icon name="settings" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.optionIcon}>
            <Icon name="person" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Language')}
        >
          <View style={styles.optionIcon}>
            <Icon name="language" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>Language Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('Invite')}
        >
          <View style={styles.optionIcon}>
            <Icon name="person-add" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>Invite a Friend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => navigation.navigate('About')}
        >
          <View style={styles.optionIcon}>
            <Icon name="info" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={toggleDrawer}>
          <View style={styles.optionIcon}>
            <Icon name="more-horiz" size={24} color="#4F4F4F" />
          </View>
          <Text style={styles.optionText}>More Options</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionItem, styles.logoutItem]}
          onPress={() =>
            Alert.alert('Logout', 'Are you sure you want to logout?')
          }
        >
          <View style={[styles.optionIcon, styles.logoutIcon]}>
            <Icon name="logout" size={24} color="#FF3B30" />
          </View>
          <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomDrawer
        visible={drawerVisible}
        onClose={toggleDrawer}
        options={drawerOptions}
        onOptionPress={handleOptionPress}
        style={styles.drawer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutIcon: {
    backgroundColor: '#FFECEC',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  drawer: {
    width: '80%',
    height: '70%',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: '10%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
});

export default MoreScreen;
