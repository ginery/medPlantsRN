import React from 'react';

import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
  Badge,
  AspectRatio,
  Image,
  Stack,
  Button,
  Modal,
  FormControl,
  Input,
  useToast,
  Spinner,
} from 'native-base';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Rating from 'react-native-easy-rating';
import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
enableLatestRenderer();
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default function Book({navigation, route}) {
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [destination, setDestination] = React.useState([]);
  const {driver_user_id} = route.params;
  const [fullname, setFullName] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [user_id, setUserId] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [driverRating, setDriverRating] = React.useState(0);
  const toast = useToast();
  React.useEffect(() => {
    getDriversData();
    getCurrentLocation();
    retrieveUser();
  }, [1]);
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(info => {
      // console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserId(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDriversData = () => {
    const formData = new FormData();
    formData.append('user_id', driver_user_id);
    fetch(window.name + 'getDriverDetails.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.array_data != '') {
          setFullName(responseJson.array_data[0].fullname);
          setDriverRating(responseJson.array_data[0].user_rating);
          //   console.log(responseJson.array_data[0].fullname);
        } else {
          toast.show({
            render: () => {
              return (
                <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Oh snap! Something went wrong.</Text>
                </Box>
              );
            },
          });
        }
        // console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const bookDriver = destination => {
    // console.log(destination.latitude);
    setButtonStatus(true);
    const formData = new FormData();
    formData.append('driver_user_id', driver_user_id);
    formData.append('user_id', user_id);
    formData.append('d_latitude', destination.latitude);
    formData.append('d_longitude', destination.longitude);
    fetch(window.name + 'bookDriver.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.array_data[0].response == 1) {
          // setFullName(responseJson.array_data[0].fullname);
          toast.show({
            render: () => {
              return (
                <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">
                    Great! Successfully book the driver.
                  </Text>
                </Box>
              );
            },
          });

          setTimeout(function () {
            setShowModal(false);
            navigation.navigate('Map Watch', {
              driver_user_id: driver_user_id,
              user_id: user_id,
            });
          }, 1000);
        } else if (responseJson.array_data[0].response == 2) {
          setShowModal(false);
          setButtonStatus(false);
          toast.show({
            render: () => {
              return (
                <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Uh-oh! Already booked a driver.</Text>
                </Box>
              );
            },
          });
        } else {
          setShowModal(false);
          setButtonStatus(false);
          toast.show({
            render: () => {
              return (
                <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Oh snap! Something went wrong.</Text>
                </Box>
              );
            },
          });
        }
        // console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const toRadians = degrees => {
    const pi = Math.PI;
    return degrees * (pi / 180);
  };
  const haversine_distance = (lat, long, destination) => {
    const radius = 6371;

    const dlat = toRadians(destination.latitude - lat);
    const dlong = toRadians(destination.longitude - long);
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(toRadians(lat)) *
        Math.cos(toRadians(destination.latitude)) *
        Math.sin(dlong / 2) *
        Math.sin(dlong / 2);
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const c = radius * b;
    return c;
  };
  return (
    <NativeBaseProvider>
      <Box safeAreaTop backgroundColor="#54b5df" />
      <HStack
        bg="#54b5df"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            TriSakay
          </Text>
        </HStack>
      </HStack>

      <Center flex={1} px="3" pt="3">
        <Box alignItems="center">
          <Heading fontSize="xl" p="4" pb="3">
            Driver Details
          </Heading>
          <Box
            h="80%"
            w="100%"
            // maxW="80"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.700',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}>
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image
                  source={{
                    uri: 'https://img.freepik.com/free-photo/road-with-buildings-park-background_1112-211.jpg?w=2000',
                  }}
                  alt="image"
                />
              </AspectRatio>
              <Center alignSelf="center" position="absolute" bottom="0" pb="3">
                <Avatar
                  style={{
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                  w="100"
                  h="100"
                  alignSelf="center"
                  bg="amber.500"
                  source={{
                    uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                  }}>
                  AK
                </Avatar>
              </Center>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  {fullname}
                </Heading>
                <Text
                  fontSize="xs"
                  _light={{
                    color: 'violet.500',
                  }}
                  _dark={{
                    color: 'violet.400',
                  }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1">
                  <Rating
                    rating={driverRating}
                    max={5}
                    iconWidth={24}
                    iconHeight={24}
                  />
                </Text>
              </Stack>
              <Text fontWeight="400">
                Bengaluru (also called Bangalore) is the center of India's
                high-tech industry. The city is also known for its parks and
                nightlife.
              </Text>
              <HStack
                alignItems="center"
                space={4}
                justifyContent="space-between">
                {/* <HStack alignItems="center">
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}
                    fontWeight="400">
                    6 mins ago
                  </Text>
                </HStack> */}
              </HStack>
            </Stack>
          </Box>
          <Button size="sm" onPress={() => setShowModal(true)} variant="subtle">
            Book Now?
          </Button>
        </Box>
      </Center>
      {/* Modal Here! */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="xl">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Select Location</Modal.Header>
          <Modal.Body style={{height: 300}}>
            <Center w="100%" h="100%">
              <View style={styles.container}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker
                    draggable
                    onDragEnd={e => {
                      console.log('dragEnd', e.nativeEvent.coordinate);
                      setDestination(e.nativeEvent.coordinate);
                    }}
                    title="test2"
                    style={{width: 5, height: 5}}
                    resizeMode="contain"
                    coordinate={{latitude: latitude, longitude: longitude}} //shop
                  />
                </MapView>
              </View>
            </Center>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              {/* <Button
                onPress={() => {
                  // setShowModal(false);
                  bookDriver(destination);
                }}>
                Save
              </Button> */}
              <Button
                disabled={buttonStatus}
                onPress={() => bookDriver(destination)}
                bgColor="#54b5df"
                _text={{color: 'white'}}
                //  endIcon={<Icon as={<FontIcon name="sign-in-alt" />} size="5" />}>
              >
                <HStack space={2} alignItems="center">
                  {buttonStatus == true && (
                    <Spinner
                      accessibilityLabel="Loading posts"
                      size="sm"
                      color="white"
                    />
                  )}

                  <Heading color="white" fontSize="md">
                    {buttonStatus ? 'Loading' : 'Submit'}
                  </Heading>
                </HStack>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {/* #end Modal! */}
    </NativeBaseProvider>
  );
}
