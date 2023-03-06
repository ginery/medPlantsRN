/**
 * Made by: ginx - juancoder
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  RefreshControl,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {
  ScrollView,
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
  AspectRatio,
  Stack,
  Pressable,
  Icon,
} from 'native-base';
import Rating from 'react-native-easy-rating';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
export default function HomeScreen() {
  const camera = React.useRef(null);
  const navigation = useNavigation();
  const toast = useToast();
  const devices = useCameraDevices();
  const device = devices.back;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [enableCamera, setEnableCamera] = React.useState(true);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [plantName, setPlantName] = React.useState('N/A');
  const [plantAuthority, setPlantAuthority] = React.useState('N/A');
  const [plantDesc, setPlantDesc] = React.useState('N/A');
  const [plantPhoto, setPlantPhoto] = React.useState('');
  const [taxonomyClass, setTaxonomyClass] = React.useState('N/A');
  const [taxonomyFamily, setTaxonomyFamily] = React.useState('N/A');
  const [taxonomyGenus, setTaxonomyGenus] = React.useState('N/A');
  const [taxonomyKingdom, setTaxonomyKingdom] = React.useState('N/A');
  const [taxonomyOrder, setTaxonomyOrder] = React.useState('N/A');
  const [taxonomyPhylum, setTaxonomyPhylum] = React.useState('N/A');
  const [user_fname, setUserFname] = React.useState('');
  const [countPlant, setCountPlant] = React.useState(0);
  const [countUser, setCountUser] = React.useState(0);
  const [countAssessment, setCountAssessment] = React.useState(0);
  // console.log(device);
  React.useEffect(() => {
    retrieveData();
    countPlantUserHealth();
  }, [user_fname]);
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      console.log(valueString);
      console.log('home');
      if (valueString != null) {
        const value = JSON.parse(valueString);
        setUserFname(value.user_fname + '!');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';

      console.log(frame);
    },
    [0.4],
  );
  const countPlantUserHealth = () => {
    fetch(window.name + 'countPlantUserHealth.php', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.array_data != '') {
          setCountPlant(responseJson.array_data[0].count_plants);
          setCountUser(responseJson.array_data[0].count_users);
          setCountAssessment(responseJson.array_data[0].count_assessment);
        }
        // console.log(data);
      })
      .catch(error => {
        console.error(error);
        setButtonStatus(false);
        Alert.alert('Internet Connection Error');
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
      <Center></Center>
      <Center flex={1} px="3" pt="3">
        <Box w="100%">
          <HStack
            space={[2, 3]}
            justifyContent="space-between"
            p={3}
            bg="white">
            <Image
              style={{
                // borderColor: 'black',
                // borderWidth: 1,
                width: 80,
                height: 80,
                resizeMode: 'stretch',
              }}
              source={require('../assets/images/logo2.png')}
              alt="Alternate Text"
            />
            <VStack>
              <Text
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800">
                Welcome Back
              </Text>
              <Text color="#257f3a" bold>
                {user_fname}
              </Text>
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}>
                MedPlants - Herbal Plants Information
              </Text>
            </VStack>
            <Spacer />
          </HStack>
          <VStack space={3} alignItems="flex-start" mt={3}>
            <Center w="100%" h="20" shadow={3}>
              <HStack justifyContent="center" w="100%" h="100%">
                <Center
                  w="80%"
                  bg="white"
                  alignItems="flex-start"
                  pl={3}
                  borderBottomLeftRadius={10}
                  borderTopLeftRadius={10}>
                  <Text bold fontSize={20}>
                    {countPlant}
                  </Text>
                  <Text>Total Plant</Text>
                </Center>
                <Center
                  w="20%"
                  bg="#334148"
                  borderBottomRightRadius={10}
                  borderTopRightRadius={10}>
                  <FontIcon name="tree" size={25} color="rgb(255, 91, 91)" />
                </Center>
              </HStack>
            </Center>
            <Center w="100%" h="20" shadow={3}>
              <HStack justifyContent="center" w="100%" h="100%">
                <Center
                  w="80%"
                  bg="white"
                  alignItems="flex-start"
                  pl={3}
                  borderBottomLeftRadius={10}
                  borderTopLeftRadius={10}>
                  <Text bold fontSize={20}>
                    {countAssessment}
                  </Text>
                  <Text>Total Health Assessment</Text>
                </Center>
                <Center
                  w="20%"
                  bg="#334148"
                  borderBottomRightRadius={10}
                  borderTopRightRadius={10}>
                  <FontIcon name="list" size={25} color="rgb(255, 235, 59)" />
                </Center>
              </HStack>
            </Center>
          </VStack>
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
          <Center bg="#2a2a2ab8" width="50%" height="20%" borderRadius={10}>
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Scanning....</Text>
          </Center>
        </Box>
      </Modal>
      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalPlantsDescription}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#2a2a2ab8" width="100%" height="100%">
            <Center width="100%" height="50%" borderRadius={5}>
              <Box alignItems="center" width="90%">
                <Box alignItems="center">
                  <Box
                    maxW="80"
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
                            uri: 'file://' + plantPhoto,
                          }}
                          alt="image"
                        />
                      </AspectRatio>
                      <Pressable
                        onPress={() => {
                          setModalPlantsDescription(false);
                        }}
                        bgColor="#257f3a"
                        bg="#28a745"
                        _dark={{
                          bg: '28a745',
                        }}
                        position="absolute"
                        right="0"
                        top="0"
                        px="3"
                        py="1.5">
                        <Center
                          _text={{
                            color: 'warmGray.50',
                            fontWeight: '700',
                            fontSize: 'xs',
                          }}>
                          X
                        </Center>
                      </Pressable>
                    </Box>
                    <Stack p="4" space={0}>
                      <Stack space={2}>
                        <Heading size="md" ml="-1">
                          {plantName}
                        </Heading>
                        <Text
                          fontSize="xs"
                          _light={{
                            color: '#28a745',
                          }}
                          _dark={{
                            color: '#28a745',
                          }}
                          fontWeight="500"
                          ml="-0.5"
                          mt="-1">
                          {plantAuthority}
                        </Text>
                      </Stack>
                      <Box
                        style={{
                          // borderColor: 'black',
                          // borderWidth: 1,
                          height: 150,
                        }}>
                        <ScrollView w={['100%', '300']}>
                          <Text fontWeight="400">{plantDesc}</Text>
                        </ScrollView>
                      </Box>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Class : {taxonomyClass}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Family : {taxonomyFamily}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Genus : {taxonomyGenus}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Kingdom : {taxonomyKingdom}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Order : {taxonomyOrder}
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text
                            color="coolGray.600"
                            _dark={{
                              color: 'warmGray.200',
                            }}
                            fontWeight="400">
                            Taxonomy Phylum : {taxonomyPhylum}
                          </Text>
                        </HStack>
                      </HStack>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Center>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
