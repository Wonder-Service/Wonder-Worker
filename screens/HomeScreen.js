import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text,
  TouchableOpacity, Modal, Alert, Button,
  SafeAreaView, AsyncStorage, Dimensions
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import * as firebase from 'firebase';
import BottomSheet from 'reanimated-bottom-sheet';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import DropdownAlert from 'react-native-dropdownalert';
import { PUT, POST, POSTLOGIN, POST_NOBODY, GET } from '../api/caller';
import {
  ACCEPT_ORDER_ENDPOINT,
  POST_NOTIFICATION_ENDPOINT,
  NOTIFICATION_TYPE_REQEST,
  NOTIFICATION_TYPE_ACCEPT,
  DEVICEID_ENDPOINT,
  GEO_KEY_API,
  USER_ENDPOINT,
} from '../api/endpoint';
import { TextInput } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


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
firebase.initializeApp(firebaseConfig);


export default class NewHomeScreen extends React.Component {

  state = {
    // imageURL : 'https://reactnativecode.com/wp-content/uploads/2017/10/Guitar.jpg',
    editable: false,
    btnEditText: 'Start Finding',
    modalVisible: false,
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


  bs = React.createRef();

  // stopJob = async () => {
  //   //stop receive notification

  //   //stop tracking location
  //   await Location.stop;
  // };

  // startJob = async () => {
  //   this.setState({ findingState: true });
  //   //push id device to sever
  //   await this.enableNotification();

  //   const deviceId = await AsyncStorage.getItem('device_id');
  //   await POST_NOBODY(
  //     DEVICEID_ENDPOINT,
  //     {},
  //     {},
  //     {
  //       deviceId: deviceId,
  //     }
  //   ).then(res => console.log("Start Finding Job"));

  //   //udpate location to firebase
  //   await this.updateLocation();
  // };

  // getLocationByCoords = async (coords) => {
  //   let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
  //     + coords.latitude + ',' + coords.longitude + '&key=' + GEO_KEY_API;
  //   await fetch(url, {
  //     method: 'GET',
  //   }).then(res => res.json()).then(data => {
  //     console.log(data.results[0].formatted_address)
  //     this.setState({ address: data.results[0].formatted_address })
  //   });
  // }

  // enableNotification = async () => {
  //   registerForPushNotificationsAsync();
  //   let token = await AsyncStorage.getItem('device_id');

  //   this._notificationSubscription = Notifications.addListener(async noti => {
  //     console.log("we had a noti")
  //     this.setState({ notification: noti.data });
  //     console.log(this.state.notification)
  //     if (
  //       this.state.notification.notificationType === NOTIFICATION_TYPE_REQEST
  //     ) {
  //       console.log(this.state.notification);
  //       // await GET(
  //       //   USER_ENDPOINT + '/' + noti.data.customerId,
  //       //   {},
  //       //   {}
  //       // ).then(res => {
  //       //   this.setState({
  //       //     customer: {
  //       //       name: res.fullname,
  //       //       phone: res.phone
  //       //     }
  //       //   })
  //       // })

  //       await this.getLocationByCoords
  //       this.setModalVisible(true);

  //     } else if (
  //       this.state.notification.notificationType === NOTIFICATION_TYPE_ACCEPT
  //     ) {
  //       console.log('Receive NOTIFICATION REQUEST FROM CUSTOMER');
  //       NavigationService.navigate('MapDirection', this.state.notification);
  //       this.setModalVisible(false);
  //     }
  //   });
  // };

  // updateLocation = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   let token = await AsyncStorage.getItem('device_id');

  //   if (status != 'granted') {
  //     const response = await Permissions.askAsync(Permissions.LOCATION);
  //   }

  //   firebase.database().ref('/' + token).set({
  //     latitude: this.state.latitude,
  //     longitude: this.state.longitude,
  //   });

  //   await Location.watchPositionAsync(
  //     {
  //       timeInterval: 3000,
  //       distanceInterval: 2,
  //     },
  //     location => {
  //       this.setState({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       });

  //       firebase.database().ref('/' + token).set({
  //         latitude: this.state.latitude,
  //         longitude: this.state.longitude,
  //       });
  //     }
  //   );
  // };

  // handleAccept = async () => {
  //   const { notification } = this.state;
  //   const jwt = await AsyncStorage.getItem('jwt');
  //   const workerId = await AsyncStorage.getItem('userId');
  //   const orderId = await AsyncStorage.setItem(
  //     'orderId',
  //     notification.orderId + ''
  //   );
  //   let messNotificationFlag = this.state.messNotification;
  //   messNotificationFlag.data.workerId = +workerId;
  //   messNotificationFlag.data.orderId = notification.orderId;
  //   messNotificationFlag.data.notificationType = NOTIFICATION_TYPE_REQEST;
  //   // this.setState({messNotification.data.workerId: +workerId});
  //   // console.log(messNotificationFlag)
  //   this.setState({ messNotification: messNotificationFlag });
  //   let param = {
  //     to: 'ExponentPushToken[' + this.state.notification.deviceId + ']',
  //     title: this.state.messNotification.title,
  //     subtitle: this.state.messNotification.subtitle,
  //     body: this.state.messNotification.body,
  //     data: this.state.messNotification.data,
  //     // catogery: this.state.catogery,
  //   };
  //   //send notification to customer
  //   console.log(param);
  //   const token = await await Notifications.getExpoPushTokenAsync();
  //   await POST(POST_NOTIFICATION_ENDPOINT, {}, {}, param)
  //     .then(res => {
  //       console.log('receive Response success!');
  //       console.log("Response Status: " + res.status);
  //       if (res.status === 200) {
  //         console.log("Response Status: " + res.status);
  //         // waiting for customer accept
  //         console.log('Send Request succcess');
  //       }
  //     })
  //     .catch(err => console.log(err));
  // };

  // setModalVisible = (visible) => {
  //   this.setState({ modalVisible: visible });
  // }

  // Load_New_Image=()=>{

  //   this.setState({

  //     imageURL : 'https://reactnativecode.com/wp-content/uploads/2018/02/motorcycle.jpg'

  //   })
  // }

  render() {
    const {
      editable,
      btnEditText,
      modalVisible,
      notification,
      address,

    } = this.state;
    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.imageHeader}>
            <MaterialCommunityIcons name="face-profile" size={35} color="black" onPress={() => {
              NavigationService.navigate("ProfileScreen");
            }} />
          </View>

          <View style={styles.mainImage}>
            <Image

              source={require('../assets/images/worker.png')}

            // source = {{ uri: this.state.imageURL }}
            />
          </View>


          <View style={styles.textContainer}>
            <Text style={styles.text}>Let's Start Working!!</Text>
            <View style={{ flexDirection: "column", justifyContent: 'center', alignContent: 'center' }}>
              {/* <TouchableOpacity
                onPress={() => {

                  //this.setModalVisible(true);
                  if (editable) {
                    this.setState({ editable: false });
                  } else {
                    this.setState({ editable: true });
                  }
                  if (btnEditText !== 'Start Finding') {
                    this.setState({ btnEditText: 'Start Finding' });
                    this.stopJob();
                  } else {
                    this.setState({ btnEditText: 'Stop' });
                    this.startJob();
                  }
                }}
              >
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#3ddc84',
                      width: '65%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#fff',
                    },
                  ]}
                >
                  <Text style={{ color: '#fff', padding: 5, }}>
                    {btnEditText}
                  </Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  NavigationService.navigate("RequestScreen");
                }}
              >
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#3ddc84',
                      width: '65%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#fff',
                      marginBottom: 35,
                    },
                  ]}
                >
                  <Text style={{ color: '#fff', padding: 5, }}>
                    start working
                </Text>
                </View>
              </TouchableOpacity>

            </View>

          </View>

          <View style={styles.centeredView}>
            <Modal animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed");
              }
              }
            >
              <View style={styles.modalView}>
                <Text style={styles.headerPopUp}>Customer's Information</Text>
                <View style={styles.inforContainer}>
                  <Octicons name="list-ordered" size={24} color="black" />
                  <Text style={styles.modalText}>Order ID: {notification.orderId} </Text>
                </View>

                <View style={styles.inforContainer}>
                  <MaterialIcons name="description" size={24} color="black" />
                  <Text style={styles.modalText}>Description: {notification.description} </Text>
                </View>

                <View style={styles.inforContainer}>
                  <FontAwesome name="user" size={24} color="black" />
                  <Text style={styles.modalText}>Name: {notification.customerName} </Text>
                </View>

                <View style={styles.inforContainer}>
                  <Entypo name="location-pin" size={24} color="black" />
                  <Text style={styles.modalText}>Address: {notification.address} </Text>
                </View>

                <View style={styles.inforContainer}>
                  <FontAwesome name="phone-square" size={24} color="black" />
                  <Text style={styles.modalText}>Phone: {notification.customerPhone}</Text>
                </View>


                <TouchableOpacity onPress={this.handleAccept}>
                  <View style={styles.buttonView}>
                    <Text style={StyleSheet.mainButtonText}>Accept</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.getLocationByCoords({ latitude: 10.852766, longitude: 106.629230 })
                  }}
                >
                  <View style={styles.buttonView}>
                    <Text style={StyleSheet.mainButtonText}>Decline</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </Modal>
          </View>



        </View>

      </SafeAreaView>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
    height: 35,
    marginTop: 105,
    marginLeft: 300
  },
  mainImage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 55,
    // height: 329,
    // width: 343,
    // marginLeft: 36
  },
  textContainer: {
    width: 415,
    height: 130,

    borderWidth: 1,
    backgroundColor: '#39AAA3',
    //marginLeft: 15,
    flexDirection: 'row',
    marginTop: 50,
    bottom: 0,

  },
  text: {
    fontSize: 18,
    color: 'white',
    alignItems: 'center',
    marginTop: 45,
    marginLeft: 20
  },
  button: {
    width: '100%',
    borderColor: '#F56258',
    borderWidth: 1,
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    borderRadius: 20,
    marginTop: 35,
    marginLeft: 20
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    padding: 35,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center'
  },
  modalText: {
    //marginBottom: 15,
    marginLeft: 10,
    width: 180,
    maxWidth: "50%",
    fontSize: 18
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  centeredView: {


    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22

  },

  inforContainer: {
    flexDirection: 'row',
    width: 320,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
    //justifyContent: 'center'
    //marginRight: 20

  },

  headerPopUp: {
    fontSize: 20,
    fontWeight: "800",
    //marginLeft: 20,

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
    width: Dimensions.get('screen').width * 8 / 10,
  },

  buttonCancelView: {
    padding: 15,
    backgroundColor: '#d63d2f',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('screen').width * 8 / 10,
  },

})