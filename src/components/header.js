import React from 'react';
import {
  NativeBaseProvider,
  Box,
  VStack,
  HStack,
  Button,
  IconButton,
  Text,
  Center,
  StatusBar,
  Pressable,
  Link,
  FormControl,
  Heading,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Alert, TouchableOpacity, View} from 'react-native';
const HeaderComponent = props => {
  const appDrawer = () => {
    Alert.alert('test');
    props.appDrawer;
  };
  return (
    <>
      <Box safeAreaTop backgroundColor="#54b5df" />
      <HStack
        bg="#98d6f1"
        px={3}
        py={4}
        justifyContent="space-between"
        alignItems="center">
        <HStack space={4} alignItems="center">
          <TouchableOpacity onPress={appDrawer}>
            <Icon name="bars" size={22} color="white" />
          </TouchableOpacity>
          <Text color="white" fontSize={20} fontWeight="bold">
            Home
          </Text>
        </HStack>
        <HStack space={2}>
          <TouchableOpacity>
            <Icon name="ellipsis-v" size={20} color="white" />
          </TouchableOpacity>
        </HStack>
      </HStack>
    </>
  );
};

export default HeaderComponent;
