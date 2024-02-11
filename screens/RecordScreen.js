import React, { useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Pressable, Animated, Easing, FlatList, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons'

export default function App({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [onAudioSampleReceived, setOnAudioSampleReceived] = React.useState(null); // Declare the state
  const animatedValue = useRef(new Animated.Value(0)).current; 

  async function startRecording() {
    try {
      //Permission Audio Recording
      const perm = await Audio.requestPermissionsAsync();
      if(perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {}
    Animated.timing(animatedValue, {
      toValue: 1, // Animate to square
      duration: 250, // Duration of the animation
      useNativeDriver: false // This needs to be false to animate non-transform properties like borderRadius
    }).start();
  };

  //After recording it resets and saves the audio list
  async function stopRecording() {
    if (!recording){
      return;
    }
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    
    // Convert loaded audio to JSON string
    const loadedAudioJson = JSON.stringify({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    // Log the JSON string to the console
    console.log('Loaded Audio JSON:', loadedAudioJson);

    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });
    setRecordings(allRecordings);
    
    // Use the loaded audio JSON string as needed
    if (onAudioSampleReceived) {
      onAudioSampleReceived(loadedAudioJson);
    }
    Animated.timing(animatedValue, {
      toValue: 0, // Animate back to circle
      duration: 150, // Duration of the animation
      useNativeDriver: false // This needs to be false to animate non-transform properties like borderRadius
    }).start();
  };

  // Play Stop Animation
  const borderRadius = animatedValue.interpolate({
    inputRange: [0, 1.5],
    outputRange: [30, 0] // 30 is the initial borderRadius for a circle, 0 for a square
  });
  const animatedStyle = {
    borderRadius, 
  };

//Duration of the audio
  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60 ;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60 );
    return seconds < 10 ? `${Math.floor(minutes)}: 0${seconds}` : `${Math.floor(minutes)}: ${seconds}`
  }
  const progress = 40;
  
//Saved Audio Layout
  function getRecordingLines() {
    return recordings.map (( recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <View style = {styles.playbackContainer}>
            <View style = {styles.playbackBackground}>
              <Text style = {[styles.playbackIndicator, {left: `${progress}`}]}>
                {/* Recording #{index + 1} | {recordingLine.duration} */}
                </Text>
            </View>
          </View>
          <TouchableOpacity style = {styles.playButton} onPress= {() => recordingLine.sound.replayAsync()}>
              <FontAwesome5 name="play" size={17} color="gray"/>
          </TouchableOpacity>
        </View>
      );
    });
  }

  /* Navigation */
  const goToPlaybackScreen = () => {
    navigation.navigate('PlaybackScreen', { recordings: recordings });
  };

  /* Ripple */
  const rippleCount = 3; // Number of ripples
  const rippleAnim = Array.from({ length: rippleCount }, () => new Animated.Value(0));

  // Start the ripple effect when recording starts
  useEffect(() => {
    if (recording) {
      rippleAnim.forEach((anim, index) => {
        Animated.loop(
          Animated.timing(anim, {
            opacity: 500,
            toValue: 1,
            duration: 2000,
            delay: index * 1000, // Delay subsequent ripples
            useNativeDriver: true,
          })
        ).start();
      });
    } else {
      rippleAnim.forEach(anim => anim.setValue(0)); // Reset animation
    }
  }, [recording]);

  const animatedStyles = rippleAnim.map(anim => {
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] });
    const opacity = recording // Only change the opacity if recording has started
      ? anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.3, 0] })
      : 0;
    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={styles.container}>
      <Text style = {styles.title}>AuthentiCheck</Text>   


      {/* Ripples */}
      <View style={styles.playbackContainer}>
        {animatedStyles.map((style, index) => (
          <Animated.View key={`ripple_${index}`} style={[styles.ripple, style]} />
        ))}
      {/* {getRecordingLines()} */}
      </View>
     
      {/* Play Button */}
      <View style = {styles.footer}>
        <Pressable style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
          <Animated.View style={[styles.redCircle, animatedStyle, {width: recording ? '80%' : '100%'}]} />
        </Pressable>

        {/* View All Recording */}
      <TouchableOpacity style = {styles.viewAll} onPress={goToPlaybackScreen} >
        <View style={styles.iconContainer}>
        <FontAwesome5 name="bookmark" size={25} color="#0B3954"/>
        <Text style = {styles.IconText}>
          View All
        </Text>
        </View>
      </TouchableOpacity>
      </View>

      
    </View>
 );
}

const styles = StyleSheet.create({
container: {
flex: 1,
bottom: '0%',
},
/* AuthentiCheck */
title: {
top: 25,
paddingLeft: 30,
fontSize: 20,
fontWeight: 'bold',
color: '#0B3954',
},
/* List */
row: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
margin: 5,
padding: 15,
marginLeft: 10,
marginRight: 10,
bottom: '0.2',
backgroundColor: 'white',
margin: 5,
alignItems: 'center',
borderRadius: 5,
shadowColor: "#000",
shadowOffset: {
width: 0,
height: 2,
},
shadowOpacity: 0.25,
shadowRadius: 3.84,
elevation: 5,
gap: 10
},
/*  Audio Name */
fill: {
flex: 1,
},
/* Audio/Wave Layout */
playbackContainer : {
flex: 1,
height: 30,
alignItems: 'center',
justifyContent: 'center'
},
playbackBackground : {
height: 3,
width: 310,
left: 40,
backgroundColor: 'gainsboro',
borderRadius: 5,
},
playbackIndicator : {
width: 15,
aspectRatio: 1,
borderRadius: 10,
bottom: -5,
backgroundColor: 'royalblue',
position: 'absolute'
},
/* Record Button */
footer :{
backgroundColor: 'white',
height: 150,
alignItems: 'center',
justifyContent: 'center'
},
recordButton : {
width: 60,
height: 60,
borderRadius: 60,
borderWidth: 3,
borderColor: 'gray',
padding: 6,
alignItems: 'center',
justifyContent: 'center'
},
redCircle : {
backgroundColor: 'orangered',
aspectRatio: 1,
borderRadius: 30,
},
square: {
borderRadius: 0,
width: '80%', 
},
/* Clear Button */
clear: {
color: 'white',
backgroundColor: '#FF9700',
fontWeight: 'bold',
paddingVertical: 10,
paddingHorizontal: 30,
borderRadius: 30,
marginTop: 10,
alignItems: 'center'
},
uploadButton: {
backgroundColor: 'blue',
padding: 10,
borderRadius: 5,
marginTop: 10,
},
uploadText: {
color: 'white',
textAlign: 'center',
},
viewAll: {
left: -120,
bottom: 55
},
IconText:{
paddingTop: 5,
fontWeight: 'bold',
fontSize: 13,
color: '#0B3954'
},
iconContainer: {
alignItems: 'center',
justifyContent: 'center',
},
ripple: {
// Style for each ripple
width: 100,
height: 100,
borderRadius: 50,
backgroundColor: 'red',
position: 'absolute',
opacity: 0, // Start with a transparent ripple
},
});