import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';

const PlaybackScreen = ({ route }) => {
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({}); //Play Audio
  const [isRepeatMode, setIsRepeatMode] = useState(false); // Playback 
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

    return () => {
      if (playbackObject) {
        playbackObject.unloadAsync();
      }
    };
  }, [recording.uri]);

  const updatePlaybackStatus = (status) => {
    if (status.didJustFinish && isRepeatMode) {
      playbackObject.setPositionAsync(0).then(() => {
        playbackObject.playAsync();
        setIsRepeatMode(false); // Audio will repeat once
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
        await playbackObject.stopAsync();
        await playbackObject.setPositionAsync(0);
        await playbackObject.playAsync();
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{recording.name}</Text>
      
      <View style={styles.layout}>
        {/* Time Duration */}
        {/* Time Animation In-progress */}
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
/* Controls Layout */
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
/* Icon Layout */
IconLayout:{
alignItems: 'center',
justifyContent: 'center',
},
IconCircle: {
backgroundColor: '#0B3954',
borderRadius: 25,
width: 50,
height: 50,
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
