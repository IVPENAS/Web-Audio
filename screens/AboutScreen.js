import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AboutScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>This is the about screen</Text>
      <Button title="Go to about screen" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

export default AboutScreen;