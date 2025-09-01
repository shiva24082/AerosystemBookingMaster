import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../constants/firebase';

const ALL_CROPS = [
  'Arecanut',
  'Bajra',
  'Banana',
  'Barley',
  'Black Pepper',
  'Brinjal',
  'Cabbage',
  'Cardamom',
  'Cashew Nut',
  'Castor seed',
  'Cauliflower',
  'Chilli',
  'Coconut',
  'Coffee',
  'Cotton',
  'Cucumber',
  'Garlic',
  'Ginger',
  'Gram',
  'Grapes',
  'Groundnut',
  'Jowar',
  'Jute',
  'Lentil',
  'Maize',
  'Mango',
  'Mustard',
  'Onion',
  'Orange',
  'Paddy',
  'Pea',
  'Potato',
  'Ragi',
  'Rapeseed',
  'Rice',
  'Rubber',
  'Safflower',
  'Soyabean',
  'Sugarcane',
  'Sunflower',
  'Tea',
  'Tomato',
  'Turmeric',
  'Wheat',
];

const StepIcon = ({ icon }) => <View style={styles.stepIcon}>{icon}</View>;

const SprayingScreen = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    address: 'Nashik',
    acres: '',
    numberOfTanks: '',
    tanksToSpray: '3',
    sprayingDate: '13/03/2025',
    agrochemical: 'Insecticide',
    crop: 'Bajra',
    coupon: '',
  });

  const [finalPrice, setFinalPrice] = useState(1500.0);
  const [couponError, setCouponError] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCrops(ALL_CROPS);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCrops(
        ALL_CROPS.filter(crop => crop.toLowerCase().includes(query)),
      );
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredCrops(ALL_CROPS);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateRequest = async () => {
    if (
      !formData.acres ||
      !formData.numberOfTanks ||
      !formData.tanksToSpray ||
      !formData.sprayingDate
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const newRequest = {
        ...formData,
        price: finalPrice,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'sprayRequests'), newRequest);

      Alert.alert('Success', 'Request created successfully!');
      navigation.navigate('Requests', { refresh: true });
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Error', 'Failed to create request. Please try again.');
    }
  };

  const handleCouponApply = () => {
    const coupon = formData.coupon.trim();
    if (coupon === 'DISCOUNT10') {
      setFinalPrice(prev => prev - prev * 0.1);
      setCouponError('');
      Alert.alert('Success', '10% discount applied!');
    } else if (coupon === 'DISCOUNT20') {
      setFinalPrice(prev => prev - prev * 0.2);
      setCouponError('');
      Alert.alert('Success', '20% discount applied!');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleSelectCrop = crop => {
    handleInputChange('crop', crop);
    setShowCropModal(false);
  };

  const renderCropItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cropItem}
      onPress={() => handleSelectCrop(item)}
    >
      <Text style={styles.cropText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showCropModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Crops</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your crops..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <FlatList
              data={filteredCrops}
              renderItem={renderCropItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.cropList}
            />
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="location-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>Tell us your address</Text>
            </View>
            <TextInput
              placeholder="Enter address"
              style={styles.input}
              value={formData.address}
              onChangeText={text => handleInputChange('address', text)}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="leaf-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>How many acres?</Text>
            </View>
            <TextInput
              placeholder="Enter acres"
              keyboardType="numeric"
              style={styles.input}
              value={formData.acres}
              onChangeText={text => handleInputChange('acres', text)}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="cube-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>Number of Tanks</Text>
            </View>
            <TextInput
              placeholder="Enter number of tanks"
              keyboardType="numeric"
              style={styles.input}
              value={formData.numberOfTanks}
              onChangeText={text => handleInputChange('numberOfTanks', text)}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="water-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>Tanks to Spray</Text>
            </View>
            <TextInput
              placeholder="Enter tanks to spray"
              keyboardType="numeric"
              style={styles.input}
              value={formData.tanksToSpray}
              onChangeText={text => handleInputChange('tanksToSpray', text)}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="calendar-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>Spraying Date</Text>
            </View>
            <TextInput
              placeholder="Enter date (DD/MM/YYYY)"
              style={styles.input}
              value={formData.sprayingDate}
              onChangeText={text => handleInputChange('sprayingDate', text)}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon icon={<Icon name="leaf" size={14} color="white" />} />
              <Text style={styles.sectionTitle}>Select Crop</Text>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCropModal(true)}
            >
              <Text style={{ fontSize: 16, color: '#374151' }}>
                {formData.crop}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <StepIcon
                icon={<Icon name="pricetag-outline" size={14} color="white" />}
              />
              <Text style={styles.sectionTitle}>Coupon</Text>
            </View>
            <TextInput
              placeholder="Enter coupon code"
              style={styles.input}
              value={formData.coupon}
              onChangeText={text => handleInputChange('coupon', text)}
            />
            {couponError ? (
              <Text style={{ color: 'red', marginTop: 8 }}>{couponError}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleCouponApply}
            >
              <Text style={styles.applyButtonText}>Apply Coupon</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.finalPrice}>
              Final Price: ₹{finalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={handleCreateRequest}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  scrollContent: { paddingBottom: 20 },
  formContainer: { backgroundColor: 'white' },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: { fontSize: 14, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  applyButton: {
    marginTop: 8,
    backgroundColor: '#10b981',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
  },
  applyButtonText: { color: 'white', fontSize: 14, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  modalClose: { color: '#6b7280', fontSize: 16 },
  searchContainer: { padding: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#374151' },
  cropList: { padding: 16 },
  cropItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cropText: { fontSize: 16, color: '#374151' },
});

export default SprayingScreen;
