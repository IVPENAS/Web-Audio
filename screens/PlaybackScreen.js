import React from 'react';
import { StyleSheet, View, Text, Pressable} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'

function PlaybackScreen({ route }) {
  const { recordingUris } = route.params;

  return (
    <View style={styles.row}>
      <Pressable style = {styles.recordButton}>
        <View style = {styles.redCircle}/>
      </Pressable>
      {recordingUris.map((uri, index) => (
        
      <View key={index}>
        <Text>Recording {index + 1}</Text>
      </View>
      ))}  
           
    </View>
  );
}


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
recordButton : {
width: 50,
height: 50,
borderRadius: 60,
borderWidth: 2,
borderColor: '#0B3954',
padding: 3,
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#0B3954',
},
redCircle : {
backgroundColor: 'red',
aspectRatio: 1,
borderRadius: 30,
},
});