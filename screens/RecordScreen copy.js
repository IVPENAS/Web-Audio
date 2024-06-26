import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Circle, Svg } from 'react-native-svg';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle'); //Recording Status
  const [audioPermission, setAudioPermission] = useState(null);  //Recording Permision
  const [recordingsList, setRecordingsList] = useState([]); //Recording List
  const [elapsedTime, setElapsedTime] = useState(0); // Added for timer 
  const animatedValue = useRef(new Animated.Value(0)).current; // Reference to animated value

  useEffect(() => {
    //Recording Permision 
    async function getPermission() {
      await Audio.requestPermissionsAsync().then((permission) => {
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(permission.granted)
      }).catch(error => {
        console.log(error);
      });
    }
    getPermission()
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  //Reset when 30 seconds was lasped
  useEffect(() => {
    let timer;
    if (recordingStatus === 'recording') {
      timer = setInterval(() => {
        setElapsedTime(prevTime => {
          if (prevTime >= 29) { // Use 29 to account for any delay that might stop it at 29
            stopRecording();
          }
          return prevTime + 1;
        });
      }, 1000);
    }else {
      // Reset the animation when not recording
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true
      }).start();
    }
    return () => clearInterval(timer);
  }, [recordingStatus]);

  //Animation of Circle
  useEffect(() => {
    // Calculate the circumference of the circle
    const circumference = 30 * 2 * Math.PI;

    // Animate the strokeDashoffset from 0 to circumference
    Animated.timing(animatedValue, {
      toValue: circumference * (elapsedTime / 30),
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, [elapsedTime]);

  //Start Recording
  async function startRecording() {
    try {

      /* Permission */
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }
      /* Creating new Audio Record */
      const newRecording = new Audio.Recording();
      console.log('Starting Recording')

      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');
      setElapsedTime(0); // Reset timer
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  //Stop Recording
  async function stopRecording() {
    try {
      if (recordingStatus === 'recording') {
        console.log('Stopping Recording')
        await recording.stopAndUnloadAsync();

        const recordingUri = recording.getURI(); //Fetching Recorded Audio
        const ordinalNumber = recordingsList.length + 1; //Ordinal Numbering per Audio File
        const fileName = `record audio - ${ordinalNumber}`;

        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
        const filePath = FileSystem.documentDirectory + 'recordings/' + fileName;

        await FileSystem.moveAsync({
          from: recordingUri,
          to: filePath
        });
        setRecordingsList(prevRecordings => [...prevRecordings, {
          uri: filePath,
          name: fileName,
        }]);

        setRecording(null);
        setRecordingStatus('idle'); // Set status back to idle
        setElapsedTime(0); // Reset timer
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }

  async function handleRecordButtonPress() {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  /* Data Navigation to Audio List Screen */
  const navigation = useNavigation();
  function goToAudioList() {
    navigation.navigate('AudioList', { recordingsList });
  }

  return (
    <View style={styles.container}>

      {/* <Svg height="100%" width="100%" viewBox="0 0 100 100" style={styles.svgContainer}>
        <Circle cx="50" cy="20" r="30" fill="none" stroke="blue" strokeWidth="8"/>
      </Svg> */}
      <Svg height="100%" width="100%" viewBox="0 0 100 100" style={styles.svgContainer}>
        <AnimatedCircle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="blue"
          strokeWidth="8"
          strokeDasharray={`${30 * 2 * Math.PI}`}
          strokeDashoffset={animatedValue}
        />
      </Svg>

      <View style = {styles.playbackContainer}>
      <Text style={styles.timerText}>{elapsedTime}</Text>
      </View>

      <View style = {styles.footer}>
  
      <Text style={styles.recordingStatusText}>{`Recording status: ${recordingStatus}`}</Text>

      {/* Record Button */}
      <TouchableOpacity style={styles.button} onPress={handleRecordButtonPress}>
        <FontAwesome5 name={recording ? 'stop-circle' : 'circle'} size={44} color="white" />
      </TouchableOpacity>

      {/* View All Button */}
      <TouchableOpacity style = {styles.viewAll} onPress={goToAudioList} >
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const styles = StyleSheet.create({
container: {
flex: 1,
},
/* Recording */
button: {
alignItems: 'center',
justifyContent: 'center',
width: 65,
height: 65,
borderRadius: 64,
backgroundColor: "#0B3954",
},
recordingStatusText: {
marginBottom: 15,
},
/* Audio/Wave Layout */
playbackContainer : {
marginBottom: 'auto',
alignItems: 'center',
justifyContent: 'center',
},
/* Recording Layout */
footer :{
backgroundColor: 'white',
height: 200,
alignItems: 'center',
justifyContent: 'center'
},
/* View All Layout */
viewAll: {
left: -120,
bottom: 55
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
/* Timer Text */
timerText: {
  fontSize: 50,
  transform: [{translateY: 215}],
},
svgContainer: {
  position: 'absolute', // Make SVG position absolute to float over other components
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
},
});