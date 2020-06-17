import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput, ListView, StyleSheet} from 'react-native';
// import {firebase} from '../components/FirebaseConfig.js'
import BottomSheet from 'reanimated-bottom-sheet';

// import * as firebase from 'firebase'

// var firebaseConfig = {
//     apiKey: "AIzaSyCkUqpsRdN83jH8o2y5ZfQ6VHYOydEPOSQ",
//     authDomain: "fixxyworker.firebaseapp.com",
//     databaseURL: "https://fixxyworker.firebaseio.com",
//     projectId: "fixxyworker",
//     storageBucket: "fixxyworker.appspot.com",
//     messagingSenderId: "492536156918",
//     appId: "1:492536156918:web:f8d8feaa2c267b261d92d7",
//     measurementId: "G-78KBVBX2N2"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

export default class RealtimeDB extends Component {
  constructor (props) {
    super (props);
  }
  bs = React.createRef()
  renderContent = () => (
    <View style={{backgroundColor: 'blue'}}>
      <Text>Test</Text>
    </View>
  );

  handelFunction = () => {
    let abc = firebase.database ().ref ('fixxyworker/').set ({
      username: 'thanhnv',
      email: 'abc@abc',
      profile_picture: 'no pic',
    });

    console.log (abc);
    // .ref('fixxyworker/'+'abccas').on('latitude',
    // (snapshot) => {
    //     const latitude = snapshot.val.latitude
    //     console.log("new value"+ latitude)
    // })
  };

  snapBottomShett = () => {
    this.bs.current.snapTo (0);
  };

  snapBottomShettOn = () => {
    this.bs.current.snapTo(1);
  };

  render () {
    return (
      <View style= {styles.container}>
        <TouchableOpacity onPress={this.snapBottomShettOn}>
          <Text>on</Text>
        </TouchableOpacity>
        <BottomSheet
          snapPoints={[450, 300, 0]}
          renderContent={this.renderContent}
          ref={this.bs}
            initialSnap={0}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  status: {flex: 2},
  container: {
    flex: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
