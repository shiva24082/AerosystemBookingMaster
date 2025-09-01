import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Notification Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Today</Text>
        <TouchableOpacity>
          <Text style={styles.markAllText}>Mark as all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Empty State with bell icon */}
        <View style={styles.emptyContainer}>
          <View style={styles.bellIcon}>
            <Icon name="notifications-none" size={36} color="#666" />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>
            When you receive notifications, they'll appear here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    color: '#6b7280',
    fontSize: 14,
  },
  markAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  bellIcon: {
    backgroundColor: '#f3f4f6',
    borderRadius: 40,
    padding: 24,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationScreen;
