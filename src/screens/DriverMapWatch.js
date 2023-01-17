/**
 * Made by: ginx - juancoder
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

import MapView, {
  enableLatestRenderer,
  PROVIDER_GOOGLE,
  Marker,
} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

import Geolocation from 'react-native-geolocation-service';
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
  Button,
  Actionsheet,
  Progress,
  useDisclose,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import ProgressBar from 'react-native-animated-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapViewDirections from 'react-native-maps-directions';
import * as geolib from 'geolib';
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

export default function DriverMapWatch({navigate, route}) {
  const navigation = useNavigation();
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [destination, setDistination] = React.useState([]);
  const [rating, setRating] = React.useState();
  const [driverData, setDriverData] = React.useState([]);
  const {transaction_id} = route.params;
  const [user_id, setUserId] = React.useState(0);
  const [driverStatus, setDriverStatus] = React.useState(false);
  React.useEffect(() => {
    // data.map((item, index) => {
    //   console.log(item.latitude);
    // });

    getDriderData();
    var watchID = Geolocation.watchPosition(
      latestposition => {
        // setLastPosition(latestposition);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 10000},
    );
    const interval = setInterval(() => {
      refreshLocation(0);
    }, 3000);

    return () => {
      clearInterval(interval);
      Geolocation.clearWatch(watchID);
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  const refreshLocation = u_id => {
    Geolocation.getCurrentPosition(info => {
      // console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  const getDriderData = () => {
    const formData = new FormData();
    formData.append('transaction_id', transaction_id);
    fetch(window.name + 'getPassengerLocationDriver.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data_driver_location = responseJson.array_data.map(function (
            item,
            index,
          ) {
            return {
              latitude: item.starting_point,
              longitude: item.end_point,
              user_lat: item.user_lat,
              user_long: item.user_long,
            };
          });
          setDistination(data_driver_location);
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

        // console.log(data);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const getTransactionStatus = () => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getTransactionStatus.php', {
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
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].response == 0) {
            setDriverStatus(true);
          } else {
            setDriverStatus(false);
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };

  return (
    <NativeBaseProvider>
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
            Home
          </Text>
        </HStack>
        <HStack>
          <TouchableOpacity>
            <Text style={{color: 'yellow'}} fontSize={20} fontWeight="bold">
              Reject
            </Text>
          </TouchableOpacity>
        </HStack>
      </HStack>
      <VStack alignItems="center">
        <Center w="100%" h="50%" bg="indigo.300" rounded="md" shadow={3}>
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
                tracksViewChanges={false}
                coordinate={{
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].latitude)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].longitude)
                      : 0,
                }}>
                <Center w="100%">
                  <Text>Destination</Text>
                  <Image
                    source={require('../assets/images/blue_pin.png')}
                    style={{
                      width: 36,
                      height: 38,
                    }}
                    resizeMode="contain"
                  />
                </Center>
              </Marker>
              <Marker
                tracksViewChanges={false}
                coordinate={{
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_lat)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_long)
                      : 0,
                }}>
                <Center w="100%">
                  <Text>Passenger</Text>
                  <Image
                    source={require('../assets/images/tri_sakay_logo_wo_phone_passenger.png')}
                    style={{
                      width: 36,
                      height: 38,
                    }}
                    resizeMode="contain"
                  />
                </Center>
              </Marker>

              <Marker
                tracksViewChanges={false}
                coordinate={{latitude: latitude, longitude: longitude}}>
                <Center w="100%">
                  <Text>Driver</Text>
                  <Image
                    source={require('../assets/images/tri_sakay_logo_wo_phone.png')}
                    style={{
                      width: 36,
                      height: 38,
                    }}
                    resizeMode="contain"
                  />
                </Center>
              </Marker>
              <MapViewDirections
                origin={{
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_lat)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_long)
                      : 0,
                }}
                destination={{
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].latitude)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].longitude)
                      : 0,
                }}
                apikey="AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms"
                strokeWidth={5}
                strokeColor="#54b5df"
              />
            </MapView>
            {/* <Text style={{color: 'black', fontSize: 25}}>
               {latitude} {'<->'} {longitude}
             </Text> */}
          </View>
        </Center>
        <Center w="100%" h="40%" bg="white">
          <VStack space={2} alignItems="center">
            <Center w="80" h="20" bg="indigo.300" rounded="md" shadow={3}>
              {geolib.getDistance(
                {
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_lat)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].user_long)
                      : 0,
                },
                {
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].latitude)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].longitude)
                      : 0,
                },
              ) + ' meters'}
            </Center>
            <Center w="80" h="20" bg="indigo.500" rounded="md" shadow={3} />
          </VStack>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
}
