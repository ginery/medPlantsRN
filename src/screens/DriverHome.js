import React from 'react';
import {useNavigation} from '@react-navigation/native';
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
  Button,
  AlertDialog,
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
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDistance} from 'geolib';
// import {TouchableOpacity} from 'react-native-gesture-handler';
export default function DriverHome() {
  React.useEffect(() => {
    retrieveUser();
  }, [1]);
  const [historyData, setHistoryData] = React.useState([]);
  const [user_id, setUserId] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [transaction_nav_id, setTransactionNavId] = React.useState(0);
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigation = useNavigation();

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     //console.log('refreshed_home');
  //     retrieveUser();
  //     getTransactionHistory();
  //   });

  //   return unsubscribe;
  // }, [navigation]);
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
    console.log(user_id);
    const formData = new FormData();
    formData.append('user_id', user_id);
    fetch(window.name + 'getDriverTransactionHistory.php', {
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
              transaction_id: item.transaction_id,
              driver_name: item.driver_name,
              amount: item.amount,
              status: item.status,
              remarks: item.remarks,
              date_added: item.date_added,
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
    getTransactionHistory();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const AcceptTransaction = id => {
    // console.log(id);
    getTransactionHistory();
    setIsOpen(false);
    const formData = new FormData();
    formData.append('transaction_id', id);
    fetch(window.name + 'acceptTransaction.php', {
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
          <Heading fontSize="xl" p="4" pb="2">
            Transactions
          </Heading>
          <FlatList
            data={historyData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Driver Map Watch', {
                    transaction_id: item.transaction_id,
                  });
                }}>
                <Box
                  mt={2}
                  width="100%"
                  bg="primary.300"
                  borderRadius={10}
                  p="4"
                  shadow={2}
                  _>
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
                      </Text>
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: 'warmGray.200',
                        }}>
                        {item.remarks}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Center>
                      <HStack>
                        {/* <Text
                        fontSize="xs"
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        alignSelf="flex-start">
                        {(() => {
                          if (item.status == '')
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
                      </Text> */}
                        <Button
                          mr={2}
                          size="sm"
                          variant="subtle"
                          onPress={() => {
                            setTransactionNavId(item.transaction_id);
                            setIsOpen(!isOpen);
                          }}>
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="subtle"
                          colorScheme="secondary"
                          onPress={() => console.log('hello world')}>
                          Reject
                        </Button>
                      </HStack>
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
        </Box>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}>
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>Accept Transaction</AlertDialog.Header>
            <AlertDialog.Body>Please top Proceed to continue</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}>
                  Cancel
                </Button>
                <Button
                  colorScheme="success"
                  onPress={() => {
                    AcceptTransaction(transaction_nav_id);
                  }}>
                  Proceed
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </NativeBaseProvider>
  );
}
