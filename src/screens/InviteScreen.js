import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const InviteScreen = () => {
  const navigation = useNavigation();

  const shareMessage = async () => {
    try {
      await Share.share({
        message:
          'Join this app using my code and get discount coupons! Download now: https://yourapp.com/referral-code',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Invite Your Friend</Text>
        <Text style={styles.subtitle}>
          Refer a friend and get Discount Coupons!
        </Text>

        <Image
          source={require('../../assets/images/invite.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.description}>
          Just share this code with your friends to sign up and get discount
          coupons. You can refer 10 friends.
        </Text>

        {/* Sharing Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#25D366' }]}
            onPress={shareMessage}
          >
            <Icon name="logo-whatsapp" size={24} color="white" />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF9500' }]}
            onPress={shareMessage}
          >
            <Icon name="chatbubble-ellipses-outline" size={24} color="white" />
            <Text style={styles.buttonText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#7B8FA1' }]}
            onPress={shareMessage}
          >
            <Icon name="share-social" size={24} color="white" />
            <Text style={styles.buttonText}>Share to...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 180,
    marginVertical: 20,
  },
  description: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: 90,
    height: 90,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default InviteScreen;
