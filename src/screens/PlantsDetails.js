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
export default function PlantDetailsScreen({navigation, route}) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [assessmentData, setAssessmentData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [plantName, setPlantName] = React.useState('N/A');
  const [plantAuthority, setPlantAuthority] = React.useState('N/A');
  const [plantSynonyms, setPlantSynonyms] = React.useState('N/A');
  const [plantDesc, setPlantDesc] = React.useState('N/A');
  const [taxonomyClass, setTaxonomyClass] = React.useState('N/A');
  const [taxonomyFamily, setTaxonomyFamily] = React.useState('N/A');
  const [taxonomyGenus, setTaxonomyGenus] = React.useState('N/A');
  const [taxonomyKingdom, setTaxonomyKingdom] = React.useState('N/A');
  const [taxonomyOrder, setTaxonomyOrder] = React.useState('N/A');
  const [taxonomyPhylum, setTaxonomyPhylum] = React.useState('N/A');
  const [plantScanId, setPlantScanId] = React.useState(0);
  const [plantExist, setPlantExist] = React.useState(false);
  const [plantImage, setPlantImage] = React.useState('');
  const [curableDiseases, setCurableDiseases] = React.useState('');
  const {plant_id} = route.params;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setModalVisible(true);
      getPlantDetails();
    });

    return unsubscribe;
  }, [navigation]);
  function getPlantDetails() {
    const formData = new FormData();
    formData.append('plant_id', plant_id);
    fetch(window.name + 'getPlantsDetails.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
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
          setPlantImage(data.plant_img);
          setModalVisible(false);
        } else {
          setModalVisible(false);
        }
      })
      .catch(error => {
        setModalVisible(false);
        console.error(error, 'getPlantDetails');
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
              {plantImage != '' && (
                <Image
                  style={{
                    borderWidth: 2,
                    borderColor: '#28a745',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: global.global_image + 'file/' + plantImage,
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
                {plantName}
              </Heading>
            </Center>

            <VStack
              width="100%"
              //  borderColor="black"
              //  borderWidth={1}
            >
              <Text fontWeight="medium">Authority: </Text>
              <Text textAlign="justify">{plantAuthority} </Text>
            </VStack>
            <VStack
              width="100%"
              //  borderColor="black"
              //  borderWidth={1}
            >
              <Text fontWeight="medium">Synonyms: </Text>
              <Text textAlign="justify">{plantSynonyms} </Text>
            </VStack>

            <HStack>
              <Text fontWeight="medium">Class: </Text>
              <Text textAlign="justify">{taxonomyClass} </Text>
              <Text fontWeight="medium">Family: </Text>
              <Text textAlign="justify">{taxonomyFamily} </Text>
            </HStack>
            <HStack>
              <Text fontWeight="medium">Genus: </Text>
              <Text textAlign="justify">{taxonomyGenus} </Text>
              <Text fontWeight="medium">Kingdom: </Text>
              <Text textAlign="justify">{taxonomyKingdom} </Text>
            </HStack>
            <HStack>
              <Text fontWeight="medium">Order: </Text>
              <Text textAlign="justify">{taxonomyOrder} </Text>
              <Text fontWeight="medium">Phylum: </Text>
              <Text textAlign="justify">{taxonomyPhylum} </Text>
            </HStack>

            <VStack width="100%">
              <Text fontWeight="medium">Description: </Text>
              <Text textAlign="justify">{plantDesc} </Text>
            </VStack>
            <VStack width="100%">
              <Text fontWeight="medium">Curable Diseases/Ailment: </Text>
              <Text textAlign="justify">{curableDiseases} </Text>
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
