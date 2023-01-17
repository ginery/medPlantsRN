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
  Circle,
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
  Badge,
  Divider,
  useToast,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import ProgressBar from 'react-native-animated-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapViewDirections from 'react-native-maps-directions';
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

export default function MapWatch({navigation, route}) {
  const toast = useToast();
  // const navigation = useNavigation();
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [driverLocation, setDriverLocation] = React.useState([]);
  const [destination, setDestination] = React.useState([]);
  const [rating, setRating] = React.useState();
  const [driverData, setDriverData] = React.useState([]);
  const {driver_user_id, user_id} = route.params;
  const [transactionStatus, setTransactionStatus] = React.useState('');
  // const [user_id, setUserId] = React.useState('');
  const [driverStatus, setDriverStatus] = React.useState(false);
  React.useEffect(() => {
    // data.map((item, index) => {
    //   console.log(item.latitude);
    // });
    // console.log('user_id: ' + user_id + ' driver_id: ' + driver_user_id);
    // getPassengerLocation(user_id, driver_user_id);
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshed_home');
      getPassengerLocation(user_id, driver_user_id);
      getBookStatus(user_id, driver_user_id);
      getDriderData(user_id, driver_user_id);
      // createData();

      // retrieveUser();
      // syncData();
    });

    var watchID = Geolocation.watchPosition(
      latestposition => {
        // setLastPosition(latestposition);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 3000, maximumAge: 10000},
    );
    const interval = setInterval(() => {
      refreshLocation(0);
      getBookStatus(user_id, driver_user_id);
    }, 5000);

    return () => {
      unsubscribe;
      clearInterval(interval);
      Geolocation.clearWatch(watchID);
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);
  React.useEffect(() => {
    // THIS WILL RUN WHEN THERE'S A CHANGE IN 'quotes'
    if (destination.length) {
      getPassengerLocation(user_id, driver_user_id); // YOU CAN USE IT TO SET SOME OTHER STATE
      getBookStatus(user_id, driver_user_id);
      getDriderData(user_id, driver_user_id);
    }
  }, [1]);
  const refreshLocation = u_id => {
    Geolocation.getCurrentPosition(info => {
      // console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
    });
  };
  const getDriderData = (user_id, driver_user_id) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('driver_user_id', driver_user_id);
    fetch(window.name + 'getDriverDataSpecific.php', {
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
          var data = responseJson.array_data.map(function (item, index) {
            return {
              user_id: item.user_id,
              fullname: item.fullname,
              ratings: item.ratings,
              image: item.image,
            };
          });
          var data_driver_location = responseJson.array_data.map(function (
            item,
            index,
          ) {
            return {
              latitude: item.latitude,
              longitude: item.longitude,
              fullname: item.fullname,
            };
          });
          setDriverLocation(data_driver_location);
          setDriverData(data);
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

  const getPassengerLocation = async (user_id, driver_user_id) => {
    try {
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('driver_id', driver_user_id);
      fetch(window.name + 'getPassengerLocation.php', {
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
            var data = [
              {
                starting_point: responseJson.array_data[0].starting_point,
                end_point: responseJson.array_data[0].end_point,
              },
            ];
            setDestination(data);
            // console.log(destination);
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Internet Connection Error');
        });
    } catch (error) {
      console.error(error);
    }
  };
  const getBookStatus = (user_id, driver_user_id) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('driver_user_id', driver_user_id);
    fetch(window.name + 'getBookStatus.php', {
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
          if (responseJson.array_data[0].response == 'S') {
            setTransactionStatus('Pending');
          } else if (responseJson.array_data[0].response == 'C') {
            setTransactionStatus('Cancel');
          } else {
            setTransactionStatus('Accepted');
          }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const cancelBooking = () => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('driver_user_id', driver_user_id);
    fetch(window.name + 'cancelBooking.php', {
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
          if (responseJson.array_data[0].response == '1') {
            toast.show({
              render: () => {
                return (
                  <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Alright! Transaction has been canceled.
                    </Text>
                  </Box>
                );
              },
            });
            navigation.navigate('Tab View');
          } else {
            toast.show({
              render: () => {
                return (
                  <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">Aw snap! Something went wrong.</Text>
                  </Box>
                );
              },
            });
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
        {transactionStatus == 'Pending' ? (
          <HStack>
            <TouchableOpacity
              onPress={() => {
                cancelBooking(user_id, driver_user_id);
              }}>
              <Text style={{color: 'red'}} fontSize={20} fontWeight="bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </HStack>
        ) : null}
      </HStack>
      <VStack alignItems="center">
        <Center w="100%" h="50%" bg="indigo.300" rounded="md" shadow={3}>
          <View style={styles.container}>
            <MapView
              tracksViewChanges={false}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {driverLocation.map((item, index) => {
                return (
                  <Marker
                    key={index}
                    // title={item.fullname}
                    coordinate={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }} //shop
                    // image={require('../assets/images/tri_sakay_logo_wo_phone.png')}
                  >
                    <Center w="100%">
                      <Text>{item.fullname}</Text>
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
                );
              })}

              <Marker
                coordinate={{latitude: latitude, longitude: longitude}} //you
              >
                <Center w="100%">
                  <Text>Me</Text>
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

              {destination.length > 0 ? (
                <Marker
                  title="Destination"
                  style={{width: 5, height: 5}}
                  resizeMode="contain"
                  coordinate={{
                    latitude: parseFloat(destination[0].starting_point),
                    longitude: parseFloat(destination[0].end_point),
                  }} //shop
                />
              ) : null}
              <MapViewDirections
                origin={{latitude: latitude, longitude: longitude}}
                destination={{
                  latitude:
                    destination.length > 0
                      ? parseFloat(destination[0].starting_point)
                      : 0,
                  longitude:
                    destination.length > 0
                      ? parseFloat(destination[0].end_point)
                      : 0,
                }}
                apikey="AIzaSyDoePlR12j4XnPgKCc0YWpI_7rtI6TPNms"
                strokeWidth={5}
                strokeColor="hotpink"
              />
            </MapView>
            {/* <Text style={{color: 'black', fontSize: 25}}>
               {latitude} {'<->'} {longitude}
             </Text> */}
          </View>
        </Center>
        <Center w="100%" h="40%" bg="white">
          <VStack space={2} alignItems="center">
            <Center w="80" h="20">
              <Text>
                Driver Name:{' '}
                {driverData.length > 0 ? driverData[0].fullname : ''}
              </Text>
              <Text>
                <Rating
                  rating={driverData.length > 0 ? driverData[0].ratings : 0}
                  max={5}
                  iconWidth={24}
                  iconHeight={24}
                />
              </Text>
              <Divider
                my="2"
                _light={{
                  bg: '#54b5df',
                }}
                _dark={{
                  bg: '#54b5df',
                }}
              />
              <Badge
                colorScheme={
                  transactionStatus == 'Pending'
                    ? 'warning'
                    : transactionStatus == 'Cancel'
                    ? 'error'
                    : 'success'
                }>
                {transactionStatus}
              </Badge>
            </Center>
            <Center w="80" h="20">
              <HStack>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Total Fare:
                </Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}> 1.00</Text>
              </HStack>
            </Center>
          </VStack>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
}
