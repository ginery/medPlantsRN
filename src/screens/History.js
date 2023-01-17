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
  useToast,
  Modal,
  Button,
  TextArea,
} from 'native-base';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
export default function HistoryScreen() {
  const navigation = useNavigation();
  React.useEffect(() => {
    // data.map((item, index) => {
    //   console.log(item.latitude);
    // });
    // console.log('user_id: ' + user_id + ' driver_id: ' + driver_user_id);
    // getPassengerLocation(user_id, driver_user_id);
    const unsubscribe = navigation.addListener('focus', () => {
      retrieveUser();
    });

    return () => {
      unsubscribe;
    }; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [navigation]);

  const [modalShow, setModalShow] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [getRating, setGetRating] = React.useState(0);
  React.useEffect(() => {
    retrieveUser();
  }, [1]);
  const [historyData, setHistoryData] = React.useState([]);
  const [user_id, setUserId] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();
  const [transactionId, setTransactionId] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [driverId, setDriverId] = React.useState('');
  const retrieveUser = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      if (valueString != null) {
        const value = JSON.parse(valueString);

        setUserId(value.user_id);
        getTransactionHistory(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTransactionHistory = user_id => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getTransactionHistory.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log('test');
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              transaction_id: item.transaction_id,
              driver_name: item.driver_name,
              amount: item.amount,
              status: item.status,
              remarks: item.remarks,
              driver_id: item.driver_id,
              date_added: item.date_added,
              rating_status: item.rating_status,
              rating_remarks: item.rating_remarks,
            };
          });
          setHistoryData(data);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // getTransactionHistory();
    retrieveUser();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const rateDriver = () => {
    // console.log(rating + '-' + transactionId);
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('transaction_id', transactionId);
    formData.append('remarks', comments);
    formData.append('rating', rating);
    fetch(window.name + 'rateDriver.php', {
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
          // console.log(responseJson.array_data[0].res);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  // kon component dapat big letters kano ga start dapat
  const DriverRating = driver_id => {
    // return <Text>{driver_id}</Text>;
    const formData = new FormData();
    formData.append('driver_id', driver_id);
    fetch(window.name + 'getDriverRating.php', {
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
          return responseJson.array_data[0].res;
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Box width="100%" height="100%">
          <Heading fontSize="xl" p="4" pb="3">
            History
          </Heading>
          <FlatList
            // style={{borderColor: 'black', borderWidth: 1}}
            data={historyData}
            renderItem={({item}) => (
              <TouchableOpacity
                disabled={
                  item.status == 'C'
                    ? true
                    : item.status == 'F' && item.rating_status > 0
                    ? true
                    : false
                }
                onPress={() => {
                  setModalShow(true);
                  setTransactionId(item.transaction_id);
                }}>
                <Box
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'muted.50',
                  }}
                  borderColor="muted.800"
                  pl={['0', '4']}
                  pr={['0', '5']}
                  py="2">
                  <HStack space={[2, 3]} justifyContent="space-between">
                    {/* <Avatar
                size="48px"
                source={{
                  uri: item.avatarUrl,
                }}
              /> */}
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.driver_name} (Php.{item.amount})
                        {DriverRating(item.driver_id)}
                      </Text>
                      {item.rating_status == 0 ? (
                        <Text
                          fontSize="xs"
                          _dark={{
                            color: 'warning.50',
                          }}
                          color="warning.800"
                          alignSelf="flex-start">
                          Rate the driver?
                        </Text>
                      ) : (
                        <View>
                          <Rating
                            rating={getRating}
                            max={5}
                            iconWidth={30}
                            iconHeight={30}
                          />
                          <Text
                            fontSize="xs"
                            _dark={{
                              color: 'warmGray.50',
                            }}
                            color="coolGray.800"
                            alignSelf="flex-start">
                            {item.rating_remarks}
                          </Text>
                        </View>
                      )}
                    </VStack>
                    <Spacer />

                    <Center>
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {(() => {
                          if (item.status == 'F')
                            return (
                              <Badge colorScheme="success" alignSelf="center">
                                Finished
                              </Badge>
                            );
                          else item.status == 'C';
                          return (
                            <Badge colorScheme="error" alignSelf="center">
                              Canceled
                            </Badge>
                          );
                        })()}
                      </Text>
                    </Center>
                  </HStack>
                </Box>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.transaction_id}
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
          <Modal
            isOpen={modalShow}
            onClose={() => {
              setRating('');
              setModalShow(false);
            }}
            _backdrop={{
              _dark: {
                bg: 'coolGray.800',
              },
              bg: 'warmGray.50',
            }}>
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Rate the Driver</Modal.Header>
              <Modal.Body>
                <Box>
                  <Rating
                    rating={rating}
                    max={5}
                    iconWidth={30}
                    iconHeight={30}
                    onRate={setRating}
                  />
                  <TextArea
                    value={comments}
                    onChangeText={text => setComments(text)}
                    mt={3}
                    w="100%"
                    h={20}
                    placeholder="Comments.."
                    maxW="300"
                  />
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setModalShow(false);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      rateDriver();
                    }}>
                    Submit
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
