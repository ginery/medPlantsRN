import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MainStackNavigator} from './StackNavigation';
import Sidebar from './Sidebar';
const Drawer = createDrawerNavigator();
const DrawerNavigation = props => {
  // this is the active route
  return (
    // drawerContent={props => <Sidebar {...props} />}
    //useLegacyImplementation -> add this to <Drawer.Navigation if using higher or latest version
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={props => <Sidebar {...props} />}>
      <Drawer.Screen
        style={{
          color: 'red',
        }}
        name="Home"
        component={MainStackNavigator}
        options={({route, navigation}) => ({
          drawerIcon: config => <Icon name="home" size={22} color="white" />,
          headerShown: false,
          swipeEdgeWidth: 0,
          drawerActiveTintColor: 'white',
          drawerActiveBackgroundColor: '#257f3a',
        })}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;
