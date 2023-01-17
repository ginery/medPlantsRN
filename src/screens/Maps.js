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
  RefreshControl,
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
  useToast,
  FlatList,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import ProgressBar from 'react-native-animated-progress';
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

export default function Maps() {
  const navigation = useNavigation();
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const [driverLocation, setDriverLocation] = React.useState([]);
  const [rating, setRating] = React.useState();
  const [driverData, setDriverData] = React.useState([]);
  const [user_id, setUserId] = React.useState('');
  const [driverStatus, setDriverStatus] = React.useState(false);
  const toast = useToast();
  const [refreshing, setRefreshing] = React.useState(false);
  const [driver_user_id, setDriverUserId] = React.useState('');
  const [transactionStatusUser, setTransactionStatusUser] = React.useState('');
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserId(value.user_id);
        getDriderData(value.user_id);
        getTransactionStatus(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    // data.map((item, index) => {
    //   console.log(item.latitude);
    // });
    retrieveUser();

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refreshed_home');

      // retrieveUser();
      // createData();

      // retrieveUser();
      // syncData();
    });

    var watchID = Geolocation.watchPosition(
      latestposition => {
        // setLastPosition(latestposition);
        // console.log(latestposition);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 10000},
    );
    const interval = setInterval(() => {
      refreshLocation(user_id);
      retrieveUser();
    }, 5000);

    return () => {
      unsubscribe;
      clearInterval(interval);
      Geolocation.clearWatch(watchID);
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [navigation]);
  React.useEffect(() => {
    retrieveUser();
  }, [1]);
  // const onRefresh = () => {
  //   getDriderData();
  // };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);

  const refreshLocation = u_id => {
    Geolocation.getCurrentPosition(info => {
      console.log(info);
      setLatitude(info.coords.latitude);
      setLongitude(info.coords.longitude);
      updateCurrentLocation(u_id, info.coords.latitude, info.coords.longitude);
    });
  };
  const getDriderData = user_id => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getDriversData.php', {
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
          setDriverUserId(responseJson.array_data[0].user_id);
          var data = responseJson.array_data.map(function (item, index) {
            return {
              user_id: item.user_id,
              fullname: item.fullname,
              ratings: item.ratings,
              image: item.image,
              status: item.status,
              distance_status: item.distance_status,
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
              distance_status: item.distance_status,
            };
          });
          setDriverLocation(data_driver_location);
          setDriverData(data);
          // console.log(data_driver_location);
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

  const getTransactionStatus = user_id => {
    // console.log('user id ' + user_id);
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
        if (responseJson.array_data != '') {
          // console.log(responseJson);
          setTransactionStatusUser(responseJson.array_data[0].response);
          // if (responseJson.array_data[0].response == 'S') {
          //   setDriverStatus(true);
          // } else {
          //   setDriverStatus(false);
          // }
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const updateCurrentLocation = (user_id, lat, long) => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('latitude', lat);
    formData.append('longitude', long);
    fetch(window.name + 'updateCurrentLocation.php', {
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
          console.log(responseJson);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
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
              }}
              zIndex={-1}>
              {driverLocation.map((item, index) => {
                if (item.distance_status == 1) {
                  return (
                    <Marker
                      tracksViewChanges={false}
                      zIndex={3}
                      coordinate={{
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                      }} //driver
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
                }
              })}

              <Marker
                tracksViewChanges={false}
                zIndex={3}
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
            </MapView>
            {/* <Text style={{color: 'black', fontSize: 25}}>
              {latitude} {'<->'} {longitude}
            </Text> */}
          </View>
        </Center>
        <Center w="100%" h="10%" bg="white">
          {/*  Available Tricycle to book */}
          <Heading fontSize="xl" p="4" pb="3">
            Available driver to book
          </Heading>
        </Center>
        <Center w="100%" h="40%" rounded="md" shadow={3} bg="white">
          <Box w="100%" bg="white" style={{height: '100%'}}>
            {/* <Heading fontSize="xl">Inbox</Heading> */}
            <FlatList
              style={{borderColor: 'white', borderWidth: 1}}
              data={driverData}
              renderItem={({item}) => (
                <Box
                  display={item.distance_status == 1 ? 'flex' : 'none'}
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'gray.600',
                  }}
                  borderColor="coolGray.200"
                  pl="4"
                  pr="5"
                  py="2">
                  <HStack space={3} justifyContent="space-between">
                    <Avatar
                      size="48px"
                      source={{
                        uri: item.image,
                      }}
                    />
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.fullname}
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        <Rating
                          rating={item.ratings}
                          max={5}
                          iconWidth={24}
                          iconHeight={24}
                        />
                      </Text>
                    </VStack>
                    <Spacer />
                    {/* <Text
                      fontSize="xs"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      alignSelf="center">
                      button here
                    </Text> */}

                    {item.status == 'A' && transactionStatusUser == 1 ? (
                      <Button
                        colorScheme="emerald"
                        size="sm"
                        // bg={item.status == 1 ? 'emerald.500' : 'primary.500'}
                        bg={
                          item.status == 'S'
                            ? 'warning.500'
                            : item.status == 'B'
                            ? 'primary.500'
                            : item.status == 'A'
                            ? 'emerald.500'
                            : ''
                        }
                        onPress={() => {
                          // navigation.navigate('Book', {
                          //   driver_user_id: item.user_id,
                          // });
                          item.status == 'S'
                            ? navigation.navigate('Map Watch', {
                                user_id: user_id,
                                driver_user_id: item.user_id,
                              })
                            : item.status == 'B'
                            ? navigation.navigate('Book', {
                                driver_user_id: item.user_id,
                              })
                            : item.status == 'A'
                            ? navigation.navigate('Map Watch', {
                                user_id: user_id,
                                driver_user_id: item.user_id,
                              })
                            : '';
                        }}
                        alignSelf="center">
                        {item.status == 'S'
                          ? 'Pending'
                          : item.status == 'B'
                          ? 'Book'
                          : item.status == 'A'
                          ? 'Accepted'
                          : ''}
                      </Button>
                    ) : null}
                    {item.status != 'A' && transactionStatusUser == 0 ? (
                      <Button
                        colorScheme={
                          item.status == 'S'
                            ? 'warning'
                            : item.status == 'B' ||
                              item.status == 'F' ||
                              item.status == 'C'
                            ? 'primary'
                            : item.status == 'A'
                            ? 'emerald'
                            : ''
                        }
                        size="sm"
                        // bg={item.status == 1 ? 'emerald.500' : 'primary.500'}
                        bg={
                          item.status == 'S'
                            ? 'warning.500'
                            : item.status == 'B' ||
                              item.status == 'F' ||
                              item.status == 'C'
                            ? 'primary.500'
                            : item.status == 'A'
                            ? 'emerald.500'
                            : ''
                        }
                        onPress={() => {
                          // navigation.navigate('Book', {
                          //   driver_user_id: item.user_id,
                          // });
                          item.status == 'S'
                            ? navigation.navigate('Map Watch', {
                                user_id: user_id,
                                driver_user_id: item.user_id,
                              })
                            : item.status == 'B' ||
                              item.status == 'F' ||
                              item.status == 'C'
                            ? navigation.navigate('Book', {
                                driver_user_id: item.user_id,
                              })
                            : item.status == 'A'
                            ? navigation.navigate('Map Watch', {
                                user_id: user_id,
                                driver_user_id: item.user_id,
                              })
                            : '';
                        }}
                        alignSelf="center">
                        {item.status == 'S'
                          ? 'Pending'
                          : item.status == 'B' ||
                            item.status == 'F' ||
                            item.status == 'C'
                          ? 'Book'
                          : item.status == 'A'
                          ? 'Accepted'
                          : ''}
                      </Button>
                    ) : null}
                  </HStack>
                </Box>
              )}
              keyExtractor={item => item.user_id}
              refreshControl={
                <RefreshControl
                  title="Pull to refresh"
                  tintColor="#fff"
                  titleColor="#fff"
                  colors={['#54b5df']}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          </Box>
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
}
