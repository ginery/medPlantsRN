import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import Login from '../screens/Login';
import TabViewScreen from '../screens/TabMenu';
import ProfileScreen from '../screens/Profile';
import RegisterScreen from '../screens/Register';
import BookScreen from '../screens/Book';
import MapWatchScreen from '../screens/MapWatch';
import TabMenuDriverScreen from '../screens/TabMenuDriver';
import DriverMapWatchScreen from '../screens/DriverMapWatch';
const Stack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tab View"
        component={TabViewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Book"
        component={BookScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Map Watch"
        component={MapWatchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Tab View Driver"
        component={TabMenuDriverScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Driver Map Watch"
        component={DriverMapWatchScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export {MainStackNavigator};
