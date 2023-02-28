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
  Image,
  Flex,
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
export default function AssessmentDetailsScreen({navigation, route}) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [assessmentName, setAssesstName] = React.useState('N/A');
  const [assessmentCommonName, setCommonName] = React.useState('N/A');
  const [assessmentDesc, setAssessmentDesc] = React.useState('N/A');
  const [assessmentBiological, setAssessmentBiological] = React.useState('N/A');
  const [assessmentPrevention, setAssessmentPrevention] = React.useState('N/A');
  const [assesmentImage, setAssessmentImage] = React.useState('');
  const {assessment_id} = route.params;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setModalVisible(true);
      getAssessmentDetails();
    });

    return unsubscribe;
  }, [navigation]);
  function getAssessmentDetails() {
    const formData = new FormData();
    formData.append('assessment_id', assessment_id);
    fetch(window.name + 'getAssessmentDetails.php', {
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
          setAssesstName(data.assessment_name);
          setAssessmentDesc(data.assessment_description);
          setCommonName(data.assessment_common_name);
          setAssessmentBiological(data.assessment_biological);
          setAssessmentPrevention(data.assessment_prevention);
          setAssessmentImage(data.assessment_img);
          setModalVisible(false);
        } else {
          setModalVisible(false);
        }
      })
      .catch(error => {
        setModalVisible(false);
        console.error(error, 'getAssessmentDetails');
        Alert.alert('Internet Connection Error');
      });
  }
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
              navigation.goBack();
            }}>
            <FontIcon name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            MedPlants
          </Text>
        </HStack>
      </HStack>

      <Box p="3" h="92%" w="100%">
        <ScrollView w={['100%', '300']} h="80">
          <Center
            alignContent="flex-start"
            alignItems="flex-start"
            width="100%">
            <Center width="100%">
              {assesmentImage != '' && (
                <Image
                  style={{
                    borderWidth: 2,
                    borderColor: '#28a745',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: global.global_image + 'assessment/' + assesmentImage,
                  }}
                  alt="Alternate Text"
                  size={300}
                />
              )}
              <Heading
                color="#28a745"
                // borderBottomColor="#28a745"
                // borderBottomWidth={1}
              >
                {assessmentName}
              </Heading>
            </Center>
            <VStack
              width="100%"
              //  borderColor="black"
              //  borderWidth={1}
            >
              <Text fontWeight="medium">Common Name: </Text>
              <Text textAlign="justify">{assessmentCommonName} </Text>
            </VStack>
            <VStack
              width="100%"
              //  borderColor="black"
              //  borderWidth={1}
            >
              <Text fontWeight="medium">Biological: </Text>
              <Text textAlign="justify">{assessmentBiological} </Text>
            </VStack>
            <VStack
              width="100%"
              //  borderColor="black"
              //  borderWidth={1}
            >
              <Text fontWeight="medium">Prevention: </Text>
              <Text textAlign="justify">{assessmentPrevention} </Text>
            </VStack>
            <VStack width="100%">
              <Text fontWeight="medium">Description: </Text>
              <Text textAlign="justify">{assessmentDesc} </Text>
            </VStack>
          </Center>
        </ScrollView>
      </Box>

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
            <Text color="white">Loading data....</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
