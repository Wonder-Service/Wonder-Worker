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
  TouchableOpacity,
} from 'react-native';
import {Notifications} from 'expo';
import * as firebase from 'firebase';
import BottomSheet from 'reanimated-bottom-sheet';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import DropdownAlert from 'react-native-dropdownalert';
import {PUT, POST, POSTLOGIN, POST_NOBODY, GET} from '../api/caller';
import {
  ACCEPT_ORDER_ENDPOINT,
  POST_NOTIFICATION_ENDPOINT,
  NOTIFICATION_TYPE_REQEST,
  NOTIFICATION_TYPE_ACCEPT,
  DEVICEID_ENDPOINT,
  GEO_KEY_API,
  USER_ENDPOINT,
} from '../api/endpoint';
import {TextInput} from 'react-native-gesture-handler';

var firebaseConfig = {
  apiKey: 'AIzaSyCkUqpsRdN83jH8o2y5ZfQ6VHYOydEPOSQ',
  authDomain: 'fixxyworker.firebaseapp.com',
  databaseURL: 'https://fixxyworker.firebaseio.com',
  projectId: 'fixxyworker',
  storageBucket: 'fixxyworker.appspot.com',
  messagingSenderId: '492536156918',
  appId: '1:492536156918:web:f8d8feaa2c267b261d92d7',
  measurementId: 'G-78KBVBX2N2',
};

// Initialize Firebase
firebase.initializeApp (firebaseConfig);

export default class HomeScreen extends React.Component {
  state = {
    notification: 1,
    latitude: null,
    longitude: null,
    findingState: false,
    user: null,
    messNotification: {
      deviceId: 'ExponentPushToken[A9PLrcP2mR66ioeZgpHQpT]',
      title: 'FixxySystem App Notificaiton',
      subtitle: 'worker notifcation',
      body: 'You have a new notifcation',
      data: {
        notificationType: 'abc',
        workerId: 'abc',
        diagnoseMess: 'abc',
        price: 'abc',
      },
      customer: {
        phone: '',
        name: '',
      },
      address: '',
      catogery: 'notification',
    },
  };

  bs = React.createRef ();

  stopJob = async () => {
    //stop receive notification
    
    //stop tracking location
    await Location.stop;
  };

  startJob = async () => {
    this.setState ({findingState: true});
    //push id device to sever
    await this.enableNotification ();

    const deviceId = await AsyncStorage.getItem ('device_id');
    await POST_NOBODY (
      DEVICEID_ENDPOINT,
      {},
      {},
      {
        deviceId: deviceId,
      }
    ).then (res => console.log (res));

    //udpate location to firebase
    await this.updateLocation ();

    this.bs.current.snapTo (1);
  };

  getLocationByCoords = async (coords) => {
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
    +coords.latitude+','+coords.longitude+'&key='+ GEO_KEY_API;
    await fetch (url, {
      method: 'GET',
    }).then (res => res.json() ).then(data => {
      console.log(data.results[0].formatted_address)
      this.setState({address: data.results[0].formatted_address})
    });Home
  }

  enableNotification = async () => {
    registerForPushNotificationsAsync ();
    let token = await AsyncStorage.getItem ('device_id');

    this._notificationSubscription = Notifications.addListener (async noti => {
      this.setState ({notification: noti.data});
    
      if (
        this.state.notification.notificationType === NOTIFICATION_TYPE_REQEST
      ) {
        await GET (
          USER_ENDPOINT + '/' + noti.data.customerId,
          {},
          {}
        ).then (res => {
          this.setState({customer: {
            name: res.fullname,
            phone: res.phone
          }})
        })
        
        await this.getLocationByCoords

        this.bs.current.snapTo (0);
      } else if (
        this.state.notification.notificationType === NOTIFICATION_TYPE_ACCEPT
      ) {
        console.log ('Receive NOTIFICATION REQUEST FROM CUSTOMER');
        NavigationService.navigate ('MapDirection', this.state.notification);
      }
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

        firebase.database ().ref ('/' + token).set ({
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        });
      }
    );
  };

