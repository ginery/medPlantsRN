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
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
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

  // const [capturePhoto, setCaputePhoto] = React.useState(false);
  console.log(device);
  React.useEffect(() => {
    requestCameraPermission();
    // const device = devices.back;
    // if (device == null) {
    //   return <ActivityIndicator size={20} color={'red'} />;
    // }
  }, []);
  const requestCameraPermission = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
      // console.log(cameraPermission);
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
  const photoCapture = async () => {
    try {
      const photo = await camera.current.takeSnapshot();
      // console.log(photo.path);
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
          console.log(photo.path);
          fetch('https://api.plant.id/v2/identify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToScan),
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
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
            <Icon name="bars" size={22} color="white" />
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
          <Center>
            <Button
              onPress={() => {
                photoCapture();
              }}>
              SCAN
            </Button>
          </Center>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
