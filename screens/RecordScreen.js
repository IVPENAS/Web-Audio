import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Pressable, Animated, Easing, FlatList, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons'


export default function App({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [onAudioSampleReceived, setOnAudioSampleReceived] = React.useState(null); // Declare the state

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
  }

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
  }

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
    const recordingUris = recordings.map(recording => {
      console.log('Recording URI:', recording.uri); // Debugging line
      return recording.uri;
    });
    navigation.navigate('PlaybackScreen', { recordingUris });
  };

  //Deletes the saved Audio once clear is pressed
  function clearRecordings() {
    setRecordings([])
  }


  return (
    <View style={styles.container}>
      <Text style = {styles.title}>AuthentiCheck</Text>

      {/* List of Recorded Items */}
      {/* <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} /> */}
      <View style={styles.playbackContainer}>
      {getRecordingLines()}
      </View>



      {/* Clear Button */}
     <Text style = {styles.clear} onPress={clearRecordings}>Clear Recordings</Text>
      {/* <Button title={recordings.length > 0 ? 'Clear Recordings' : '' } onPress={clearRecordings} /> */}

      
      {/* Play Button */}
      <View style = {styles.footer}>
        <Pressable style = {styles.recordButton} onPress={recording ? stopRecording : startRecording}>
          <View style = {[styles.redCircle, {width: recording ? '80%' : '100%'}]}/>
        </Pressable>
      </View>

      <Button title="Go to Playback" onPress={goToPlaybackScreen} />
      
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
  /* Play Button */
  playButton : {
  right: 335,
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
  padding: 3,
  alignItems: 'center',
  justifyContent: 'center'
  },
  redCircle : {
  backgroundColor: 'orangered',
  aspectRatio: 1,
  borderRadius: 30,
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
});