import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../constants/firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    occupation: '',
    phone: '',
    dob: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'users', 'defaultUser');

    const unsubscribe = onSnapshot(
      docRef,
      docSnap => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setDoc(
            docRef,
            {
              name: '',
              occupation: '',
              phone: '',
              dob: '',
            },
            { merge: true },
          );
        }
        setLoading(false);
      },
      error => {
        console.error('Error listening to profile updates:', error);
        Alert.alert('Error', 'Failed to sync profile data.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'users', 'defaultUser');
      await setDoc(docRef, profile, { merge: true });
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data.');
    } finally {
      setLoading(false);
    }
  };

  const ProfileItem = ({
    icon,
    value,
    editable,
    onChangeText,
    placeholder,
  }) => {
    return (
      <View style={styles.item}>
        <Icon name={icon} size={20} color="#333" style={styles.icon} />
        {editable ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            editable={editable}
          />
        ) : (
          <Text style={styles.label}>{value || placeholder}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <TouchableOpacity onPress={isEditing ? saveProfile : toggleEdit}>
          <Text style={styles.editText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <>
          {/* Profile Fields */}
          <ProfileItem
            icon="person-outline"
            placeholder="Name"
            value={profile.name}
            editable={isEditing}
            onChangeText={val => handleChange('name', val)}
          />
          <ProfileItem
            icon="briefcase-outline"
            placeholder="Occupation"
            value={profile.occupation}
            editable={isEditing}
            onChangeText={val => handleChange('occupation', val)}
          />
          <ProfileItem
            icon="call-outline"
            placeholder="Phone Number"
            value={profile.phone}
            editable={isEditing}
            onChangeText={val => handleChange('phone', val)}
          />
          <ProfileItem
            icon="calendar-outline"
            placeholder="Date of Birth"
            value={profile.dob}
            editable={isEditing}
            onChangeText={val => handleChange('dob', val)}
          />
        </>
      )}

      {/* Static Options */}
      <View style={styles.item}>
        <Icon name="power-outline" size={20} style={styles.icon} />
        <Text style={styles.label}>Logout My Account</Text>
      </View>

      <View style={styles.item}>
        <Icon name="trash-outline" size={20} style={styles.icon} />
        <Text style={styles.label}>Delete Account</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  editText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 15,
    width: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
    color: '#000',
  },
  loader: {
    marginVertical: 20,
  },
});

export default ProfileScreen;
