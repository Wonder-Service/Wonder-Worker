import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text,
  TouchableOpacity, Modal,
  SafeAreaView, Dimensions, FlatList, ActivityIndicator, ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import NavigationService from '../service/navigation';
import registerForPushNotificationsAsync from '../service/notification';

import { GET, POST_NOTI } from '../api/caller';
import {
  ORDER_GET_BY_SKILL_ENDPOINT,
  USER_GET_PROFILE_ENDPOINT,
  NOTIFICATION_TYPE_REQEST,
  NOTIFICATION_TYPE_ACCEPT,
  POST_NOTIFICATION_ENDPOINT,
} from '../api/endpoint';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';

var currentDate = moment().format("YYYY-MM-DD");


export default class listRequestScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      listOrder: [],
      loadData: [],
      latitude: null,
      longitude: null,
      orderID: "",
      orderDescription: "",
      userName: "",
      userAddress: "",
      userPhone: "",
      notification: 1,
    };
  }
  bs = React.createRef();

  handlerRefresh = async () => {
    this.setState({ isLoading: true });
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(

      (resJson) => {
        this.setState({ loadData: [], listOrder: [] })
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].status == 'PROCESSING' && resJson[i].workDescription.dateCreated == currentDate) {
            this.state.loadData.push(resJson[i]);
          }
        }
        for (var i = 0; i < this.state.loadData.length; i++) {
          this.state.listOrder.push(this.state.loadData[i]);
        }
        this.state.listOrder.reverse();
        this.setState({ isLoading: false, });
      }
    );
  };


  enableNotification = async () => {
    registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(async noti => {
      this.setState({ notification: noti.data });
      if (this.state.notification.notificationType === NOTIFICATION_TYPE_REQEST) {
        this.handlerRefresh()
      }
    });
  };

  // get order by skill
  async componentDidMount() {
    await GET(ORDER_GET_BY_SKILL_ENDPOINT, {}, {}).then(
      (resJson) => {
        this.setState({ loadData: [], listOrder: [] })
        for (var i = 0; i < resJson.length; i++) {
          if (resJson[i].status == 'PROCESSING' && resJson[i].workDescription.dateCreated == currentDate) {
            this.state.loadData.push(resJson[i]);
          }
        }
        for (var i = 0; i < this.state.loadData.length; i++) {
          this.state.listOrder.push(this.state.loadData[i]);
        }
        this.state.listOrder.reverse();

        this.setState({ isLoading: false, });
      }
    );
    await this.enableNotification();
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginTop: '10%' }}>
          <View>
            <ActivityIndicator size="small" />
          </View>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerInfo}>
            <Text style={{ fontSize: 20 }}>List Request</Text>
          </View>
          {/* Refresh button */}
          <View style={styles.imageHeader}>
            <TouchableOpacity onPress={() => { this.handlerRefresh() }} >
              <View style={styles.buttonRefresh}>
                <Image style={{ width: 20, height: 20, }} source={require("../assets/images/refreshButton.png")} />
                <Text style={{ color: "#fff", marginLeft: 10, fontSize: 20, }}>Refresh</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView style={{ marginTop: "5%" }}>
            <View style={{ flex: 1, width: "100%", marginTop: 20 }}>
              <FlatList
                data={this.state.listOrder}
                renderItem={({ item, index }) => {
                  return (
                    <FlatListItem
                      item={item}
                      index={index}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ScrollView>

          {/* Job find */}
          <View style={styles.bodyTextContainer}>
            <Text style={styles.bodyText}>Let's Start Working!!</Text>
            <TouchableOpacity onPress={() => { NavigationService.navigate("Home") }}>
              <View style={styles.bodyButton}>
                <Text style={{ color: "#fff", padding: 5 }}> stop</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

class FlatListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      latitude: null,
      longitude: null,
      notification: 1,
      orderID: "",
      orderDescription: "",
      customerID: "",
      customerName: "",
      customerAddress: "",
      customerDeviceId: "",
      customerPhone: "",
      orderDevice: "",
      modalName: "",
      data: {
        notificationType: 'abc',
        workerId: '',
        diagnoseMess: 'abc',
        price: 'abc',
        orderId: '',
      },
    }
  };

  unableNotification = async () => {
    registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(async noti => {
      this.setState({ notification: noti.data });
      if (this.state.notification.notificationType === NOTIFICATION_TYPE_ACCEPT) {
        NavigationService.navigate('MapDirection', this.state.orderID);
        this.setModalVisible(false)
      }
    });
  };


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  handleAccept = async () => {

    await GET(USER_GET_PROFILE_ENDPOINT, {}, {})
      .then(res => {
        this.state.data.workerId = res[0].id
      })
    this.state.data.orderId = this.state.orderID;
    this.state.data.notificationType = NOTIFICATION_TYPE_REQEST;
    let param = {
      to: 'ExponentPushToken[' + this.state.customerDeviceId + ']',
      title: 'FixxySystem App Notificaiton',
      subtitle: 'worker notifcation',
      body: 'You have a new notifcation',
      data: this.state.data,
    };
    //send notification to customer
    await POST_NOTI(POST_NOTIFICATION_ENDPOINT, {}, {}, param)
      .then(res => {
        if (res.status === 200) {
          // waiting for customer accept
        }
      })
      .catch(err => console.log(err));
  };

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
    await this.unableNotification();
  };

  render() {
    const {
      modalVisible,
      orderDevice,
      orderDescription,
      customerName,
      customerAddress,
      customerPhone,
    } = this.state;

    if (this.props.item.address == null) {
      this.props.item.address = "Home"
    }

    return (
      // Order
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
          }}
        >
          <View style={styles.itemHandle}>
            <Image source={require("../assets/images/regItemImage.jpg")} style={styles.image} />
            <View style={{ flexDirection: "column", width: "60%", justifyContent: 'center', alignItems: 'flex-start', marginLeft: '5%' }}>
              <Text style={styles.title}>{this.props.item.nameDevice}</Text>
              <Text style={styles.subtitle}>Customer: {this.props.item.customer.fullname}</Text>
              <Text style={styles.subtitle}>Address: {this.props.item.customer.address}</Text>
              <Text style={styles.subtitle}> {this.props.item.workDescription.dateCreated}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* POP UP */}
        <Modal
          style={styles.centeredView}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.modalView}>
            <Text style={{ fontSize: 25, fontWeight: '800', textAlign: 'center' }}>Order Detail</Text>
            {/* Device Name */}
            <View style={styles.popUpDeviceName}>
              <MaterialIcons name="devices" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Device Name: {orderDevice}</Text>
            </View>

            {/* Issue */}
            <View style={styles.popUpIssue}>
              <Octicons name="issue-opened" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Issue: {orderDescription}</Text>
            </View>

            <Text style={styles.popUpCustomerInformation}>Customer Information</Text>

            {/* Address */}
            <View style={styles.popUpAddress}>
              <Entypo name="location" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Address: {customerAddress}</Text>
            </View>

            {/* Customer name */}
            <View style={styles.popUpCustomerName}>
              <FontAwesome name="user" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Name: {customerName}</Text>
            </View>

            {/* Customer phone */}
            <View style={styles.popUpPhone}>
              <FontAwesome name="phone-square" size={24} color="black" />
              <Text style={{ fontSize: 20, marginLeft: 5 }}> Phone: {customerPhone}</Text>
            </View>

            {/* Handle Accept */}
            <TouchableOpacity onPress={this.handleAccept}>
              <View style={styles.buttonView}>
                <Text style={styles.mainButtonText}>Accept</Text>
              </View>
            </TouchableOpacity>

            {/* Handle Back */}
            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
              <View style={styles.buttonCancelView}>
                <Text style={styles.mainButtonText}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
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
    // borderColor: "#F56258",
    borderWidth: 1,
    flexDirection: "row",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "6%",
    borderRadius: 20,
    marginTop: 35,
    marginLeft: 20,
    backgroundColor: "#FE0B36",
    width: "65%",
    borderColor: "#fff",
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
    padding: 8,
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

  popUpDeviceName: {
    width: Dimensions.get('screen').width * 7 / 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6
  },
  popUpIssue: {
    width: Dimensions.get('screen').width * 7 / 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6
  },

  popUpAddress: {
    width: Dimensions.get('screen').width * 7 / 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6,
    marginTop: 10
  },

  popUpCustomerInformation: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: '800',
    textAlign: 'center'
  },

  popUpCustomerName: {
    width: Dimensions.get('screen').width * 7 / 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6,
    marginTop: 10
  },

  popUpPhone: {
    width: Dimensions.get('screen').width * 7 / 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.6,
    marginTop: 10
  },
});