  handleAccept = async () => {
    const {notification} = this.state;
    const jwt = await AsyncStorage.getItem ('jwt');
    const workerId = await AsyncStorage.getItem ('userId');
    const orderId = await AsyncStorage.setItem (
      'orderId',
      notification.orderId + ''
    );
    let messNotificationFlag = this.state.messNotification;
    messNotificationFlag.data.workerId = +workerId;
    messNotificationFlag.data.orderId = notification.orderId;
    messNotificationFlag.data.notificationType = NOTIFICATION_TYPE_REQEST;
    // this.setState({messNotification.data.workerId: +workerId});
    // console.log(messNotificationFlag)
    this.setState ({messNotification: messNotificationFlag});
    let param = {
      to: 'ExponentPushToken[' + this.state.notification.deviceId + ']',
      title: this.state.messNotification.title,
      subtitle: this.state.messNotification.subtitle,
      body: this.state.messNotification.body,
      data: this.state.messNotification.data,
      catogery: this.state.catogery,
    };
    //send notification to customer
    console.log (param);
    const token = await await Notifications.getExpoPushTokenAsync ();
    await POST (POST_NOTIFICATION_ENDPOINT, {}, {}, param)
      .then (res => {
        if (res.status === 200) {
          // waiting for customer accept
          console.log ('Send Request susscess');
        }
      })
      .catch (err => console.log (err));
  };

  renderHeader = () => {
    const {notification} = this.state;
    if (!notification) {
      return (
        <View>
          <Text>
            Let's Start Working
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text>
            Find One{' '}
          </Text>
        </View>
      );
    }
  };

  renderContent = () => {
    const {notification,address} = this.state;
    if (this.state.notification.notificationType == NOTIFICATION_TYPE_REQEST) {
      return (
        <View style={styles.subContainer}>
          <Text style={{fontSize: 20}}>Order Id: {notification.orderId}</Text>
          <Text style={{fontSize: 20}}>Description: </Text>
          <View style ={{
            height: 80, 
            width: Dimensions. get('screen').width*7/10,
            borderRadius: 15,
            borderWidth: 1,
             justifyContent:'center',
              alignItems:'center'
            }} >
            <TextInput 
            multiline
            editable={false}
            style={{height:60, width:Dimensions. get('screen').width*6/10}}
            >{notification.description}</TextInput>
          </View>
          <Text>Customer's Phone: {notification.customerPhone}</Text>
          <Text>Address : {address}</Text>
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <Text style={{marginLeft: -10}}> Your Price</Text>
            <View
              style={{
                height: 25,
                marginLeft: 15,
                borderWidth: 1,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                style={{width: 200, height: 15, marginLeft: 5}}
                placeholder="deal Price"
                onChangeText={text => {
                  let flagMess = this.state.messNotification;
                  let dataMess = flagMess.data;
                  dataMess.price = text;
                  flagMess.data = dataMess;
                  this.setState ({messNotification: flagMess});
                  console.log (this.state.messNotification);
                }}
                value={this.state.messNotification.data.price}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text> Your messsage</Text>
            <View
              style={{
                height: 25,
                marginLeft: 15,
                borderWidth: 1,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                style={{width: 200, height: 15}}
                onChangeText={text => {
                  let flagMess = this.state.messNotification;
                  let dataMess = flagMess.data;
                  dataMess.diagnoseMess = text;
                  flagMess.data = dataMess;
                  this.setState ({messNotification: flagMess});
                  console.log (this.state.messNotification);
                }}
              />
            </View>
          </View>
          <TouchableOpacity onPress={this.handleAccept}>
            <View style={styles.buttonView}>
              <Text style={StyleSheet.mainButtonText}>Chấp nhận</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.getLocationByCoords({latitude: 10.852766, longitude: 106.629230})
            }}
          >
            <View style={styles.buttonView}>
              <Text style={StyleSheet.mainButtonText}>Từ Chối</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.subContainer}>
          <Image source={require ('../assets/images/searching.gif')} />
          <Text style={{fontSize: 25, marginBottom: 30}}>
            Searching your Jobs...
          </Text>
          <TouchableOpacity onPress={this.handleCancel}>
            <View style={styles.buttonCancelView}>
              <Text style={styles.mainButtonText}>Hủy</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  render () {
    const {findingState, notification} = this.state;
    return (
      <View style={styles.container}>
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
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
          initialSnap={0}
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
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 20,
    backgroundColor: '#d0f5ee',
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
    backgroundColor: '#d63d2f',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get ('screen').width * 8 / 10,
  },
});
