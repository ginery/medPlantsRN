import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Container,
  Avatar,
} from 'native-base';
import {Alert, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Sidebar({...props}) {
  React.useEffect(() => {
    retrieveData();
  });
  const [user_id, setUserID] = React.useState();
  const [user_fname, setUserFname] = React.useState();
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      //console.log(valueString);
      //console.log('test1');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserID(value.user_id);
        setUserFname(value.user_fname);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        style={
          {
            //  borderColor: 'black',
            //   borderWidth: 1,
          }
        }
        overflow="hidden"
        shadow={1}
        _light={{backgroundColor: 'white'}}
        _dark={{backgroundColor: 'gray.700'}}>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Center>
              <Avatar
                style={{
                  borderWidth: 3,
                  borderColor: 'white',
                }}
                bg="indigo.500"
                alignSelf="center"
                size="2xl"
                source={require('../assets/images/profile.jpg')}>
                RS
              </Avatar>
              <Heading size="md" ml="-1">
                {user_fname}
              </Heading>
            </Center>
          </Stack>
        </Stack>
      </Box>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Health Assessment"
          onPress={() => {
            props.navigation.navigate('Plants');
          }}
          icon={() => <Icon name="list" size={22} color="#257f3a" />}
        />
        <DrawerItem
          label="Plants"
          onPress={() => {
            props.navigation.navigate('Plants');
          }}
          icon={() => <Icon name="seedling" size={22} color="#257f3a" />}
        />
        <DrawerItem
          label="Profile"
          onPress={() => {
            props.navigation.navigate('Profile');
          }}
          // inactiveTintColor="#257f3a"
          icon={() => <Icon name="user" size={22} color="#257f3a" />}
        />
        <DrawerItem
          label="Sign Out"
          onPress={() => {
            AsyncStorage.clear();
            props.navigation.navigate('Landing');
          }}
          icon={() => <Icon name="sign-out-alt" size={22} color="#257f3a" />}
        />
      </DrawerContentScrollView>
    </>
  );
}
