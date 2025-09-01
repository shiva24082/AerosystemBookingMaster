import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BottomDrawer = ({ visible, onClose, options, onOptionPress, style }) => {
  const handleOptionPress = (route) => {
    if (onOptionPress) {
      onOptionPress(route);
    }
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={[styles.modal, style]}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Options</Text>
          <View style={styles.optionsGrid}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => handleOptionPress(option.route)}
              >
                {option.iconType === 'image' ? (
                  <View style={[styles.logoBackground, option.iconStyle]}>
                    <Image
                      source={option.imagePath}
                      style={styles.logo}
                    />
                  </View>
                ) : (
                  <View style={styles.iconContainer}>
                    <Icon name={option.icon} size={24} color="black" />
                  </View>
                )}
                <Text style={styles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
    maxHeight: '50%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBackground: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BottomDrawer;