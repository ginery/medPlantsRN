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
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [seachData, setSearchData] = React.useState('');
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
              query_data: item.plant_name,
            };
          });
          setModalVisible(false);
          setFilteredDataSource(data);
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
  const seachFunction = text => {
    if (text) {
      const newData = assessmentData.filter(function (item) {
        const itemData = item.query_data
          ? item.query_data.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearchData(text);
    } else {
      setSearchData(text);
      setFilteredDataSource(assessmentData);
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
              navigation.goBack();
            }}>
            <FontIcon name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            Scan Plants
          </Text>
        </HStack>
      </HStack>

      <Heading p="3">Plant List</Heading>
      <VStack w="100%" space={5} alignSelf="center">
        <Input
          value={seachData}
          onChangeText={text => seachFunction(text)}
          placeholder="Search Plant Name.."
          variant="filled"
          width="100%"
          borderRadius="10"
          py="1"
          px="2"
          bg="white"
          InputLeftElement={
            <Icon
              ml="2"
              size="4"
              color="gray.400"
              as={<FontIcon name="search" />}
            />
          }
        />
      </VStack>
      <Box p="3" h="80%" w="100%">
        <FlatList
          h="100%"
          w="100%"
          data={filteredDataSource}
          keyExtractor={item => item.plant_id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Plants Details', {
                  plant_id: item.plant_id,
                });
              }}>
              <Box
                bg="white"
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
                    alt="Alternate Text"
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
            </TouchableOpacity>
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
          <Center bg="#28a7458c" width="100%" height="100%">
            <ActivityIndicator size="large" color="white" />
            <Text color="white">Loading data....</Text>
          </Center>
        </Box>
      </Modal>
    </NativeBaseProvider>
  );
}
