import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../constants/firebase';

const { width, height } = Dimensions.get('window');

const RequestsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeDateInput, setActiveDateInput] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const statusOptions = [
    'Pending',
    'Accepted',
    'In Progress',
    'Completed',
    'Rejected',
    'Canceled',
    'Out of Service',
    'Rescheduled',
    'Placed',
    'Paid',
    'On Hold',
  ];

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const requestsCollection = collection(db, 'sprayRequests');
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsList = [];
      requestsSnapshot.forEach(doc => {
        const data = doc.data();
        requestsList.push({
          id: doc.id,
          address: data.address,
          acres: data.acres,
          numberOfTanks: data.numberOfTanks,
          tanksToSpray: data.tanksToSpray,
          sprayingDate: data.sprayingDate,
          agrochemical: data.agrochemical,
          crop: data.crop,
          price: data.price,
          status: data.status,
          createdAt: data.createdAt,
        });
      });
      setRequests(requestsList);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert(t('error'), t('failed_to_load_requests'));
    } finally {
      setLoadingRequests(false);
    }
  }, [t]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  }, [fetchRequests]);

  const handleRequestPress = request => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleUpdateStatus = useCallback(
    async (id, newStatus) => {
      try {
        const requestDocRef = doc(db, 'sprayRequests', id);
        await updateDoc(requestDocRef, { status: newStatus });
        const updatedRequests = requests.map(req =>
          req.id === id ? { ...req, status: newStatus } : req,
        );
        setRequests(updatedRequests);
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
        Alert.alert(
          t('success'),
          `${t('request_status_updated')} ${newStatus}`,
        );
      } catch (error) {
        console.error('Error updating request status:', error);
        Alert.alert(t('error'), t('failed_to_update_status'));
      }
    },
    [requests, selectedRequest, t],
  );

  const getStatusStyle = status => {
    const styles = {
      Pending: { backgroundColor: '#eab308' },
      Accepted: { backgroundColor: '#3b82f6' },
      'In Progress': { backgroundColor: '#6366f1' },
      Completed: { backgroundColor: '#10b981' },
      Rejected: { backgroundColor: '#ef4444' },
      Canceled: { backgroundColor: '#6b7280' },
      'Out of Service': { backgroundColor: '#f97316' },
      Rescheduled: { backgroundColor: '#8b5cf6' },
      Placed: { backgroundColor: '#14b8a6' },
      Paid: { backgroundColor: '#059669' },
      'On Hold': { backgroundColor: '#ec4899' },
    };
    return styles[status] || { backgroundColor: '#6b7280' };
  };

  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t('invalid_date');
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return t('invalid_date');
    }
  };

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.requestItem}
      onPress={() => handleRequestPress(item)}
    >
      <View style={styles.requestContent}>
        <View style={styles.requestInfo}>
          <Text style={styles.requestTitle}>{item.crop} Spraying</Text>
          <Text style={styles.requestAddress}>{item.address}</Text>
          <Text style={styles.requestDate}>
            Date: {formatDate(item.sprayingDate)}
          </Text>
          <Text style={styles.requestArea}>Area: {item.acres} acres</Text>
        </View>
        <View style={styles.requestStatus}>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.requestPrice}>₹{item.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcon name="information-outline" size={48} color="#9ca3af" />
      <Text style={styles.emptyText}>
        {searchQuery.trim() || filterStatus || filterStartDate || filterEndDate
          ? t('no_requests_match_filters')
          : t('no_spray_requests_found')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Spraying')}
      >
        <Text style={styles.emptyButtonText}>{t('create_new_request')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={26} color="#374151" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{t('my_spray_requests')}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterButton}
        >
          <View style={styles.filterIcon}>
            <Icon name="filter-outline" size={20} color="white" />
            {(filterStatus ||
              filterStartDate ||
              filterEndDate ||
              searchQuery) && <View style={styles.filterBadge} />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon
            name="search-outline"
            size={22}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_requests_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loadingRequests && requests.length === 0 ? (
        <View style={styles.loadingContainer}>
          <MaterialIcon
            name="tractor-variant"
            size={48}
            color="#3b82f6"
            style={styles.loadingIcon}
          />
          <Text style={styles.loadingText}>{t('loading_requests')}</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!loadingRequests ? renderEmptyList : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor={'#3b82f6'}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Spraying')}
      >
        <AntDesign name="plus" size={26} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 20,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: '#ef4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  requestItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  requestInfo: {
    flex: 1,
    marginRight: 12,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  requestAddress: {
    color: '#6b7280',
    marginBottom: 4,
    fontSize: 14,
  },
  requestDate: {
    color: '#6b7280',
    marginBottom: 4,
    fontSize: 14,
  },
  requestArea: {
    color: '#6b7280',
    fontSize: 14,
  },
  requestStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  requestPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f3f4f6',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default RequestsScreen;
