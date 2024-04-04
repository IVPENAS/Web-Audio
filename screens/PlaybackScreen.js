import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';

const PlaybackScreen = ({ route }) => {
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({}); //Play
  const [isRepeatMode, setIsRepeatMode] = useState(false); // Repeat
  const { recording } = route.params;

  useEffect(() => {
    // Initialize playback object
    const initPlaybackObject = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recording.uri },
        { shouldPlay: true },
        updatePlaybackStatus
      );
      setPlaybackObject(sound);
    };

    initPlaybackObject();

    // Cleanup function to unload playback object when component unmounts
    return () => {
      if (playbackObject) {
        playbackObject.unloadAsync();
      }
    };
  }, [recording.uri]); // Reacting to changes in recording.uri

  const updatePlaybackStatus = (status) => {
    if (status.didJustFinish && isRepeatMode) {
      // Replay the audio once and then turn off repeat mode
      playbackObject.setPositionAsync(0).then(() => {
        playbackObject.playAsync();
        setIsRepeatMode(false); // Ensure it only replays once
      });
    }
    setPlaybackStatus(status);
  };

  /* Media Control */
  const controlPlayback = async (action) => {
    if (!playbackObject) return;

    switch (action) {
      case 'play':
        if (playbackStatus.isPlaying) {
          await playbackObject.pauseAsync();
        } else {
          await playbackObject.playAsync();
        }
        break;
      case 'forward':
        await playbackObject.setPositionAsync(playbackStatus.positionMillis + 1000);
        break;
      case 'backward':
        await playbackObject.setPositionAsync(Math.max(0, playbackStatus.positionMillis - 1000));
        break;
      case 'repeat':
        await playbackObject.stopAsync(); // Ensure playback is stopped before resetting position
        await playbackObject.setPositionAsync(0); // Reset to start
        await playbackObject.playAsync(); // Start playing immediately
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{recording.name}</Text>
      
      <View style={styles.layout}>
        {/* Time Duration */}
        {/* Line Animation Inprogrss */}
      </View>

      {/* Repeat Toggle */}
      <TouchableOpacity onPress={() => controlPlayback('repeat')}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="sync-alt" size={25} color="#0B3954"/>
            <Text style = {styles.IconText}>
            Repeat
          </Text>
          </View>
        </TouchableOpacity>

      <View style={styles.controls}>
        {/* Forward +5s */}
        <TouchableOpacity onPress={() => controlPlayback('forward')} >
        <View style={styles.iconContainer}>
          <FontAwesome5 name="redo-alt" size={25} color="#0B3954"/>
          <Text style = {styles.IconText}>
            +1s
          </Text>
        </View>
        </TouchableOpacity>

        {/* Play & Pause */}
        <TouchableOpacity onPress={() => controlPlayback('play')}>
          <View style={[styles.IconCircle, styles.iconContainer]}>
            <FontAwesome5
              name={playbackStatus.isPlaying ? "pause" : "play"}
              size={20}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        {/* Backward -5s */}
        <TouchableOpacity onPress={() => controlPlayback('backward')} >
        <View style={styles.iconContainer}>
          <FontAwesome5 name="undo-alt" size={25} color="#0B3954"/>
          <Text style = {styles.IconText}>
            -1s
          </Text>
        </View>
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    marginTop: 20,
  },
  layout:{
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  /* Icons */
  IconLayout:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconCircle: {
    backgroundColor: '#0B3954', // Adjust color as needed
    borderRadius: 25, // Half of width and height to create circle
    width: 50, // Circle width
    height: 50, // Circle height
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{translateY: -5}],
  },
  IconText:{
    paddingTop: 5,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#0B3954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlaybackScreen;
