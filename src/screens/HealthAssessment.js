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
  TextArea,
  Input,
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
  const [assessmentExist, setAssessmentExist] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      console.log(camera);
      setEnableCamera(true);
    });

    return unsubscribe;
  }, [navigation]);

  function scanAssessmentID(assessment_name) {
    // console.log(entity_id);
    const formData = new FormData();
    formData.append('assessment_name', assessment_name);
    fetch(window.name + 'scanAssessment.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        var data = responseJson.array_data[0];
        if (responseJson.array_data != '') {
          setAssessmentScanId(data.entity_id);
          setAssesstName(data.assessment_name);
          setAssessmentDesc(data.assessment_description);
          setCommonName(data.assessment_common_name);
          setAssessmentBiological(data.assessment_biological);
          setAssessmentPrevention(data.assessment_prevention);
          setAssessmentExist(true);
        } else {
          setAssessmentExist(false);
        }
      })
      .catch(error => {
        setModalVisible(false);
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  }
  const photoCapture = async () => {
    try {
      setModalVisible(true);
      const photo = await camera.current.takeSnapshot();
      console.log(photo.path);
      RNFS.readFile(photo.path, 'base64')
        .then(base64files => {
          setPhotoBase64('data:image/jpeg;base64,' + base64files);
          const dataToScan = {
            api_key: 'W4h32XMclIrz3b5dbzHTGazTVXzW2qGicQ4ZpWm5ibif1QETf2',
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
              scanAssessmentID(data.health_assessment.diseases[0].name);
              if (data.health_assessment.is_healthy == false) {
                if (assessmentExist == false) {
                  setAssessmentScanId(data.id);
                  setAssesstName(data.health_assessment.diseases[0].name);
                  setAssessmentDesc(
                    data.health_assessment.diseases[0].disease_details
                      .description,
                  );
                  setCommonName(
                    data.health_assessment.diseases[0].disease_details
                      .common_names[0],
                  );
                  setAssessmentBiological(
                    data.health_assessment.diseases[0].disease_details.treatment
                      .biological[0],
                  );
                  setAssessmentPrevention(
                    data.health_assessment.diseases[0].disease_details.treatment
                      .prevention[0],
                  );
                }
                console.log(data.health_assessment.diseases[0].disease_details);
                setAssessmentPhoto(photo.path);
                setModalPlantsDescription(true);
              } else {
                Alert.alert('This plant is healthy!');
              }

              // console.log(data.health_assessment.diseases);
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
        // console.log(data);
        if (data.res == 1) {
          setModalVisible(false);
          setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">
                    Great! Successfully added assessment.
                  </Text>
                </Box>
              );
            },
          });
        } else if (data.res == 2) {
          setModalVisible(false);
          // setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Assessment already exist.</Text>
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
  const updateAssessment = () => {
    setModalVisible(true);

    const formData = new FormData();
    formData.append('assessmentScanId', assessmentScanId);
    formData.append('assessmentName', assessmentName);
    formData.append('assessmentCommonName', assessmentCommonName);
    formData.append('assessmentDesc', assessmentDesc);
    formData.append('assessmentBiological', assessmentBiological);
    formData.append('assessmentPrevention', assessmentPrevention);

    fetch(window.name + 'updateAssessment.php', {
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
        // console.log(data);
        if (data.res == 1) {
          setModalVisible(false);
          setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">
                    Great! Successfully updated the assessment.
                  </Text>
                </Box>
              );
            },
          });
        } else if (data.res == 2) {
          setModalVisible(false);
          // setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Assessment already exist.</Text>
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
        <Box alignItems="center" width="100%">
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
          <Center mt={10} width="100%">
            <HStack width="100%" space={2}>
              <TouchableOpacity
                onPress={() => {
                  photoCapture();
                }}
                style={{
                  width: '49%',
                  height: 70,
                }}>
                <Center bg="#28a745" width="100%" height="100%">
                  <HStack alignContent="center" alignItems="center">
                    <FontIcon name="camera" size={20} color="white" />
                    <Text fontSize="lg" color="white">
                      {' '}
                      SCAN
                    </Text>
                  </HStack>
                </Center>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Health Assessment List');
                }}
                style={{
                  width: '49%',
                  height: 70,
                }}>
                <Center bg="#28a745" width="100%" height="100%">
                  <HStack alignContent="center" alignItems="center">
                    <FontIcon name="list" size={20} color="white" />
                    <Text fontSize="lg" color="white">
                      {' '}
                      View List
                    </Text>
                  </HStack>
                </Center>
              </TouchableOpacity>
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
          <Center bg="#28a7458c" width="50%" height="20%" borderRadius={10}>
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
            <Center width="100%" height="80%" borderRadius={5}>
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
                    <ScrollView
                      nestedScrollEnabled={true}
                      w={['100%', '300']}
                      style={{
                        borderColor: 'black',
                        borderBottomWidth: 1,
                        borderStyle: 'dashed',
                      }}>
                      <Stack p="4" space={0} width="100%">
                        <Stack width="100%" space={2}>
                          {/* <Heading size="md" ml="-1">
                            {assessmentName}
                          </Heading>  */}
                          <Input
                            color="#28a745"
                            value={assessmentName}
                            onChangeText={text => setAssesstName(text)}
                          />
                          <Text
                            fontSize="md"
                            _light={{
                              color: 'gray.700',
                            }}
                            _dark={{
                              color: 'gray.700',
                            }}
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1">
                            Common Name:
                          </Text>
                          <Input
                            color="gray.500"
                            value={assessmentCommonName}
                            onChangeText={text => setAssesstName(text)}
                          />
                        </Stack>
                        <Box
                          mb={5}
                          width="100%"
                          style={{
                            // borderColor: 'black',
                            // borderWidth: 1,
                            height: 90,
                          }}>
                          <Text
                            fontSize="md"
                            _light={{
                              color: 'gray.700',
                            }}
                            _dark={{
                              color: 'gray.700',
                            }}
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1">
                            Description:
                          </Text>
                          <TextArea
                            value={assessmentDesc}
                            onChangeText={text => setAssessmentDesc(text)}
                            h={20}
                            placeholder="Enter Description.."
                          />
                        </Box>
                        <HStack
                          mb={5}
                          width="100%"
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <HStack alignItems="center">
                            <Box
                              width="100%"
                              style={{
                                // borderColor: 'black',
                                // borderWidth: 1,
                                height: 90,
                              }}>
                              <Text
                                fontSize="md"
                                _light={{
                                  color: 'gray.700',
                                }}
                                _dark={{
                                  color: 'gray.700',
                                }}
                                fontWeight="500"
                                ml="-0.5"
                                mt="-1">
                                Biological:
                              </Text>
                              {/* <ScrollView
                                nestedScrollEnabled={true}
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
                              </ScrollView> */}
                              <TextArea
                                value={assessmentBiological}
                                onChangeText={text =>
                                  setAssessmentBiological(text)
                                }
                                h={20}
                              />
                            </Box>
                          </HStack>
                        </HStack>
                        <HStack
                          mb={5}
                          width="100%"
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <Box
                            width="100%"
                            style={{
                              // borderColor: 'black',
                              // borderWidth: 1,
                              height: 90,
                            }}>
                            <Text
                              fontSize="md"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Prevention:
                            </Text>
                            {/* <ScrollView
                              nestedScrollEnabled={true}
                              w={['100%', '200']}>
                              <Text
                                color="coolGray.600"
                                _dark={{
                                  color: 'warmGray.200',
                                }}
                                fontWeight="400">
                                Prevention : {assessmentPrevention}
                              </Text>
                            </ScrollView> */}
                            <TextArea
                              value={assessmentPrevention}
                              onChangeText={text =>
                                setAssessmentPrevention(text)
                              }
                              h={20}
                              placeholder="Enter Prevention.."
                            />
                          </Box>
                        </HStack>
                      </Stack>
                    </ScrollView>
                    {assessmentExist == true ? (
                      <Button
                        bgColor="#257f3a"
                        bg="#28a745"
                        onPress={() => {
                          updateAssessment();
                        }}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        bgColor="#257f3a"
                        bg="#28a745"
                        onPress={() => {
                          saveAssessment();
                        }}>
                        Add Assessment
                      </Button>
                    )}
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
