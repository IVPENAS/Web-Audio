import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, FlatList} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';

function PlaybackScreen({ route }) {
  const [recordings, setRecordings] = useState(route.params.recordings);

  /* Plays the sound */
  const playSound = async (sound) => {
    await sound.replayAsync();
  };

  const clearRecordings = () => {
    setRecordings([]); // Set recordings to an empty array
  };

  return (
    <View>

      <View>
        <Text style={styles.AllRecordings}> All Recordings </Text>
      </View>

      {/* Clear */}
      <TouchableOpacity title='Clear' style={[styles.centeredContent]} onPress={clearRecordings}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="trash" size={20} color="#0B3954" style={styles.triangle}/>
        <Text style = {styles.IconText}>Clear All</Text>
      </View>
      </TouchableOpacity>

      
      
      {/* If Recordings is 0 display message */}
      {recordings.length === 0 ? (
        <Text style={styles.emptyMessage}>Empty Playback List, Please Record an Audio</Text>
      ) : (
        recordings.map((recording, index) => (
        <View key={index} style={styles.row}>
        
        {/* Display Recorded List */}
        
        <TouchableOpacity style={styles.recordButton} onPress={() => playSound(recording.sound)}>
          <FontAwesome5 name="play" size={15} color="white" style={styles.triangle}/>
        </TouchableOpacity>
          <Text>Recording {index + 1}</Text>
        </View>
        ))
      )}
    </View>
  );
}
/* <FlatList
      data={recordings}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        // ... your renderItem content
      )}
    />
  )} */

export default PlaybackScreen;

const styles = StyleSheet.create({
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
/* Row Layout */
row: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
top: 100,
margin: 5,
padding: 15,
marginLeft: 10,
marginRight: 10,
bottom: '0.2',
backgroundColor: 'white',
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
/* All Recording Text */
AllRecordings: {
left: 10,
top: 25,
paddingTop: 5,
fontWeight: 'bold',
fontSize: 15,
color: '#0B3954'
},
/* Play Button */
recordButton : {
width: 50,
height: 50,
right: 100,
borderRadius: 60,
borderWidth: 2,
borderColor: '#0B3954',
padding: 3,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#0B3954',
},
/* Empty Message when the recording is empty */
emptyMessage: {
fontSize: 16,
color: 'grey',
textAlign: 'center',
marginTop: 250,
},
/* Triangle in the Play */
triangle:{
left: 2
},
/* Clear Button */
iconContainer: {
top: 50,
left: 150,
alignItems: 'center',
justifyContent: 'center',
},
centeredContent: {
alignItems: 'center',
},
IconText:{
paddingTop: 5,
fontWeight: 'bold',
fontSize: 13,
color: '#0B3954'
},
});