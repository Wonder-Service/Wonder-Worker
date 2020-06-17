import React, {Component} from 'react';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import NavigationService from '../service/navigation';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {dismissAuthSession} from 'expo-web-browser';
import {POST, POSTLOGIN, GET, PUT, POST_NOBODY} from '../api/caller';
import {
  CANCEL_ORDER_ENDPOINT,
  POST_NOTIFICATION_ENDPOINT,
  NOTIFICATION_TYPE_CANCEL,
  NOTIFICATION_TYPE_ACCEPT,
  ORDER_COMPLETE_ENDPOINT,
  ACCEPT_ORDER_ENDPOINT,
} from '../api/endpoint';
import DropdownAlert from 'react-native-dropdownalert';
import { Notifications } from 'expo';
import {NavigationEvents} from 'react-navigation';

export default class MapDirection extends Component {
  state = {
    latitude: 10,
    longitude: 104,
    currentLocation: {
      name: 'FPT University',
      address: 'Khu Cong Nghe Cao quan 9',
      coords: {
        latitude: 10.7447201,
        longitude: 106.699301200004,
      },
    },
    destinationCoords: {
      latitude: 10,
      longitude: 106,
    },
    address: null,

  };

  messNotification = {
    deviceId: 'ExponentPushToken[A9PLrcP2mR66ioeZgpHQpT]',
    title: 'FixxySystem App Notificaiton',
    subtitle: 'worker notifcation',
    body: 'You have a new notifcation',
    data : {
      notificationType: 'abc',
      workerId: 'abc',
      diagnoseMess: 'abc',
      price: 'abc',
    },
    catogery: 'notification'
  }    



  initScreen = async () => {
    const {status} = await Permissions.askAsync (Permissions.LOCATION);
    console.log("map direction")
    console.log(this.props.navigation.state.params) 
    if (status != 'granted') {
      const response = await Permissions.askAsync (Permissions.LOCATION);
    }

    const location = await Location.getCurrentPositionAsync ({});
    this.setState({currentLocation: location})
    this._notificationSubscription = Notifications.addListener (noti => {
      this.setState ({notification: noti.data});
      if (this.state.notification.notificationType === NOTIFICATION_TYPE_CANCEL) {
        this.props.navigation.goBack();
      }

    });
    this.getDestinationCoords()
  }

  getDestinationCoords = async () => {
   
    const orderId = await AsyncStorage.getItem('orderId')
    await GET(ACCEPT_ORDER_ENDPOINT + '/'+ orderId 
    ,{},{} ).then(res => {
      console.log(res)
      if(res.lat != null ) {
        this.setState({destinationCoords: {
          latitude: res.lat,
          longitude: res.lng
        }})
      }
    }).catch(error => {console.log(error)})
    console.log(this.state.destinationCoords)
  }

  handleCancel = async () => {
    let orderId = await AsyncStorage.getItem ('orderId');
    await POST_NOBODY (
      CANCEL_ORDER_ENDPOINT,
      {},
      {},
      {
        orderId: orderId,
      }
    ).then (res => {
        this.props.navigation.goBack ();
    });
  };

  handleComplete = async () => {
    //API complete 
    let orderId = await AsyncStorage.getItem('orderId');
    await PUT (ORDER_COMPLETE_ENDPOINT + '/'+ orderId + '/status-complete', {}, {}).then (res => {
        NavigationService.navigate ('HomeScreen');
    });
  };

  render () {
    const {
      latitude,
      longitude,
      currentLocation,
      address,
      destinationCoords,
    } = this.state;
    if (latitude) {
      return (
        <View style={styles.container}>
          <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
          <MapView
            showsUserLocation
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <MapViewDirections
              origin={currentLocation.coords}
              // destination={address != null ? address: coords}
              destination={destinationCoords}
              apikey={'AIzaSyBF3Kg42z_Q3fVAwJdnuOgxLCcZAj3K56E'}
              strokeWidth={3}
              strokeColor="blue"
              errorMessage={error => {
                console.log (error);
              }}
            />

          </MapView>
          <TouchableOpacity onPress={this.handleCancel}>
            <View style={styles.buttonCancelView}>
              <Text style={styles.mainButtonText}>Cancel This Order</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleComplete}>
            <View style={styles.buttonCompleteView}>
              <Text style={styles.mainButtonText}>Complete This Service </Text>
            </View>
          </TouchableOpacity>
          <NavigationEvents onDidFocus={() => this.initScreen()} />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  mapViewStyle: {
    alignItems: 'center',
    flex: 1,
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
    fontSize: 20,
    color: 'white',
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
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#d63d2f',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get ('screen').width * 8 / 10,
  },
  buttonCompleteView: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#34c3eb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get ('screen').width * 8 / 10,
  },
});
