import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage} from 'react-native';
import registerForPushNotificationsAsync from '../../service/notification';
import DropdownAlert from 'react-native-dropdownalert'
import { Notifications } from "expo";
import NavigationService from '../../service/navigation'
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as firebase from 'firebase'
import BottomSheet from 'reanimated-bottom-sheet'


var firebaseConfig = {
 
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default class HomeTabs extends React.Component {

    state = {
        notification: null,
        latitude: null,
        longitude: null,
        findingStatus: false, 
    }


    startWork = async () => {
        registerForPushNotificationsAsync();
        let token = await AsyncStorage.getItem('device_id');
        console.log(token);
        this._notificationSubscription = Notifications.addListener(
            (noti)=> {
              this.setState({notification:noti}); 
              this.dropDownAlertRef.alertWithType('warn', 'Notification', noti.data.messenger );
            }
          );
       await this.updateLocation();
       this.setState()
    }

    updateLocation = async () => {
      const {status} = await Permissions.askAsync (Permissions.LOCATION);
      let token = await AsyncStorage.getItem('device_id');
      if (status != 'granted') {
        const response = await Permissions.askAsync (Permissions.LOCATION);
      }
      firebase.database().ref('/'+token).set({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
      
      let location = await Location.watchPositionAsync(
        {
          timeInterval: 3000,
          distanceInterval: 2,
        }, (location) => {
          this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
          console.log(this.state.latitude)
          console.log(this.state.longitude)
          firebase.database().ref('/'+token).set({
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          })
        }
       );

    }

    stopWatch = async () => {
   
      
      // let location = await Location.startGeofencingAsync
    }
  

    renderContent = () => (
      <View style={{backgroundColor:'yellow'}}>
      <Text>This is COntent</Text>
      </View>
    )
    

    renderHeader = () => (
      <Text>THIS IS HEADER</Text>
    )

  render () {
    const {notification,
      latitude,
      longitude
    } = this.state

    return (
        <>
      <View style={styles.container}>
      <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        <Text style={styles.text}>Home Tabs</Text>
        
        <TouchableOpacity onPress={this.startWork}>
          <View style={styles.buttons}>
            <Text style={styles.text}>{latitude}</Text>
            <Text style={styles.text}>{longitude}</Text>

          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.startWork}>
          <View style={styles.buttons}>
            <Text style={styles.text}>Start Your Work</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>

          <View style={styles.buttons}>
            <Text style={styles.text}>Stop Your Work</Text>
          </View>

        </TouchableOpacity>
        <BottomSheet 
          snapPoints={[100, 400]}
          renderContent={this.renderContent}
          renderHeader={this.renderHeader}
          initialSnap={0}
        />
          
      </View>
      </>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    padding: 10,
    paddingHorizontal: 40,
  },
  buttons: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: 'green',
  },
});
