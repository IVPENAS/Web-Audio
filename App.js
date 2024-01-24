import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PlaybackScreen from './screens/PlaybackScreen';
import HomeScreen from './screens/HomeScreen';
import RecordScreen from './screens/RecordScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="PlaybackScreen" component={PlaybackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;