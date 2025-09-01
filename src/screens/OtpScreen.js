import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const OtpScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (mobileNumber.length < 10) {
      Alert.alert(
        'Invalid number',
        'Please enter a valid 10-digit mobile number',
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setIsOtpSent(true);
      setLoading(false);
      Alert.alert('Success', 'OTP sent to your mobile number');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter a valid OTP');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (otp === '1234') {
        Alert.alert('Success', 'OTP verified successfully');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  const handleResendOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'OTP resent to your mobile number');
    }, 1000);
  };

  return (
    <View style={styles.container}>
    
      <Text style={styles.appName}>AeroSystem</Text>
      <Text style={styles.greeting}>{t('greeting') || 'Hello'}</Text>
      <Text style={styles.subtitle}>
        {t('login_continue') || 'Login to continue'}
      </Text>

  
      <Text style={styles.label}>
        {t('enter_mobile') || 'Enter Mobile Number'}
      </Text>
      <View style={styles.mobileInputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.mobileInput}
          placeholder={
            t('enter_mobile_placeholder') || 'Enter your mobile number'
          }
          keyboardType="phone-pad"
          maxLength={10}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          editable={!isOtpSent}
        />
      </View>

  
      {!isOtpSent && (
        <TouchableOpacity
          style={[
            styles.button,
            (loading || mobileNumber.length < 10) && styles.buttonDisabled,
          ]}
          onPress={handleSendOtp}
          disabled={loading || mobileNumber.length < 10}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>{t('send_otp') || 'Send OTP'}</Text>
          )}
        </TouchableOpacity>
      )}


      {isOtpSent && (
        <>
          <Text style={styles.label}>{t('enter_otp') || 'Enter OTP'}</Text>
          <TextInput
            style={styles.otpInput}
            placeholder={t('enter_otp_placeholder') || 'Enter OTP'}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading || otp.length < 4) && styles.buttonDisabled,
            ]}
            onPress={handleVerifyOtp}
            disabled={loading || otp.length < 4}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>{t('verify') || 'Verify'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
            <Text style={styles.resendText}>
              {t('resend_otp') || 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 32,
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#3b82f6',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButton: {
    backgroundColor: '#10b981',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#3b82f6',
    fontSize: 14,
  },
});

export default OtpScreen;
