import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text,
  TouchableOpacity, Modal, Alert, Button,
  SafeAreaView, AsyncStorage, Dimensions, FlatList, ActivityIndicator, TouchableHighlight, ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import BottomSheet from 'reanimated-bottom-sheet';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { PUT, POST, POSTLOGIN, POST_NOBODY, GET, POST_NOTI } from '../api/caller';
import {
  ACCEPT_ORDER_ENDPOINT,
  ORDER_GET_BY_SKILL_ENDPOINT,
  USER_ENDPOINT,
  USER_GET_PROFILE_ENDPOINT,
  NOTIFICATION_TYPE_REQEST,
  NOTIFICATION_TYPE_ACCEPT,
  POST_NOTIFICATION_ENDPOINT,
  DEVICEID_ENDPOINT,

} from '../api/endpoint';
import { TextInput } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
// import * as firebase from 'firebase';


// var firebaseConfig = {
//   apiKey: 'AIzaSyCkUqpsRdN83jH8o2y5ZfQ6VHYOydEPOSQ',
//   authDomain: 'fixxyworker.firebaseapp.com',
//   databaseURL: 'https://fixxyworker.firebaseio.com',
//   projectId: 'fixxyworker',
//   storageBucket: 'fixxyworker.appspot.com',
//   messagingSenderId: '492536156918',
//   appId: '1:492536156918:web:f8d8feaa2c267b261d92d7',
//   measurementId: 'G-78KBVBX2N2',
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


class FlatListItem extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      emptyData: [],
      listCustomer: [],
      modalVisible: false,
      editable: false,
      btnEditText: "Stop",
      latitude: null,
      longitude: null,
      orderID: "",
      orderDescription: "",
      customerID: "",
      customerName: "",
      customerAddress: "",
      customerDeviceId: "",
      customerPhone: "",
      orderDevice: "",
      modalName: "",
      notification: 1,
      data: {
        notificationType: 'abc',
        workerId: '',
        diagnoseMess: 'abc',
        price: 'abc',
        orderId: '',
      },
    }
  };


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



  handleAccept = async () => {

    this.state.data.orderId = this.state.orderID;
    console.log("^^ID order : " + this.state.data.orderId);
    this.state.data.notificationType = NOTIFICATION_TYPE_REQEST;

    console.log("^^ID worker of ID: " + this.state.data.workerId);

    let param = {
      to: 'ExponentPushToken[' + this.state.customerDeviceId + ']',
      title: 'FixxySystem App Notificaiton',
      subtitle: 'worker notifcation',
      body: 'You have a new notifcation',
      data: this.state.data,
    };
    //send notification to customer
    console.log(param);

    await POST_NOTI(POST_NOTIFICATION_ENDPOINT, {}, {}, param)
      .then(res => {
        console.log('receive Response success!');
        console.log("Response Status: " + res.status);
        if (res.status === 200) {
          // waiting for customer accept
          console.log('Send Request susscess');
        }
      })
      .catch(err => console.log(err));
  };

  // ENABLE NOTIFICATION 
  enableNotification = async () => {
    registerForPushNotificationsAsync();
    let token = await AsyncStorage.getItem('device_id');

    this._notificationSubscription = Notifications.addListener(async noti => {
      console.log("we had a noti")
      this.setState({ notification: noti.data });
      console.log(this.state.notification)
      // if (
      //   this.state.notification.notificationType === NOTIFICATION_TYPE_REQEST
      // ) {
      //   console.log(this.state.notification);
      //   // await GET(
      //   //   USER_ENDPOINT + '/' + noti.data.customerId,
      //   //   {},
      //   //   {}
      //   // ).then(res => {
      //   //   this.setState({
      //   //     customer: {
      //   //       name: res.fullname,
      //   //       phone: res.phone
      //   //     }
      //   //   })
      //   // })

      //   await this.getLocationByCoords

      // } else 
      if (
        this.state.notification.notificationType === NOTIFICATION_TYPE_ACCEPT
      ) {
        console.log('Receive NOTIFICATION REQUEST FROM CUSTOMER');
        NavigationService.navigate('MapDirection', this.state.notification);
        this.setModalVisible(false);
      }
    });
  };


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };


  async componentDidMount() {
    //get jwt
    //load profile data 
    await GET(USER_GET_PROFILE_ENDPOINT, {}, {})

      .then(res => {
        this.state.data.workerId = res[0].id
      })

    // await this.updateLocation();
  }




  handlerSelectCatogery = async (orderId, deviceName, description, customerName, customerPhone, customerAddress, customerDeviceId, modalName) => {
    this.setState({ modalVisible: true });
    this.setState({ orderID: orderId, })
    this.setState({ orderDescription: description, })
    this.setState({ orderDevice: deviceName })
    this.setState({ customerName: customerName })
    this.setState({ customerPhone: customerPhone })
    this.setState({ customerAddress: customerAddress })
    this.setState({ customerDeviceId: customerDeviceId })
    this.setState({ modalName: modalName })
    await this.enableNotification();
  };


  render() {

    const {
      modalVisible,
      orderDevice,
      orderDescription,
      customerName,
      customerAddress,
      customerPhone,
      modalName,
    } = this.state;


    return (

      <View>
        <TouchableOpacity
          onPress={() => {
            this.handlerSelectCatogery(
              this.props.item.id,
              this.props.item.nameDevice,
              this.props.item.workDescription.description,
              this.props.item.customer.fullname,
              this.props.item.customer.phone,
              this.props.item.customer.address,
              this.props.item.customer.deviceId,
              this.props.item.customer.skills.description,
            )
            console.log("********")
            console.log("Date create : :" + this.props.item.workDescription.dateCreated)
            console.log("Worker ID :" + this.state.data.workerId)
            console.log("********")
          }}
        >
          <View style={styles.itemHandle}>
            <Image
              source={require("../assets/images/regItemImage.jpg")}
              style={styles.image}
            />

            <View
              style={{ flexDirection: "column", width: "80%" }}
            >

              <Text style={styles.title}>{this.props.item.nameDevice}</Text>

              <Text style={styles.subtitle}>{this.props.item.address}</Text>
              <Text style={styles.subtitle}>
                {this.props.item.workDescription.dateCreated}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* POP UP */}
        <Modal
          style={styles.centeredView}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed");
          }}
          onTouchOutside={() => {
            this.setModalVisible(false)
          }}
        >
          <View style={styles.modalView}>

            <Text style={{ fontSize: 25, fontWeight: '800', textAlign: 'center' }}>Order Detail</Text>
            <View style={{
              width: Dimensions.get('screen').width * 7 / 10,
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.6
            }}>
              <MaterialIcons name="devices" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Device Name: {orderDevice}</Text>
            </View>

            <View style={{
              width: Dimensions.get('screen').width * 7 / 10,
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.6
            }}>
              <Octicons name="issue-opened" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Issue: {orderDescription}</Text>
            </View>

            <Text style={{ fontSize: 22, marginTop: 20, fontWeight: '800', textAlign: 'center' }}>Customer Information</Text>

            <View style={{
              width: Dimensions.get('screen').width * 7 / 10,
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.6,
              marginTop: 10
            }}>
              <Entypo name="location" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Address: {customerAddress}</Text>
            </View>

            <View style={{
              width: Dimensions.get('screen').width * 7 / 10,
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.6,
              marginTop: 10
            }}>
              <FontAwesome name="user" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Name: {customerName}</Text>
            </View>

            <View style={{
              width: Dimensions.get('screen').width * 7 / 10,
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: 'grey',
              borderBottomWidth: 0.6,
              marginTop: 10
            }}>
              <FontAwesome name="phone-square" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Phone: {customerPhone}</Text>
            </View>


            <TouchableOpacity onPress={this.handleAccept}>
              <View style={styles.buttonView}>
                <Text style={styles.mainButtonText}>
                  Accept
                  </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setModalVisible(false)}
            >
              <View style={styles.buttonCancelView}>
                <Text style={styles.mainButtonText}>
                  Back
                  </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

