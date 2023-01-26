import React from 'react';
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Center,
  HStack,
  Stack,
  NativeBaseProvider,
  Avatar,
} from 'native-base';
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
import Rating from 'react-native-easy-rating';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
export default function Profile({navigation}) {
  const [userFullName, setUserFullName] = React.useState('');
  const retrieveData = async () => {
    try {
      const valueString = await AsyncStorage.getItem('user_details');
      // console.log(valueString);
      const value = JSON.parse(valueString);
      if (value == null) {
        console.log('empty');
      } else {
        // console.log(value);
        setUserFullName(value.user_fname + ' ' + value.user_lname);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useState(() => {
    retrieveData();
  }, [1]);

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
          <Box
            h="100%"
            w="100%"
            // maxW="80"
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
                  width="100%"
                  height="100%"
                  source={require('../assets/images/medplants_cover.png')}
                  alt="image"
                />
              </AspectRatio>
              <Center alignSelf="center" position="absolute" bottom="0" pb="3">
                <Avatar
                  style={{
                    borderColor: 'white',
                    borderWidth: 4,
                  }}
                  w="100"
                  h="100"
                  alignSelf="center"
                  bg="amber.500"
                  source={require('../assets/images/profile.jpg')}>
                  AK
                </Avatar>
              </Center>
            </Box>
            <Stack p="4" space={3}>
              <Stack space={2}>
                <Heading size="md" ml="-1">
                  {userFullName}
                </Heading>
                <Text
                  fontSize="xs"
                  _light={{
                    color: 'violet.500',
                  }}
                  _dark={{
                    color: 'violet.400',
                  }}
                  fontWeight="500"
                  ml="-0.5"
                  mt="-1"></Text>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
