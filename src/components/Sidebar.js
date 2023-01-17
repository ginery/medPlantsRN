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
} from 'native-base';
import {Alert, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Sidebar({...props}) {
  // React.useEffect(() => {
  //   retrieveData();
  // });
  // const [user_id, setUserID] = React.useState();
  // const [user_fname, setUserFname] = React.useState();
  // const retrieveData = async () => {
  //   try {
  //     const valueString = await AsyncStorage.getItem('user_details');
  //     //console.log(valueString);
  //     //console.log('test1');
  //     if (valueString != null) {
  //       const value = JSON.parse(valueString);
  //       setUserID(value.user_id);
  //       setUserFname(value.user_fname);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
        _light={{backgroundColor: '#54b5df'}}
        _dark={{backgroundColor: 'gray.700'}}>
        <Box>
          <AspectRatio ratio={16 / 9}>
            <Image
              source={require('../assets/images/tri_sakay_logo.png')}
              alt="image"
            />
          </AspectRatio>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Heading size="md" ml="-1">
              TriSakay
            </Heading>

            <HStack>
              <Text
                fontSize="sm"
                _light={{color: 'orange.500'}}
                _dark={{color: 'orange.500'}}
                fontWeight="500"
                ml="-0.5"
                mt="-1">
                Welcome!
              </Text>

              <Text
                fontSize="sm"
                // _light={{color: 'orange.500'}}
                // _dark={{color: 'orange.500'}}
                fontWeight="500"
                ml="-0.5"
                mt="-1">
                {' '}
                name here
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </Box>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        {/* <DrawerItem
          label="Profile"
          onPress={() => {
            props.navigation.navigate('Profile');
          }}
          icon={() => <Icon name="user-alt" size={22} color="#98d6f1" />}
        /> */}
        <DrawerItem
          label="Sign Out"
          onPress={() => {
            AsyncStorage.clear();
            props.navigation.navigate('Login');
          }}
          icon={() => <Icon name="sign-out-alt" size={22} color="#98d6f1" />}
        />
      </DrawerContentScrollView>
    </>
  );
}
