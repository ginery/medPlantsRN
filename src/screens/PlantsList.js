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
export default function PlantListScreen({navigation}) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      //console.log('refreshed_home');

      getHealthAssessment();
    });

    return unsubscribe;
  }, [navigation]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalPlantsDescription, setModalPlantsDescription] =
    React.useState(false);
  const [assessmentData, setAssessmentData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const getHealthAssessment = () => {
    setModalVisible(true);
    fetch(window.name + 'getPlants.php', {
      method: 'GET',
      header: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson);
        if (responseJson.array_data != '') {
          var data = responseJson.array_data.map(function (item, index) {
            return {
              plant_id: item.plant_id,
              plant_name: item.plant_name,
              plant_name_authority: item.plant_name_authority,
              plant_img: item.plant_img,
              date_added: item.date_added,
            };
          });

          setModalVisible(false);
          setAssessmentData(data);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Internet Connection Error');
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getHealthAssessment();

    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
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

      <Heading p="3">Plant List</Heading>
      <Box p="3" h="85%" w="100%">
        <FlatList
          h="100%"
          w="100%"
          data={assessmentData}
          keyExtractor={item => item.plant_id}
          renderItem={({item}) => (
            <Box
              bg="white"
              shadow={1}
              borderRadius={5}
              mb={1}
              borderWidth="1"
              _dark={{
                borderColor: '#28a745',
              }}
              borderColor="#28a745"
              pl={['0', '4']}
              pr={['0', '5']}
              py="2">
              <HStack space={[2, 3]} justifyContent="space-between" p={1}>
                <Image
                  size="48px"
                  source={{
                    uri: global.global_image + 'file/' + item.plant_img,
                  }}
                />
                <VStack width={150}>
                  <Text
                    _dark={{
                      color: '#28a745',
                    }}
                    color="#28a745"
                    bold>
                    {item.plant_name}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}>
                    {item.plant_name_authority}
                  </Text>
                </VStack>
                <Spacer />
                <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start">
                  {item.date_added}
                </Text>
              </HStack>
            </Box>
          )}
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              tintColor="#fff"
              titleColor="#fff"
              colors={['#28a745']}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </Box>

      <Modal
        style={{
          justifyContent: 'center',
        }}
        animationType="fade"
        transparent={true}
        visible={modalVisible}>
        <Box style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Center bg="#28a7458c" width="100%" height="100%" borderRadius={10}>
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Loading data....</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
