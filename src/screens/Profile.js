import React from 'react';
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
  Avatar,
  VStack,
  ScrollView,
  FormControl,
  Input,
  Icon,
  Button,
} from 'native-base';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
export default function Profile({navigation}) {
  const [userFullName, setUserFullName] = React.useState('');
  const [fname, setFname] = React.useState('');
  const [lname, setLname] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user_id, setUserId] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      // console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        // console.log(value);

        getUserProfile(value.user_id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useState(() => {
    setModalVisible(true);
    retrieveData();
  }, [1]);
  const getUserProfile = u_id => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('user_id', u_id);
    // formData.append('idtoken', idtoken);
    fetch(window.name + 'getUserProfile.php', {
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
        if (responseJson.array_data != '') {
          var data = responseJson.array_data[0];
          setUserFullName(data.user_fname + ' ' + data.user_lname);
          setFname(data.user_fname);
          setLname(data.user_lname);
          setUsername(data.username);
          setUserId(data.user_id);
          setModalVisible(false);
        }
      })
      .catch(error => {
        console.error(error, 'getUserProfile');
        setButtonStatus(false);
        // Alert.alert('Internet Connection Error');
        ToastAndroid.showWithGravity(
          'Internet Connection Error',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
  };
  const updateProfile = () => {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('username', username);
    formData.append('password', password);
    fetch(window.name + 'updateProfile.php', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson.array_data[0].res);
        if (responseJson.array_data != '') {
          if (responseJson.array_data[0].res == 1) {
            setModalVisible(false);
            ToastAndroid.showWithGravity(
              'Great! You will redirect to login for security.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            setTimeout(() => {
              AsyncStorage.clear();
              navigation.navigate('Landing');
            }, 1500);
          } else {
            setModalVisible(false);
          }
        }
      })
      .catch(error => {
        console.error(error, 'updateProfile');
        setButtonStatus(false);
        // Alert.alert('Internet Connection Error');
        ToastAndroid.showWithGravity(
          'Internet Connection Error',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      });
  };
  return (
    <NativeBaseProvider>
      <HStack
        bg="#28a745"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <FontIcon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            MedPlants
          </Text>
        </HStack>
      </HStack>
      <Center flex={1} px="3" pt="3">
        <Box alignItems="center" w="100%">
          <Box
            shadow={2}
            h="99%"
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
              <AspectRatio
                w="100%"
                ratio={16 / 9}
                borderBottomWidth="3"
                borderBottomColor="#28a745"
                borderStyle="dashed">
                <Image
                  width="100%"
                  height="100%"
                  source={require('../assets/images/medplants_cover.png')}
                  alt="image"
                />
              </AspectRatio>
              <Center alignSelf="center" position="absolute" bottom="0" pb="3">
                <Avatar
                  shadow={2}
                  style={{
                    borderColor: '#28a745',
                    borderWidth: 4,
                  }}
                  w="100"
                  h="100"
                  alignSelf="center"
                  bg="amber.500"
                  source={require('../assets/images/profile.jpg')}>
                  AK
                </Avatar>
              </Center>
            </Box>
            <Stack>
              <Center mt={1}>
                <Heading size="md" ml="-1" color="#28a745">
                  {userFullName}
                </Heading>
              </Center>
            </Stack>
            <ScrollView w={['100%', '300']} h="80">
              <Center px="3">
                <Center w="100%">
                  <Box safeArea p="2" w="90%">
                    <VStack space={3} mt="5">
                      <FormControl>
                        <Input
                          variant="outline"
                          placeholder="First Name"
                          value={fname}
                          onChangeText={text => setFname(text)}
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
                      </FormControl>
                      <FormControl>
                        <Input
                          variant="outline"
                          placeholder="Last Name"
                          value={lname}
                          onChangeText={text => setLname(text)}
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
                      </FormControl>
                      <FormControl>
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
                      </FormControl>
                      <FormControl>
                        <Input
                          type="password"
                          variant="outline"
                          placeholder="Password"
                          value={password}
                          onChangeText={text => setPassword(text)}
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
                      </FormControl>
                      <Button
                        onPress={() => {
                          updateProfile();
                        }}
                        bgColor="#257f3a"
                        bg="#28a745">
                        Update Profile
                      </Button>
                    </VStack>
                  </Box>
                </Center>
              </Center>
            </ScrollView>
          </Box>
        </Box>
      </Center>
      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#28a7458c" width="100%" height="100%">
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Loading...</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
