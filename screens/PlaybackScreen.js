import React from 'react';
import { View, Text} from 'react-native';

function PlaybackScreen({ route }) {
  const { recordingUris } = route.params;

  return (
    <View>
      {recordingUris.map((uri, index) => (
        <View key={index}>
          <Text>Recording {index + 1}</Text>
        </View>
      ))}
    </View>
  );
}


export default PlaybackScreen;