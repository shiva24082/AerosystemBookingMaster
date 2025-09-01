import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocationProvider } from './src/hooks/LocationContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/i18n';


import TabNavigator from './src/navigation/TabNavigator';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OtpScreen from './src/screens/OtpScreen';
import LocationScreen from './src/screens/LocationScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import FieldLocationScreen from './src/screens/FieldLocationScreen';
import SprayingScreen from './src/screens/SprayingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import InviteScreen from './src/screens/InviteScreen';
import AboutScreen from './src/screens/AboutScreen';
import BESScreen from './src/screens/BESScreen';
import BuyDroneScreen from './src/screens/BuyDroneScreen';
import CouponsScreen from './src/screens/CouponsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const checkAuthStatus = async () => {
    
      setTimeout(() => {
        setIsLoading(false);
        setUser({ name: 'User' }); 
      }, 1000);
    };

    checkAuthStatus();
  }, [setUser]);

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <LocationProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {user ? (
                <>
                  <Stack.Screen name="MainTabs" component={TabNavigator} />
                  <Stack.Screen name="Location" component={LocationScreen} />
                  <Stack.Screen
                    name="Notification"
                    component={NotificationScreen}
                  />
                  <Stack.Screen
                    name="FieldLocation"
                    component={FieldLocationScreen}
                  />
                  <Stack.Screen name="Spraying" component={SprayingScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen name="Language" component={LanguageScreen} />
                  <Stack.Screen name="Invite" component={InviteScreen} />
                  <Stack.Screen name="About" component={AboutScreen} />
                  <Stack.Screen name="BES" component={BESScreen} />
                  <Stack.Screen name="BuyDrone" component={BuyDroneScreen} />
                  <Stack.Screen name="Coupons" component={CouponsScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="Otp" component={OtpScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </LocationProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}