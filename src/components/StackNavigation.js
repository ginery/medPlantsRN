import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from '../screens/LandingScreen';
import Login from '../screens/Login';
import TabViewScreen from '../screens/TabMenu';
import ProfileScreen from '../screens/Profile';
import RegisterScreen from '../screens/Register';
import HomeScreen from '../screens/HomeScreen';
import PlantsScreen from '../screens/Plants';
import HealthAssessmentScreen from '../screens/HealthAssessment';
import HealthAssessmentListScreen from '../screens/HealthAssessmentList';
import PlantListScreen from '../screens/PlantsList';
import CurableDiseasesScreen from '../screens/CurableDiseases';
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
        name="Home Screen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Plants"
        component={PlantsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Health Assessment"
        component={HealthAssessmentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Health Assessment List"
        component={HealthAssessmentListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Plant List"
        component={PlantListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Curable Diseases"
        component={CurableDiseasesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
export {MainStackNavigator};