var currentDate = moment().format("YYYY-MM-DD");

console.log(currentDate)
export default class listRequestScreen extends React.Component {
  state = {
    // imageURL : 'https://reactnativecode.com/wp-content/uploads/2017/10/Guitar.jpg',
    editable: false,
    btnEditText: "Stop",
    modalVisible: false,
    latitude: null,
    longitude: null,
    orderID: "",
    orderDescription: "",
    userName: "",
    userAddress: "",
    userPhone: "",
  };



  bs = React.createRef();

  handlerRefresh = async () => {
    // let jwt = await AsyncStorage.getItem ('jwt');
    // ORDER_GET_BY_SKILL_ENDPOINT OR ACCEPT_ORDER_ENDPOINT
    this.setState({
      isLoading: true,
    });

    // let jwt = await AsyncStorage.getItem ('jwt');
    // ORDER_GET_BY_SKILL_ENDPOINT OR ACCEPT_ORDER_ENDPOINT
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(

      (resJson) => {

        this.setState({ loadData: [] })
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].status == 'PROCESSING' && resJson[i].workDescription.dateCreated == currentDate) {

            this.state.loadData.push(resJson[i]);
          }
        }

        for (var i = 0; i < this.state.loadData.length; i++) {
          this.state.listOrder.push(this.state.loadData[i]);
        }
        this.state.listOrder.reverse();

