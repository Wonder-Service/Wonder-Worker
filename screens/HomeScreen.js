import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  AsyncStorage,
} from 'react-native';
import { Notifications } from "expo";
import * as firebase from 'firebase';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheet from 'reanimated-bottom-sheet';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import DropdownAlert from 'react-native-dropdownalert'

var firebaseConfig = {

};

// Initialize Firebase
firebase.initializeApp (firebaseConfig);

export default class HomeScreen extends React.Component {
  state = {
    notification: null,
    latitude: null,
    longitude: null,
    findingState: false,
    user: null,
  };

  bs= React.createRef();

  stopJob = async () => {
    //stop receive notification
    //stop tracking location
    await Location.stop;
  };

  startJob = async () => {
    this.setState ({findingState: true});
    //push id device to sever
    await this.enableNotification ();

    //udpate location to firebase
    await this.updateLocation ();
    
    this.bs.current.snapTo (1);
  };

  enableNotification = async () => {
    registerForPushNotificationsAsync ();
    let token = await AsyncStorage.getItem ('device_id');
    // Push id to BE Sever
    console.log (token);

    this._notificationSubscription = Notifications.addListener (noti => {
      this.setState ({notification: noti});
      this.bs.current.snapTo(0)
      this.dropDownAlertRef.alertWithType (
        'warn',
        'Notification',
        noti.data.messenger
      );
    });
  };

  updateLocation = async () => {
    const {status} = await Permissions.askAsync (Permissions.LOCATION);
    let token = await AsyncStorage.getItem ('device_id');

    if (status != 'granted') {
      const response = await Permissions.askAsync (Permissions.LOCATION);
    }

    firebase.database ().ref ('/' + token).set ({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    });

    await Location.watchPositionAsync (
      {
        timeInterval: 3000,
        distanceInterval: 2,
      },
      location => {
        this.setState ({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log (this.state.latitude);
        console.log (this.state.longitude);
        firebase.database ().ref ('/' + token).set ({
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        });
      }
    );
  };

  handleAccept = () => {
    //call api accept get user coords

    //handle if accept fail

    //navigate to Map Direction

    // if (user) {
      NavigationService.navigate ('MapDirection', user);
    // }
  };

  renderHeader = () => {
    const {notification} = this.state
    if (notification) {
      return (
        <View>
          <Text>
            Let's Start Working
          </Text>
        </View>
      );
    } else {
      <View>
        <Text>
          Find One
        </Text>
      </View>;
    }
  };

  renderContent = () => {
    if (this.state.notification) {
      return (
        <View style={styles.subContainer}>
          <Image source={require ('../assets/images/searching.gif')} />
          <Text>Found One</Text>
          <Text>Order Id: E33</Text>
          <Text>Description: Nha tui bi hu may lanh</Text>
          <Text>Price: 20$</Text>
          <Text>Customer's Phone: 0903543178</Text>
          <View style={{flexDirection: 'row'}}>

            <TouchableOpacity onPress={this.handleAccept}>
              <View style={styles.buttonView}>
                <Text>Chấp nhận</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <View style={styles.buttonView}>
                <Text>Từ Chối</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.subContainer}>
          <Image source={require ('../assets/images/searching.gif')} />
          <Text>Searching your Jobs</Text>
        </View>
      );
    }
  };

  render () {
    const {findingState, notification} = this.state;
    console.log(notification+'nofiticaion')
    return (
      <View style={styles.container}>
              <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        <StatusBar
          translucent
          backgroundColor="#000"
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />

        <Image
          style={{resizeMode: 'center'}}
          source={require ('../assets/images/ext.jpeg')}
        />
        <View style={styles.groupButton}>

          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.startJob}>
              <View style={styles.buttonView}>
                <Image
                  style={{width: 70, height: 70}}
                  source={require ('../assets/images/car_1.png')}
                />
                <Text style={styles.mainButtonText}>
                  Start Finding Job
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* //   <View style={{flex: 1}}>
          //     if()
          //     <TouchableOpacity onPress={this.stop}>
          //       <View style={styles.buttonView}>
          //         <Image
          //           style={{width: 70, height: 70}}
          //           source={require ('../assets/images/car_1.png')}
          //         />
          //         <Text style={styles.mainButtonText}>
          //           Stop Finding Job
          //         </Text>
          //       </View>
          //     </TouchableOpacity>
          //   </View>
          // } */}

          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.stopJob}>
              <View style={styles.buttonView}>
                <Image
                  style={{width: 70, height: 70}}
                  source={require ('../assets/images/medical-history.png')}
                />
                <Text style={styles.mainButtonText}>
                  History Jobs
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <BottomSheet
          snapPoints={[
            Dimensions.get ('screen').height * 7 / 10,
            Dimensions.get ('screen').height / 4,
            0,
          ]}
          initialSnap={2}
          ref={this.bs}
          renderContent={this.renderContent}
          renderHeader={this.renderHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  subContainer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: Dimensions.get ('screen').width,
    height: Dimensions.get ('screen').height * 7 / 10,

    // justifyContent: 'center',
  },

  groupButton: {
    height: Dimensions.get ('screen').height / 2,
    width: Dimensions.get ('screen').width * 9 / 10,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainButtonText: {
    fontSize: 30,
    color: 'white',
    marginTop: 10,
  },

  buttonView: {
    padding: 20,
    backgroundColor: 'rgba(80, 203, 203, 1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: Dimensions.get ('screen').width * 8 / 10,
  },
  buttonCancelView: {
    padding: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: Dimensions.get ('screen').width * 8 / 10,
  },
});
