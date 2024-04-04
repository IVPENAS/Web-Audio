import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [audioPermission, setAudioPermission] = useState(null); 
  const [recordingsList, setRecordingsList] = useState([]);

  useEffect(() => {
    //Permission 
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

  //Start Recording
  async function startRecording() {
    try {
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording')

      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');

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

        const recordingUri = recording.getURI();
        const ordinalNumber = recordingsList.length + 1;
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
        setRecordingStatus('stopped');
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
      <View style = {styles.playbackContainer}>
        
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

const styles = StyleSheet.create({
  container: {
  flex: 1,
  bottom: '0%',
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
  height: 30,
  marginBottom: '128%',
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
});