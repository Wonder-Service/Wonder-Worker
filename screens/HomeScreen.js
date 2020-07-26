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

          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 100, backgroundColor: '#39AAA3' }}>
            <Text style={{ color: 'white', fontSize: 25, marginTop: 20 }}>Hello Worker</Text>
          </View>

          <View style={styles.imageHeader}>
            <MaterialCommunityIcons name="face-profile" size={35} color="black" onPress={() => {
              NavigationService.navigate("ProfileScreen");
            }} />
          </View>

          <View style={styles.mainImage}>
            <Image
              source={require('../assets/images/worker.png')}
            />
          </View>


          <View style={styles.textContainer}>
            <Text style={styles.text}>Let's Start Working!!</Text>
            <View style={{ flexDirection: "column", justifyContent: 'center', alignContent: 'center' }}>
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
    marginLeft: 300
  },
  mainImage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 55,
  },
  textContainer: {
    width: 415,
    height: 130,
    borderWidth: 1,
    backgroundColor: '#39AAA3',
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
  },

  headerPopUp: {
    fontSize: 20,
    fontWeight: "800",
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