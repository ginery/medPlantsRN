/**
 * Made by: ginx - juancoder
 */

import * as React from 'react';
import {
  Center,
  NativeBaseProvider,
  Input,
  Icon,
  Stack,
  Text,
  Button,
  Image,
  HStack,
  Heading,
  Spinner,
  StatusBar,
  useToast,
  Box,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/AntDesign';
import {View} from 'react-native';
import {background, buttonStyle} from 'styled-system';
import {
  TouchableOpacity,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
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
export default function App({navigation, route}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      requestCameraPermission();
      setButtonStatus(false);
      setUsername('');
      setPassword('');
      retrieveData();
      retrieveUser();
    });

    return unsubscribe;
  }, [navigation]);
  const toast = useToast();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [idtoken, setIdToken] = React.useState('');
  const setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('IDToken');
      console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        setIdToken(value.idtoken);
        // setUserid(value.user_id);
        console.log(value.idtoken);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        if (value.category == 'U') {
          console.log('user');
          navigation.navigate('Tab View');
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
  const login = () => {
    setButtonStatus(true);
    if (username == '' || password == '') {
      // toast.show({
      //   render: () => {
      //     return (
      //       <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
      //         <Text color="white">Opps! Please fill out all text field.</Text>
      //       </Box>
      //     );
      //   },
      // });
      ToastAndroid.showWithGravity(
        'Opps! Please fill out all text field.',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      setButtonStatus(false);
    } else {
      // Alert.alert(username);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      // formData.append('idtoken', idtoken);
      fetch(window.name + 'login.php', {
        method: 'POST',
        headers: {
          Accept: 'applicatiion/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          var data = responseJson.array_data[0];
          if (data.response == 1) {
            toast.show({
              render: () => {
                return (
                  <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Great! Please Wait.</Text>
                  </Box>
                );
              },
            });
            setItemStorage('user_details', {
              user_id: data.user_id,
              user_fname: data.user_fname,
              // user_mname: data.user_mname,
              user_lname: data.user_lname,
              contact_number: data.contact_number,
              username: data.username,
              category: data.category,
            });

            setTimeout(function () {
              navigation.navigate('Landing');
            }, 1000);
          } else if (data.response == -1) {
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Sorry! Account doesn't exist.</Text>
                  </Box>
                );
              },
            });
            setButtonStatus(false);
          } else if (data.response == 0) {
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Aw snap! Something went wrong. Please try again
                    </Text>
                  </Box>
                );
              },
            });
            setButtonStatus(false);
          }
          // console.log(data);
        })
        .catch(error => {
          console.error(error);
          setButtonStatus(false);
          Alert.alert('Internet Connection Error');
        });
    }
  };
  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#28a745" barStyle="light-content" />
      <Center flex={1} px="3">
        <Image
          style={{
            // borderColor: 'black',
            // borderWidth: 1,
            width: 340,
            height: 220,
            resizeMode: 'stretch',
          }}
          size="lg"
          source={require('../assets/images/medplants_cover.png')}
          alt="Alternate Text"
        />
        <Stack
          space={4}
          w="100%"
          maxWidth="300"
          style={{
            padding: 5,
            // borderColor: 'black',
            // borderWidth: 1,
          }}>
          <Center>
            <Text fontSize="lg" fontWeight="bold" color="#28a745">
              Login To MedPlants
            </Text>
          </Center>
          <Input
            variant="outline"
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            InputRightElement={
              <Icon
                as={<FontIcon name="user" />}
                size={5}
                mr={2}
                color="#626262"
              />
            }
            placeholderTextColor="#626262"
          />
          <Input
            variant="outline"
            placeholder="password"
            type="password"
            value={password}
            onChangeText={text => setPassword(text)}
            InputRightElement={
              <Icon
                as={<FontIcon name="lock1" />}
                size={5}
                mr={2}
                color="#626262"
              />
            }
            placeholderTextColor="#626262"
          />
          <Button
            disabled={buttonStatus}
            onPress={() => login()}
            bgColor="#257f3a"
            bg="#28a745"
            _text={{color: 'white'}}
            //  endIcon={<Icon as={<FontIcon name="sign-in-alt" />} size="5" />}>
          >
            <HStack space={2} alignItems="center">
              {buttonStatus == true && (
                // <Spinner
                //   accessibilityLabel="Loading posts"
                //   size="sm"
                //   color="white"
                // />
                <UIActivityIndicator
                  color="white"
                  size={20}
                  style={{flex: 0}}
                />
              )}

              <Heading color="white" fontSize="md">
                {buttonStatus ? 'Loading' : 'Sign In'}
              </Heading>
              {buttonStatus == false && (
                <Icon as={<FontIcon name="login" />} size="5" color="white" />
              )}
            </HStack>
          </Button>
          <HStack
            space={1}
            alignItems="center"
            style={{
              //   borderColor: 'black',
              //   borderWidth: 1,
              //   backgroundColor: '#8b8b8b',
              justifyContent: 'center',
              alignItems: 'center',

              //   height: 100,
            }}>
            <Text style={{color: '#2c2c2c'}}>New here?</Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text
                style={{
                  color: '#28a745',
                  borderBottomWidth: 1,
                  borderColor: '#28a745',
                }}>
                Register
              </Text>
            </TouchableOpacity>
          </HStack>
        </Stack>
      </Center>
    </NativeBaseProvider>
  );
}
