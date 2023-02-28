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
  Input,
  TextArea,
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
export default function PlantsScreen() {
  const isFocused = useIsFocused();
  const camera = React.useRef(null);
  const navigation = useNavigation();
  const toast = useToast();
  const devices = useCameraDevices();
  const device = devices.back;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [enableCamera, setEnableCamera] = React.useState(false);
  const [plantName, setPlantName] = React.useState('N/A');
  const [plantAuthority, setPlantAuthority] = React.useState('N/A');
  const [plantSynonyms, setPlantSynonyms] = React.useState('N/A');
  const [plantDesc, setPlantDesc] = React.useState('N/A');
  const [photoBase64, setPhotoBase64] = React.useState('');
  const [plantPhoto, setPlantPhoto] = React.useState('');
  const [taxonomyClass, setTaxonomyClass] = React.useState('N/A');
  const [taxonomyFamily, setTaxonomyFamily] = React.useState('N/A');
  const [taxonomyGenus, setTaxonomyGenus] = React.useState('N/A');
  const [taxonomyKingdom, setTaxonomyKingdom] = React.useState('N/A');
  const [taxonomyOrder, setTaxonomyOrder] = React.useState('N/A');
  const [taxonomyPhylum, setTaxonomyPhylum] = React.useState('N/A');
  const [plantScanId, setPlantScanId] = React.useState(0);
  const [plantExist, setPlantExist] = React.useState(false);
  const [curableDiseases, setCurableDiseases] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');
      console.log(isFocused);
      setEnableCamera(true);
    });

    return unsubscribe;
  }, [navigation]);
  function scanPlantID(plant_name) {
    const formData = new FormData();
    formData.append('plant_name', plant_name);
    fetch(window.name + 'scanPlant.php', {
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
          setPlantScanId(data.plant_id);
          setPlantName(data.plant_name);
          setPlantAuthority(data.plant_name_authority);
          setPlantSynonyms(data.plant_synonyms);
          setPlantDesc(data.plant_description);
          setTaxonomyClass(data.plant_taxonomy_class);
          setTaxonomyFamily(data.plant_taxonomy_family);
          setTaxonomyGenus(data.plant_taxonomy_genus);
          setTaxonomyKingdom(data.plant_taxonomy_kingdom);
          setTaxonomyOrder(data.plant_taxonomy_order);
          setTaxonomyPhylum(data.plant_taxonomy_phylum);
          setCurableDiseases(data.curable_diseases);
          setPlantExist(true);
        } else {
          setPlantExist(false);
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
            api_key: '4DL1S4fe6BCYhUm7TnZPe9gFBXGaWBm3JLXu3DNtGAaQlA6ZT8',
            images: ['data:image/jpeg;base64,' + base64files],
            modifiers: ['crops_fast', 'similar_images'],
            plant_language: 'en',
            plant_details: [
              'common_names',
              'url',
              'name_authority',
              'wiki_description',
              'taxonomy',
              'synonyms',
            ],
          };
          // console.log(photo.path);
          fetch('https://api.plant.id/v2/identify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToScan),
          })
            .then(response => response.json())
            .then(data => {
              setModalVisible(false);
              if (data.is_plant == true) {
                scanPlantID(data.suggestions[0].plant_name);
                if (plantExist == false) {
                  setPlantScanId(data.suggestions[0].id);
                  setPlantName(data.suggestions[0].plant_name);
                  setPlantAuthority(
                    data.suggestions[0].plant_details.name_authority,
                  );
                  setPlantSynonyms(
                    data.suggestions[0].plant_details.synonyms[0],
                  );
                  setPlantDesc(
                    data.suggestions[0].plant_details.wiki_description.value,
                  );
                  setTaxonomyClass(
                    data.suggestions[0].plant_details.taxonomy.class,
                  );
                  setTaxonomyFamily(
                    data.suggestions[0].plant_details.taxonomy.family,
                  );
                  setTaxonomyGenus(
                    data.suggestions[0].plant_details.taxonomy.genus,
                  );
                  setTaxonomyKingdom(
                    data.suggestions[0].plant_details.taxonomy.kingdom,
                  );
                  setTaxonomyOrder(
                    data.suggestions[0].plant_details.taxonomy.order,
                  );
                  setTaxonomyPhylum(
                    data.suggestions[0].plant_details.taxonomy.phylum,
                  );
                }
                console.log(data.suggestions[0].plant_details.synonyms);
                setPlantPhoto(photo.path);
                setModalPlantsDescription(true);
              } else {
                Alert.alert('It seems this is not a plant.');
              }

              console.log(data.suggestions[0]);
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
  const savePlant = () => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('plantScanId', plantScanId);
    formData.append('plantName', plantName);
    formData.append('plantSynonyms', plantSynonyms);
    formData.append('plantAuthority', plantAuthority);
    formData.append('plantDesc', plantDesc);
    formData.append('plantPhoto', photoBase64);
    formData.append('taxonomyClass', taxonomyClass);
    formData.append('taxonomyFamily', taxonomyFamily);
    formData.append('taxonomyGenus', taxonomyGenus);
    formData.append('taxonomyKingdom', taxonomyKingdom);
    formData.append('taxonomyOrder', taxonomyOrder);
    formData.append('taxonomyPhylum', taxonomyPhylum);
    formData.append('curableDiseases', curableDiseases);
    fetch(window.name + 'addPlant.php', {
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
        } else if (data.res == 2) {
          setModalVisible(false);
          // setModalPlantsDescription(false);
          toast.show({
            render: () => {
              return (
                <Box bg="warning.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text color="white">Plant already exist.</Text>
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
  const updatePlant = () => {
    setModalVisible(true);
    const formData = new FormData();
    formData.append('plantScanId', plantScanId);
    formData.append('plantName', plantName);
    formData.append('plantSynonyms', plantSynonyms);
    formData.append('plantAuthority', plantAuthority);
    formData.append('plantDesc', plantDesc);
    formData.append('taxonomyClass', taxonomyClass);
    formData.append('taxonomyFamily', taxonomyFamily);
    formData.append('taxonomyGenus', taxonomyGenus);
    formData.append('taxonomyKingdom', taxonomyKingdom);
    formData.append('taxonomyOrder', taxonomyOrder);
    formData.append('taxonomyPhylum', taxonomyPhylum);
    formData.append('curableDiseases', curableDiseases);
    fetch(window.name + 'updatePlant.php', {
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
                  <Text color="white">
                    Great! Successfully updated the plants.
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
                  <Text color="white">Plant already exist.</Text>
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
        <Heading>Plants</Heading>
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
            {/* <HStack>
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
                  navigation.navigate('Plant List');
                }}>
                <HStack>
                  <Icon as={<FontIcon name="list" />} size="5" color="white" />
                  <Text color="white" fontWeight="bold">
                    {'  '}
                    View List
                  </Text>
                </HStack>
              </Button>
            </HStack> */}
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
                  navigation.navigate('Plant List');
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
          <Center bg="#28a7458c" width="50%" height="20%">
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
                    <ScrollView
                      nestedScrollEnabled={true}
                      w={['100%', '300']}
                      style={{
                        borderColor: 'black',
                        borderBottomWidth: 1,
                        borderStyle: 'dashed',
                      }}>
                      <Stack p="4" space={0}>
                        <Stack space={1}>
                          {/* <Heading size="md" ml="-1">
                            {plantName}
                          </Heading> */}
                          <Input
                            color="#28a745"
                            value={plantName}
                            onChangeText={text => setPlantName(text)}
                          />
                          <Text
                            fontSize="xs"
                            _light={{
                              color: 'gray.700',
                            }}
                            _dark={{
                              color: 'gray.700',
                            }}
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1">
                            Plant Authority:
                          </Text>
                          <Input
                            value={plantAuthority}
                            onChangeText={text => setPlantAuthority(text)}
                          />

                          <HStack
                            mb={1}
                            alignItems="center"
                            justifyContent="space-between">
                            <Box width="100%">
                              <Text
                                fontSize="xs"
                                _light={{
                                  color: 'gray.700',
                                }}
                                _dark={{
                                  color: 'gray.700',
                                }}
                                fontWeight="500"
                                ml="-0.5"
                                mt="-1">
                                Plant Synonyms:
                              </Text>
                              <TextArea
                                value={plantSynonyms}
                                onChangeText={text => setPlantSynonyms(text)}
                                h={20}
                              />
                            </Box>
                          </HStack>
                        </Stack>
                        <Box
                          mb={1}
                          style={
                            {
                              // borderColor: 'black',
                              // borderWidth: 1,
                            }
                          }>
                          <Text
                            fontSize="xs"
                            _light={{
                              color: 'gray.700',
                            }}
                            _dark={{
                              color: 'gray.700',
                            }}
                            fontWeight="500"
                            ml="-0.5"
                            mt="-1">
                            Plant Description:
                          </Text>
                          <TextArea
                            value={plantDesc}
                            onChangeText={text => setPlantDesc(text)}
                            h={20}
                          />
                        </Box>
                        <HStack
                          mb={1}
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Class:
                            </Text>
                            <Input
                              value={taxonomyClass}
                              onChangeText={text => setTaxonomyClass(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
                          mb={1}
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Family:
                            </Text>
                            <Input
                              value={taxonomyFamily}
                              onChangeText={text => setTaxonomyFamily(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
                          mb={1}
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Genus:
                            </Text>
                            <Input
                              value={taxonomyGenus}
                              onChangeText={text => setTaxonomyGenus(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
                          mb={1}
                          alignItems="center"
                          space={1}
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Kingdom:
                            </Text>
                            <Input
                              value={taxonomyKingdom}
                              onChangeText={text => setTaxonomyKingdom(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
                          mb={1}
                          alignItems="center"
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Order:
                            </Text>
                            <Input
                              value={taxonomyOrder}
                              onChangeText={text => setTaxonomyOrder(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
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
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Taxonomy Phylum:
                            </Text>
                            <Input
                              value={taxonomyPhylum}
                              onChangeText={text => setTaxonomyPhylum(text)}
                            />
                          </Box>
                        </HStack>
                        <HStack
                          mb={1}
                          alignItems="center"
                          justifyContent="space-between">
                          <Box width="100%">
                            <Text
                              fontSize="xs"
                              _light={{
                                color: 'gray.700',
                              }}
                              _dark={{
                                color: 'gray.700',
                              }}
                              fontWeight="500"
                              ml="-0.5"
                              mt="-1">
                              Curable Diseases/Ailment:
                            </Text>
                            <TextArea
                              value={curableDiseases}
                              onChangeText={text => setCurableDiseases(text)}
                              h={20}
                            />
                          </Box>
                        </HStack>
                      </Stack>
                    </ScrollView>
                    {plantExist == true ? (
                      <Button
                        bgColor="#257f3a"
                        bg="#28a745"
                        onPress={() => {
                          updatePlant();
                        }}>
                        Save Changes
                      </Button>
                    ) : (
                      <Button
                        bgColor="#257f3a"
                        bg="#28a745"
                        onPress={() => {
                          savePlant();
                        }}>
                        Add Plant
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
