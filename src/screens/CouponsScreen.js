import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Sample coupon data
const SAMPLE_COUPONS = [
  {
    id: '1',
    code: 'AGRIDRONE25',
    discount: '25% OFF',
    description: 'Get 25% off on any AgriTech drone purchase',
    validUntil: '2025-06-15',
    type: 'percent',
    brand: 'AgriTech Solutions',
    logo: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isUsed: false,
    minPurchase: '₹50,000',
    maxDiscount: '₹25,000',
  },
  {
    id: '2',
    code: 'CROPSPRAY10K',
    discount: '₹10,000 OFF',
    description: 'Flat ₹10,000 off on CropSpray 3000 drone',
    validUntil: '2025-05-30',
    type: 'fixed',
    brand: 'FarmDrone Inc.',
    logo: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isUsed: false,
    minPurchase: 'None',
    maxDiscount: 'N/A',
  },
  {
    id: '3',
    code: 'MONSOON500',
    discount: '₹500 OFF',
    description: 'Discount on spare parts and accessories for all drones',
    validUntil: '2025-07-31',
    type: 'fixed',
    brand: 'AgroFly',
    logo: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isUsed: false,
    minPurchase: '₹2,000',
    maxDiscount: 'N/A',
  },
  {
    id: '4',
    code: 'FERTILIZE100',
    discount: '₹100 OFF',
    description: 'Discount on first spraying service booking',
    validUntil: '2025-05-15',
    type: 'fixed',
    brand: 'PestAway',
    logo: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isUsed: true,
    minPurchase: 'None',
    maxDiscount: 'N/A',
  },
];

const CouponsScreen = () => {
  const navigation = useNavigation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'used'

  useEffect(() => {
    // Simulate API call to fetch coupons
    const fetchCoupons = async () => {
      setLoading(true);
      // Simulating network request
      setTimeout(() => {
        setCoupons(SAMPLE_COUPONS);
        setLoading(false);
      }, 1200);
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = coupon => {
    Alert.alert(
      'Apply Coupon',
      `Do you want to apply coupon ${coupon.code} for ${coupon.discount}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Apply',
          onPress: () => {
            Alert.alert(
              'Success',
              `Coupon ${coupon.code} has been applied to your cart.`,
            );
            navigation.navigate('BuyDrone');
          },
        },
      ],
    );
  };

  const handleCopyCouponCode = code => {
    Alert.alert('Copied', `Coupon code ${code} copied to clipboard`);
  };

  const filteredCoupons = coupons.filter(coupon =>
    activeTab === 'available' ? !coupon.isUsed : coupon.isUsed,
  );

  const getExpiryStatus = validUntil => {
    const expiryDate = new Date(validUntil);
    const currentDate = new Date();
    const daysRemaining = Math.floor(
      (expiryDate - currentDate) / (1000 * 60 * 60 * 24),
    );

    if (daysRemaining < 0) return { text: 'Expired', color: '#FF5252' };
    if (daysRemaining < 5)
      return { text: `Expires in ${daysRemaining} days`, color: '#FF9800' };
    return {
      text: `Valid until ${new Date(validUntil).toLocaleDateString()}`,
      color: '#4CAF50',
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your coupons...</Text>
        </View>
      );
    }

    if (filteredCoupons.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcon
            name="ticket-percent-outline"
            size={120}
            color="#4CAF50"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>
            {activeTab === 'available'
              ? 'No Available Coupons'
              : 'No Used Coupons'}
          </Text>
          <Text style={styles.emptyText}>
            {activeTab === 'available'
              ? "You don't have any available coupons at the moment."
              : "You haven't used any coupons yet."}
          </Text>

          {activeTab === 'available' && (
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('BuyDrone')}
            >
              <Text style={styles.exploreButtonText}>Explore Products</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'available'
            ? `Available Coupons (${filteredCoupons.length})`
            : `Used Coupons (${filteredCoupons.length})`}
        </Text>

        {filteredCoupons.map(coupon => {
          const expiryStatus = getExpiryStatus(coupon.validUntil);

          return (
            <View key={coupon.id} style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <Image source={{ uri: coupon.logo }} style={styles.brandLogo} />
                <View style={styles.couponHeaderInfo}>
                  <Text style={styles.brandName}>{coupon.brand}</Text>
                  <Text
                    style={[styles.expiryText, { color: expiryStatus.color }]}
                  >
                    {expiryStatus.text}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => handleCopyCouponCode(coupon.code)}
                >
                  <MaterialIcons name="content-copy" size={16} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.couponBody}>
                <View style={styles.discountSection}>
                  <Text style={styles.discountText}>{coupon.discount}</Text>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeText}>{coupon.code}</Text>
                  </View>
                </View>

                <Text style={styles.descriptionText}>{coupon.description}</Text>

                <View style={styles.termsContainer}>
                  {coupon.minPurchase !== 'None' && (
                    <View style={styles.termItem}>
                      <MaterialIcons
                        name="shopping-cart"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.termText}>
                        Min: {coupon.minPurchase}
                      </Text>
                    </View>
                  )}

                  {coupon.maxDiscount !== 'N/A' && (
                    <View style={styles.termItem}>
                      <MaterialIcons
                        name="local-offer"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.termText}>
                        Max: {coupon.maxDiscount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {activeTab === 'available' && (
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => handleApplyCoupon(coupon)}
                >
                  <Text style={styles.applyButtonText}>Apply Coupon</Text>
                </TouchableOpacity>
              )}

              {activeTab === 'used' && (
                <View style={styles.usedStamp}>
                  <Text style={styles.usedStampText}>USED</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Coupons</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'available' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'available' && styles.activeTabButtonText,
            ]}
          >
            Available
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'used' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('used')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'used' && styles.activeTabButtonText,
            ]}
          >
            Used
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginRight: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: '80%',
  },
  exploreButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    elevation: 2,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    position: 'relative',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  couponHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  expiryText: {
    fontSize: 12,
    marginTop: 2,
  },
  copyButton: {
    padding: 8,
  },
  couponBody: {
    padding: 16,
  },
  discountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discountText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
  },
  codeContainer: {
    backgroundColor: '#f2f9f3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0efe0',
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  termText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  usedStamp: {
    position: 'absolute',
    top: 20,
    right: -30,
    backgroundColor: 'rgba(255, 82, 82, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 40,
    transform: [{ rotate: '45deg' }],
  },
  usedStampText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default CouponsScreen;
