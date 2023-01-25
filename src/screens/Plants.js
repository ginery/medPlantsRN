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
import {useNavigation} from '@react-navigation/native';
import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
export default function PlantsScreen() {
  const camera = React.useRef(null);
  const navigation = useNavigation();
  const toast = useToast();
  const devices = useCameraDevices();
  const device = devices.back;
  const [modalVisible, setModalVisible] = React.useState(false);
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
          const dataToScan = {
            api_key: 'q10yUB5d4CeEX0HMvsSmGdjikogR7kX4oW8idHOfJeqWHy0mnW',
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
                setPlantName(data.suggestions[0].plant_name);
                setPlantAuthority(
                  data.suggestions[0].plant_details.name_authority,
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
              isActive={true}
              // frameProcessor={frameProcessor}
              photo={true}
            />
          ) : null}
          <Center mt={10}>
            <Button
              onPress={() => {
                photoCapture();
              }}>
              <HStack>
                <Icon as={<FontIcon name="camera" />} size="5" color="white" />
                <Text color="white" fontWeight="bold">
                  {'  '}
                  SCAN
                </Text>
              </HStack>
            </Button>
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
                    <Button
                      bgColor="#257f3a"
                      bg="#28a745"
                      onPress={() => console.log('hello world')}>
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
