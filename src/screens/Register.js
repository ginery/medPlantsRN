import * as React from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  NativeBaseProvider,
  AspectRatio,
  Image,
  Stack,
  Text,
  HStack,
  Icon,
  useToast,
  ScrollView,
} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
export default function Register({navigation}) {
  const height = useHeaderHeight();
  const toast = useToast();
  const [fname, setFname] = React.useState('');
  const [mname, setMname] = React.useState('');
  const [lname, setLname] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonStatus, setButtonStatus] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const registerUser = () => {
    setModalVisible(true);
    if (
      fname == '' ||
      mname == '' ||
      lname == '' ||
      email == '' ||
      username == '' ||
      password == '' ||
      contactNumber == ''
    ) {
      toast.show({
        render: () => {
          return (
            <Box bg="error.500" px="2" py="1" rounded="sm" mb={5}>
              <Text color="white">
                Oh no! Please Fill out all the text field.
              </Text>
            </Box>
          );
        },
      });
      setModalVisible(false);
    } else {
      const formData = new FormData();
      formData.append('fname', fname);
      formData.append('mname', mname);
      formData.append('lname', lname);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('contactNumber', contactNumber);

      fetch(window.name + 'register.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          var data = responseJson.array_data[0];
          console.log(data);
          if (data.res >= 1) {
            setModalVisible(false);
            toast.show({
              render: () => {
                return (
                  <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    <Text color="white">
                      Great! Successfully added account.
                    </Text>
                  </Box>
                );
              },
            });
            setButtonStatus(true);
            setTimeout(function () {
              navigation.navigate('Login');
            }, 1500);
          } else if (data.res == -2) {
            setModalVisible(false);
            Alert.alert('Name already exist.');
          } else {
            setModalVisible(false);
            Alert.alert('Something went wrong.');
          }
        })
        .catch(error => {
          setModalVisible(false);
          console.error(error);
          Alert.alert('Internet Connection Error');
        });
    }
  };
  return (
    <NativeBaseProvider>
      <Box alignItems="center" w="100%">
        <Box
          style={{borderBottomLeftRadius: 50}}
          overflow="hidden"
          borderColor="coolGray.200"
          _web={{
            shadow: 2,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: 'gray.50',
          }}
          background="#28a745"
          w="100%"
          h={200}>
          <Box>
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

            {/* <AspectRatio w="100%" ratio={16 / 9}></AspectRatio> */}
          </Box>
        </Box>
      </Box>
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
                    placeholder="Middle Name"
                    value={mname}
                    onChangeText={text => setMname(text)}
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
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    InputRightElement={
                      <Icon
                        as={<FontIcon name="at" />}
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
                    placeholder="Contact #"
                    value={contactNumber}
                    onChangeText={text => setContactNumber(text)}
                    InputRightElement={
                      <Icon
                        as={<FontIcon name="phone" />}
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
                        as={<FontIcon name="user-alt" />}
                        size={5}
                        mr={3}
                        color="#626262"
                      />
                    }
                    placeholderTextColor="#626262"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    variant="outline"
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    type="password"
                    InputRightElement={
                      <Icon
                        as={<FontIcon name="lock" />}
                        size={5}
                        mr={3}
                        color="#626262"
                      />
                    }
                    placeholderTextColor="#626262"
                  />
                </FormControl>

                <Button
                  disabled={buttonStatus}
                  mt="2"
                  bgColor="#257f3a"
                  bg="#28a745"
                  onPress={() => {
                    registerUser();
                  }}>
                  Sign up
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
                  <Text style={{color: 'gray'}}>Already register?</Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    <Text
                      style={{
                        color: '#28a745',
                        borderBottomWidth: 1,
                        borderColor: '#28a745',
                      }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </Box>
          </Center>
        </Center>
      </ScrollView>

      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#2a2a2ab8" width="50%" height="20%" borderRadius={10}>
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Loading...</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