        this.setState({
          isLoading: false,
        });
      }
    );
  };

  // get order by skill
  async componentDidMount() {
    // let jwt = await AsyncStorage.getItem ('jwt');
    // ORDER_GET_BY_SKILL_ENDPOINT OR ACCEPT_ORDER_ENDPOINT
    //&& resJson[i].workDescription.dateCreated == currentDate
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(

      (resJson) => {
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].status == 'PROCESSING' && resJson[i].workDescription.dateCreated == currentDate) {

            this.state.loadData.push(resJson[i]);
          }
        }


        for (var i = 0; i < this.state.loadData.length; i++) {
          this.state.listOrder.push(this.state.loadData[i]);
        }
        this.state.listOrder.reverse();

        this.setState({
          isLoading: false,
        });
      }
    );
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      listOrder: [],
      loadData: [],
      emptyData: [],
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <ActivityIndicator size="large" />
          </View>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.headerInfo}>
            <Text style={{ fontSize: 20, marginLeft: 50 }}>
              List Request
            </Text>
            <MaterialCommunityIcons
              name="face-profile"
              style={{ marginLeft: 30 }}
              size={35}
              color="black"
              onPress={() => {
                NavigationService.navigate("ProfileScreen");
              }}
            />
          </View>

          {/*  Refresh button */}
          <View style={styles.imageHeader}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ listOrder: [] })
                this.handlerRefresh()
              }}
            >
              <View style={styles.buttonRefresh}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require("../assets/images/refreshButton.png")}
                />
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 10,
                    fontSize: 20,
                  }}
                >
                  Refresh
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={{ marginTop: "5%" }}>
            <View
              style={{ flex: 1, width: "100%", marginTop: 20 }}
            >
              <FlatList
                data={this.state.listOrder}
                renderItem={({ item, index }) => {
                  return (
                    <FlatListItem
                      item={item}
                      index={index}
                    ></FlatListItem>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
            </View>
          </ScrollView>

          {/* Job find */}
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>
              Let's Start Working!!
            </Text>

            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate("Home");
              }}
            >
              <View
                style={[
                  styles.bodyButton,
                  {
                    backgroundColor: "#FE0B36",
                    width: "65%",
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#fff",
                  },
                ]}
              >
                <Text style={{ color: "#fff", padding: 5 }}>
                  stop
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  headerInfo: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },

  imageHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    height: 45,
    marginTop: 5,
  },
  bodyTextContainer: {
    width: 415,
    height: 130,

    borderWidth: 1,
    backgroundColor: "#39AAA3",
    //marginLeft: 15,
    flexDirection: "row",
    bottom: 0,
    // position: "absolute",
  },
  bodyText: {
    fontSize: 18,
    color: "white",
    alignItems: "center",
    marginTop: 45,
    marginLeft: 20,
  },
  bodyButton: {
    width: "100%",
    borderColor: "#F56258",
    borderWidth: 1,
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "6%",
    borderRadius: 20,
    marginTop: 35,
    marginLeft: 20,
  },

  buttonRefresh: {
    width: "100%",
    borderColor: "#F56258",
    borderWidth: 1,
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "6%",
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 80,

    backgroundColor: "#39AAA3",
    width: "65%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#fff",
  },

  itemHandle: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    marginLeft: 20,
    marginRight: 2,
    marginBottom: 2,
    marginTop: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    width: "90%",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    padding: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    paddingLeft: 10,
    // fontWeight: '700',
    color: "#7a7876",
  },
  flatListItem: {
    color: "#000",
    padding: 10,
    fontSize: 16,
  },
  image: {
    width: 52,
    height: 52,
  },

  modalView: {

    height: "83%",
    marginTop: "20%",
    margin: 20,
    backgroundColor: "#EFEFEF",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    padding: 35,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  modalText: {
    //marginBottom: 15,
    marginLeft: 10,
    width: 180,
    maxWidth: "50%",
    fontSize: 18,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  centeredView: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,

  },

  inforContainer: {
    flexDirection: "row",
    width: 320,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 30,
    borderRadius: 10,
    alignItems: "center",
    //justifyContent: 'center'
    //marginRight: 20
  },

  headerPopUp: {
    fontSize: 20,
    fontWeight: "800",
    //marginLeft: 20,
  },
  mainButtonText: {
    fontSize: 20,
    color: "white",

  },

  buttonView: {
    marginTop: 20,
    backgroundColor: "#2ac17b",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // alignContent: 'center',
    // padding: 15,
    // marginTop: "5%",
    // marginLeft: "5%",
    width: (Dimensions.get("screen").width * 7) / 10,
    height: 50
  },

  buttonCancelView: {
    marginTop: 10,
    backgroundColor: "#f34642",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // alignContent: 'center',
    // padding: 15,
    // marginTop: "5%",
    // marginLeft: "5%",
    width: (Dimensions.get("screen").width * 7) / 10,
    height: 50
  },
});