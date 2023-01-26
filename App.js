import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './src/components/DrawerNavigation';
import {NativeBaseProvider, Text} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {navigationRef} from './src/components/RootNavigation';
import * as RootNavigation from './src/components/RootNavigation';
// import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
// Geolocation.getCurrentPosition(info => console.log(info));
import Geolocation from 'react-native-geolocation-service';

// local connection
window.name = 'http://192.168.87.94/medplant/mobile/';
// online connection
// window.name = 'https://juancoder.com/medplants/mobile/';
global.global_image = 'http://192.168.87.94/medplant/vendors/assessment/';

export default function App() {
  React.useEffect(() => {
    // requestLocationPermission();
  }, [1]);
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(info => console.log(info));
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <NativeBaseProvider>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
