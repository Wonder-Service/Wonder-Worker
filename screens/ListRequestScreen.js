import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text,
  TouchableOpacity, Modal, Alert, Button,
  SafeAreaView, AsyncStorage, Dimensions, FlatList, ActivityIndicator, TouchableHighlight,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import BottomSheet from 'reanimated-bottom-sheet';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { PUT, POST, POSTLOGIN, POST_NOBODY, GET } from '../api/caller';
import {
  ACCEPT_ORDER_ENDPOINT,
  ORDER_GET_BY_SKILL_ENDPOINT,
  USER_ENDPOINT,
  USER_GET_PROFILE_ENDPOINT,
} from '../api/endpoint';
import { TextInput } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

class FlatListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loadPopUpOrderData: [],
      loadPopUPUserData: [],
      emptyData: [],
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
      customerPhone: "",
    };
  };


  // get order by skill
  async componentDidMount() {
    // let jwt = await AsyncStorage.getItem ('jwt');
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(
      (resJson) => {
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].nameDevice == this.state.orderID){
            this.setState({
              orderID: res[i].id,
              orderDescription: res[i].workDescription.description,
            })
          }
        }

        this.setState({
          isLoading: false,
        });
      }
    );
  }

  // get user information
  async componentDidMount() {
    //get jwt
    //load profile data 
    await GET(USER_GET_PROFILE_ENDPOINT, {}, {}).then(
      (resJson) => {
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].id == this.state.customerID) {
            this.setState({
              customerName: res[i].fullname,
              customerAddress: res[i].address,
              customerPhone: res[i].phone,
            })
          }
        }

        this.setState({
          isLoading: false,
        });
      }
    );
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  handleAccept = async () => {
    const { notification } = this.state;
    const jwt = await AsyncStorage.getItem('jwt');
    const workerId = await AsyncStorage.getItem('userId');
    const orderId = await AsyncStorage.setItem(
      'orderId',
      notification.orderId + ''
    );
    let messNotificationFlag = this.state.messNotification;
    messNotificationFlag.data.workerId = +workerId;
    messNotificationFlag.data.orderId = notification.orderId;
    messNotificationFlag.data.notificationType = NOTIFICATION_TYPE_REQEST;
    // this.setState({messNotification.data.workerId: +workerId});
    // console.log(messNotificationFlag)
    this.setState({ messNotification: messNotificationFlag });
    let param = {
      to: 'ExponentPushToken[' + this.state.notification.deviceId + ']',
      title: this.state.messNotification.title,
      subtitle: this.state.messNotification.subtitle,
      body: this.state.messNotification.body,
      data: this.state.messNotification.data,
      catogery: this.state.catogery,
    };
    //send notification to customer
    console.log(param);
    const token = await await Notifications.getExpoPushTokenAsync();
    await POST(POST_NOTIFICATION_ENDPOINT, {}, {}, param)
      .then(res => {
        if (res.status === 200) {
          // waiting for customer accept
          console.log('Send Request susscess');
        }
      })
      .catch(err => console.log(err));
  };

  handlerSelectCatogery = (orderId,customerId) => {
    this.setState({ modalVisible: true });
    this.setState({ orderID: orderId, })
    this.setState({ customerID: customerId, })
  };

  render() {

    const {
      modalVisible,
      orderID,
      orderDescription,
      customerName,
      customerAddress,
      customerPhone,
    } = this.state;

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.handlerSelectCatogery(this.props.item.id, this.props.item.workDescription.customerId)
          }}
        >
          <View style={styles.itemHandle}>
            <Image
              source={require("../assets/images/regItemImage.jpg")}
              style={styles.image}
            />
            <View
              style={{ flexDirection: "column", width: "80%", height: "100%" }}
            >
              <Text style={styles.title}>{this.props.item.nameDevice}</Text>
              <Text style={styles.subtitle}>
                Address:{this.props.item.address}
              </Text>
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
            <Text style={styles.headsuberPopUp}>
              Customer's Information
            </Text>
            <View style={styles.inforContainer}>
              <Octicons
                name="list-ordered"
                size={24}
                color="black"
                style={{ marginLeft: 5 }}
              />
              <Text style={styles.subtitle}>
                Order ID: {orderID}
              </Text>
            </View>

            <View style={styles.inforContainer}>
              <MaterialIcons
                name="description"
                size={24}
                color="black"
              />
              <Text style={styles.subtitle}>
                Description: {orderDescription}
              </Text>
            </View>

            <View style={styles.inforContainer}>
              <FontAwesome
                name="user"
                size={24}
                color="black"
                style={{ marginLeft: 5 }}
              />
              <Text style={styles.subtitle}>{customerName}</Text>
            </View>

            <View style={styles.inforContainer}>
              <Entypo
                name="location-pin"
                size={24}
                color="black"
              />
              <Text style={styles.subtitle}>{customerAddress}</Text>
            </View>

            <View style={styles.inforContainer}>
              <FontAwesome
                name="phone-square"
                size={24}
                color="black"
                style={{marginLeft:5}}
              />
              <Text style={styles.subtitle}>{customerPhone}</Text>
            </View>

            <TouchableOpacity onPress={this.handleAccept}>
              <View style={styles.buttonView}>
                <Text style={StyleSheet.mainButtonText}>
                  Accept
                  </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setModalVisible(false)}
            >
              <View style={styles.buttonView}>
                <Text style={StyleSheet.mainButtonText}>
                  Decline
                  </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

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

  // get order by skill
  async componentDidMount() {
    // let jwt = await AsyncStorage.getItem ('jwt');
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(
      (resJson) => {
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].status == 'PROCESSING')
          this.state.listOrder.push(resJson[i]);
        }
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

    for (var i = 0; i < this.state.listOrder.length; i++) {
      this.state.loadData.push(this.state.listOrder[i]);
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
                for (
                  var i = 0;
                  i < this.state.loadData.length;
                  i++
                ) {
                  var index = this.state.loadData.indexOf(
                    this.state.loadData[i]
                  );
                  if (index > -1) {
                    this.state.loadData.splice(index, 1);
                    this.state.loadData.d;
                  }
                  i++;
                }
                for (
                  var i = 0;
                  i < this.state.listOrder.length;
                  i++
                ) {
                  this.state.loadData.push(
                    this.state.listOrder[i]
                  );
                }
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
          <View
            style={{ flex: 1, width: "100%", marginTop: 20 }}
          >
            <FlatList
              data={this.state.loadData}
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
    position: "absolute",
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
    height: 112,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    width: "90%",
  },

  title: {
    fontSize: 23,
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
    marginRight: 20,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    fontSize: 30,
    color: "white",
  },

  buttonView: {
    padding: 20,
    backgroundColor: "rgba(80, 203, 203, 1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: (Dimensions.get("screen").width * 8) / 10,
  },

  buttonCancelView: {
    padding: 15,
    backgroundColor: "#d63d2f",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: (Dimensions.get("screen").width * 8) / 10,
  },
});