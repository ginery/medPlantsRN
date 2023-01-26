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
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
export default function HealthAssessmentScreen() {
  const isFocused = useIsFocused();
  const camera = React.useRef(null);
  const navigation = useNavigation();
  const toast = useToast();
  const devices = useCameraDevices();
  const device = devices.back;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [enableCamera, setEnableCamera] = React.useState(false);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [assessmentScanId, setAssessmentScanId] = React.useState(0);
  const [assessmentName, setAssesstName] = React.useState('N/A');
  const [assessmentCommonName, setCommonName] = React.useState('N/A');
  const [assessmentDesc, setAssessmentDesc] = React.useState('N/A');
  const [photoBase64, setPhotoBase64] = React.useState('');
  const [assessmentPhoto, setAssessmentPhoto] = React.useState('');
  const [assessmentBiological, setAssessmentBiological] = React.useState('N/A');
  const [assessmentPrevention, setAssessmentPrevention] = React.useState('N/A');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      console.log(camera);
      setEnableCamera(true);
    });

    return unsubscribe;
  }, [navigation]);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';

      console.log(frame);
    },
    [0.4],
  );
  const photoCapture = async () => {
    try {
      setModalVisible(true);
      const photo = await camera.current.takeSnapshot();
      console.log(photo.path);
      RNFS.readFile(photo.path, 'base64')
        .then(base64files => {
          setPhotoBase64('data:image/jpeg;base64,' + base64files);
          const dataToScan = {
            api_key: 'eqrx10kK3Oz53iDgiZytx1q71pr6Mk1hnbIZCFuZIECchVuW0D',
            images: ['data:image/jpeg;base64,' + base64files],
            modifiers: ['crops_fast', 'similar_images'],
            language: 'en',
            disease_details: [
              'cause',
              'common_names',
              'classification',
              'description',
              'treatment',
              'url',
            ],
          };
          // console.log(photo.path);
          fetch('https://api.plant.id/v2/health_assessment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToScan),
          })
            .then(response => response.json())
            .then(data => {
              setModalVisible(false);
              if (data.health_assessment.is_healthy == false) {
                setAssessmentScanId(data.id);
                setAssesstName(data.health_assessment.diseases[0].name);
                setAssessmentDesc(
                  data.health_assessment.diseases[0].disease_details
                    .description,
                );
                setCommonName(
                  data.health_assessment.diseases[0].disease_details
                    .common_names,
                );
                setAssessmentBiological(
                  data.health_assessment.diseases[0].disease_details.treatment
                    .biological,
                );
                setAssessmentPrevention(
                  data.health_assessment.diseases[0].disease_details.treatment
                    .prevention,
                );
                setAssessmentPhoto(photo.path);
                setModalPlantsDescription(true);
              } else {
                Alert.alert('This plant is health!.');
              }

              console.log(data.health_assessment.diseases[0].disease_details);
            });
        })
        .catch(err => {
          console.log('read error');
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const saveAssessment = () => {
    setModalVisible(true);
    const uriPart = assessmentPhoto.split('.');
    const fileExtension = uriPart[uriPart.length - 1];
    const formData = new FormData();
    formData.append('assessmentScanId', assessmentScanId);
    formData.append('assessmentName', assessmentName);
    formData.append('assessmentCommonName', assessmentCommonName);
    formData.append('assessmentDesc', assessmentDesc);
    formData.append('assessmentPhoto', photoBase64);
    formData.append('assessmentBiological', assessmentBiological);
    formData.append('assessmentPrevention', assessmentPrevention);
    fetch(window.name + 'addAssessment.php', {
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
        if (data.res == 1) {
          setModalVisible(false);
          setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Great! Successfully added Plants.</Text>
                </Box>
              );
            },
          });
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
        <Heading>Health Assessment</Heading>
        <Box alignItems="center">
          {/* <Camera
            style={{width: 500, height: 200}}
            device={device}
            isActive={true}
          /> */}
          {device != null ? (
            <Camera
              ref={camera}
              style={{width: 500, height: 400}}
              device={device}
              isActive={isFocused}
              // frameProcessor={frameProcessor}
              photo={isFocused}
            />
          ) : null}
          <Center mt={10}>
            <HStack>
              <Button
                onPress={() => {
                  photoCapture();
                }}>
                <HStack>
                  <Icon
                    as={<FontIcon name="camera" />}
                    size="5"
                    color="white"
                  />
                  <Text color="white" fontWeight="bold">
                    {'  '}
                    SCAN
                  </Text>
                </HStack>
              </Button>
              <Button
                ml="1"
                onPress={() => {
                  navigation.navigate('Health Assessment List');
                }}>
                <HStack>
                  <Icon as={<FontIcon name="list" />} size="5" color="white" />
                  <Text color="white" fontWeight="bold">
                    {'  '}
                    View List
                  </Text>
                </HStack>
              </Button>
            </HStack>
          </Center>
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
                            uri: 'file://' + assessmentPhoto,
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
                          {assessmentName}
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
                          {assessmentCommonName}
                        </Text>
                      </Stack>
                      <Box
                        style={{
                          // borderColor: 'black',
                          // borderWidth: 1,
                          height: 90,
                        }}>
                        <ScrollView
                          w={['100%', '300']}
                          style={{
                            borderColor: 'black',
                            borderBottomWidth: 1,
                            borderStyle: 'dashed',
                          }}>
                          <Text fontWeight="400">{assessmentDesc}</Text>
                        </ScrollView>
                      </Box>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <HStack alignItems="center">
                          <Box
                            style={{
                              // borderColor: 'black',
                              // borderWidth: 1,
                              height: 90,
                            }}>
                            <ScrollView
                              w={['100%', '300']}
                              style={{
                                borderColor: 'black',
                                borderBottomWidth: 1,
                                borderStyle: 'dashed',
                              }}>
                              <Text
                                color="coolGray.600"
                                _dark={{
                                  color: 'warmGray.200',
                                }}
                                fontWeight="400">
                                Biological : {assessmentBiological}
                              </Text>
                            </ScrollView>
                          </Box>
                        </HStack>
                      </HStack>
                      <HStack
                        alignItems="center"
                        space={1}
                        justifyContent="space-between">
                        <Box
                          style={{
                            // borderColor: 'black',
                            // borderWidth: 1,
                            height: 90,
                          }}>
                          <ScrollView w={['100%', '200']}>
                            <Text
                              color="coolGray.600"
                              _dark={{
                                color: 'warmGray.200',
                              }}
                              fontWeight="400">
                              Prevention : {assessmentPrevention}
                            </Text>
                          </ScrollView>
                        </Box>
                      </HStack>
                    </Stack>
                    <Button
                      bgColor="#257f3a"
                      bg="#28a745"
                      onPress={() => {
                        saveAssessment();
                      }}>
                      Save Changes
                    </Button>
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
