import * as React from 'react';
import {View, useWindowDimensions, Alert, TouchableOpacity} from 'react-native';
import {NativeBaseProvider, Center, Spinner} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
// import {useNavigation} from '@react-navigation/native';
export default function LandingScreen({navigation}) {
  // const navigation = useNavigation();
  // React.useEffect(() => {
  //   retrieveData();
  // }, [1]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      retrieveData();
    });

    return unsubscribe;
  }, [navigation]);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        if (value.category == 'U') {
          console.log('user');
          navigation.navigate('Home Screen');
        }
      } else {
        console.log('login');
        // navigate('Login');
        navigation.navigate('Login');
      }

      //setUserID(value.user_fname);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        {/* <Spinner accessibilityLabel="Loading posts" size="lg" color="#28a745" /> */}
        <DotIndicator color="#28a745" count={4} />
      </Center>
    </NativeBaseProvider>
  );
}
