import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Audio } from 'expo-av';

const PlaybackScreen = ({ route }) => {
  const { recordingsList } = route.params;
  const [playbackObject, setPlaybackObject] = React.useState(null);
  const [playbackStatus, setPlaybackStatus] = React.useState({});

  const playRecording = async (uri) => {
    // Stop any currently playing recording
    if (playbackObject) {
      await playbackObject.stopAsync();
      await playbackObject.unloadAsync();
    }

    // Create a new playback object and load the recording
    const newPlaybackObject = new Audio.Sound();
    try {
      await newPlaybackObject.loadAsync({ uri }, {}, true);
      newPlaybackObject.setOnPlaybackStatusUpdate(setPlaybackStatus); // Update playback status
      await newPlaybackObject.playAsync();
      setPlaybackObject(newPlaybackObject);
    } catch (error) {
      console.error('Failed to load the recording', error);
    }
  };

  const fastForward = async () => {
    if (!playbackObject || !playbackStatus.isLoaded) return;
    const position = playbackStatus.positionMillis + 5000; // 5 seconds ahead
    await playbackObject.setPositionAsync(position);
  };

  const backtrack = async () => {
    if (!playbackObject || !playbackStatus.isLoaded) return;
    const position = Math.max(0, playbackStatus.positionMillis - 5000); // 5 seconds back
    await playbackObject.setPositionAsync(position);
  };

  const stopPlayback = async () => {
    if (!playbackObject || !playbackStatus.isLoaded) return;
    await playbackObject.stopAsync();
    setPlaybackStatus({}); // Reset playback status
  };

  React.useEffect(() => {
    return () => {
      if (playbackObject) {
        playbackObject.unloadAsync();
      }
    };
  }, [playbackObject]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recordings</Text>
      <ScrollView style={styles.recordingsList}>
        {recordingsList.map((recording, index) => (
          <TouchableOpacity key={index} style={styles.recordingItem} onPress={() => playRecording(recording.uri)}>
            <Text style={styles.recordingText}>{recording.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.controls}>
        <TouchableOpacity onPress={fastForward}>
          <Text>Fast Forward 5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={backtrack}>
          <Text>Backtrack 5s</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopPlayback}>
          <Text>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    margin: 20,
  },
  recordingsList: {
    width: '100%',
  },
  recordingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recordingText: {
    fontSize: 16,
    color: 'black',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default PlaybackScreen;
  