import React, { Component } from "react";
import {
  Text,
  Image,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  AsyncStorage,
  SafeAreaView,
} from "react-native";
import { Input, Block, theme, Button } from 'galio-framework';
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from 'react-native-gesture-handler'; 
import { GET,PUT } from "../api/caller";
import { USER_ENDPOINT, USER_GET_PROFILE_ENDPOINT  } from "../api/endpoint";
import NavigationService from '../service/navigation';


const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

export default class ProfileScreen extends Component{
    state = { 
        fullName: '',
        editableProfile:false,
        displayBtnSave: 0,
        address: '',
        email: '',
        phone: '',
        borderBottomColorProfile: 0,
        id:'',
        };

  handleBackHomeButton = () => {
    NavigationService.navigate("HomeScreen")
  }

  handleLogoutButton = () => {
    NavigationService.navigate("Login")
  }

    // not have history order Screen yet
  handleHistoryOrderButton = () => {
    NavigationService.navigate("HistoryOrderScreen")
  }


  handleUpdate = async () =>{
    console.log()
    console.log(this.state.id)
    console.log(this.state.phone)
    console.log(this.state.email)
    let id = this.state.id
    await PUT(USER_ENDPOINT + "/"+ id,{},{},{
      address: this.state.address,
      email: this.state.email,
      phone: this.state.phone,
    })
      .catch(error => {
        this.dropDownAlertRef.alertWithType('error', 'Error', error);
        console.log(error);
      });
  }


        async componentDidMount () {
            //get jwt
            //load profile data 
          await GET(USER_GET_PROFILE_ENDPOINT,{}, {})

            .then(res => {
                this.setState({
                    id : res[0].id,
                    email: res[0].email,
                    phone: res[0].phone,
                    fullName: res[0].fullname,
                    address: res[0].address,
                  
                })
                console.log(this.state.fullName)
              console.log(this.state.email)
              console.log(this.state.id)
              console.log(this.state.phone)
              
                
        
            })
        }

        
        
    render(){
      const { editableProfile, displayBtnSave, email, address, fullName, phone, borderBottomColorProfile} = this.state
        return (
          <SafeAreaView style={styles.profile}>
            <ScrollView >
              <View
                style={{ width: "100%", height: 200, backgroundColor: "black",}}
              >

                <Text
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 30,
                    marginTop: 50,
                    marginLeft: 20,
                    color: "white",
                  }}
                >
                  Profile
                </Text>
              </View>

              <View style={styles.profileBody}>

                <View 
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}>
                <Image
                    style={{
                      marginTop: -80,
                      width: 150,
                      height: 150,
                      borderRadius: 100,
                      }}
                  source={{
                    uri: 'https://www.clipartwiki.com/clipimg/full/146-1460660_handyman-clipart-hardware-store-mr-fix-it-logo.png',
                  }}
                />
                </View>

                {/* Add Full name */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    height: 50,
                    marginTop: -10,
                    marginLeft:15,
                    
                  }}
                >
                  {/* Full name */}
                  <Text style={styles.userFullName}>
                    {fullName}
                  </Text>

                  {/* Edit Button */}
                  <TouchableOpacity
                    style= {{
                      marginLeft:30,
                      marginTop:-24,
                    }}
                    onPress={() => {
                      //set editable = true
                      if (editableProfile == false) {
                        this.setState({ editableProfile: true });
                      }
                      //set display save button = true
                      if (displayBtnSave == 0) {
                        this.setState({ displayBtnSave: 1.0 });
                      }

                      if (borderBottomColorProfile==0){
                        this.setState({ borderBottomColorProfile: "rgba(0, 0, 0, 0.24)"});
                      }
                    }}
                  >
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      source={{
                        uri:
                          "https://cdn.icon-icons.com/icons2/1875/PNG/512/editpencil_120034.png",
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Phone Number */}
                <View style={{ flexDirection: "row", marginTop: 30 }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: 20,
                      opacity: 0.5,
                    }}
                    source={{
                      uri:
                        "https://cdn.iconscout.com/icon/free/png-64/call-447-475007.png",
                    }}
                  />

                  {/* load phone number  */}
                  <TextInput
                    editable={editableProfile}
                    style={{ 
                      opacity: 0.6,
                      borderBottomWidth: 1.5,
                      width: "75%",
                      marginTop: -10,
                      marginLeft: 15,
                      fontSize: 16,
                      fontFamily: "Roboto",
                      borderBottomColor: borderBottomColorProfile, 
                      }}
                    onChangeText={text => {
                      this.setState({ phone: text });
                    }}
                  >
                    {phone}
                  </TextInput>
                </View>

                {/* Address */}
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: 20,
                      opacity: 0.5,
                    }}
                    source={{
                      uri:
                        "https://cdn1.iconfinder.com/data/icons/real-estate-84/64/x-24-512.png",
                    }}
                  />
                  {/* load Address  */}
                  <TextInput
                    editable={editableProfile}
                    style={{
                      opacity: 0.6,
                      borderBottomWidth: 1.5,
                      width: "75%",
                      marginTop: -10,
                      marginLeft: 15,
                      fontSize: 16,
                      fontFamily: "Roboto",
                      borderBottomColor: borderBottomColorProfile, 
                      }}
                    onChangeText={text => {
                      this.setState({ address: text });
                    }}
                  >
                    {address}
                  </TextInput>
                </View>

                {/* Email */}
                <View style={{ flexDirection: "row", marginTop: 25 }}>
                    <Image
                    style={{
                        width: 25,
                        height: 25,
                        marginLeft: 20,
                        opacity: 0.5,
                    }}
                    source={{
                        uri:"https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-email-512.png",
                    }}/>
                  {/* load Email  */}
                  <TextInput
                    editable={editableProfile}
                    style={{
                      opacity: 0.6,
                      borderBottomWidth: 1.5,
                      width: "75%",
                      marginTop: -10,
                      marginLeft: 15,
                      fontSize: 16,
                      fontFamily: "Roboto",
                      borderBottomColor: borderBottomColorProfile, 
                      }}
                    onChangeText={text => {
                      this.setState({ email: text });
                    }}
                  >
                    {email}
                  </TextInput>
                </View>

                {/* History Button */}
                  <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }}
                  onPress={this.handleHistoryOrderButton}>
                    <Image
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: 23,
                      opacity: 0.5,
                    }}
                      source={require("../assets/images/historyButton.png")}
                    />
                  <Text style={{
                    opacity: 0.6,
                    width: "75%",
                    marginLeft: 14,
                    fontSize: 16,
                    fontFamily: "Roboto",
                  }}>History</Text>
                  </TouchableOpacity>

                {/* Log out */}
                <TouchableOpacity style={{ flexDirection: "row", marginTop: 25 }}
                  onPress={this.handleLogoutButton}
                  >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      marginLeft: 23,
                      opacity: 1,
                    }}
                    source={require("../assets/images/logoutButton.png")}
                  />
                  <Text style={{
                    opacity: 0.6,
                    width: "75%",
                    marginLeft: 14,
                    fontSize: 16,
                    fontFamily: "Roboto",
                  }}>Logout</Text>
                </TouchableOpacity>

              </View>


              {/* Save and back to home  */}
              <View style={{flexDirection:"row",width:'100%',height:200}}>
                
                {/* Back home button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 1.00,

                    elevation: 1,
                    zIndex: -1,
                    borderRadius: 10,


                    width: 80, height: 60,
                    justifyContent:'center',
                    alignItems:'center',
                    marginLeft:50,
                    marginTop: 50,
                  }}
                  onPress={this.handleBackHomeButton}
                >
                  <Image
                    
                    source={require("../assets/images/backButtonProfile.png")}
                  />
                </TouchableOpacity>

                {/* Button Save */}
                <TouchableOpacity 
                  style={{
                    marginTop:50,
                    marginLeft: 20,
                  }}
                  onPress={() => {
                    
                    //disappear save button
                    this.setState({ displayBtnSave: 0 });
                    // disable all profile
                    this.setState({ editableProfile: false });

                    // disappear edit line
                    this.setState({ borderBottomColorProfile: 0 });

                    // handle update
                    this.handleUpdate();
                    
                  }}
                >
                  <Image
                    style={{ width: 230,height:60,borderRadius:10,}}
                    source={require("../assets/images/btnSaveProfile.png")}
                  />
                </TouchableOpacity>
            
              </View>

            </ScrollView>
          </SafeAreaView>
        );
    };
}

const styles = StyleSheet.create({
    profile: {
        flex: 1,
        flexDirection: "column",
    },
    
    userHeader: {
        fontSize: 24,
        fontFamily: "Roboto",
        marginTop: 15,
        justifyContent: "center",
    },

    userFullName: {
        borderBottomColor: "rgba(0, 0, 0, 0.24)",
        borderBottomWidth: 0.6,
        width: "50%",
        marginTop: 20,
        marginLeft: 30,
        fontSize: 25,
        fontFamily: "Roboto",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        opacity: 1,
    },

    Header: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },

    profileBody: {
        backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,

      elevation: 1,
      zIndex: -1,
      borderRadius: 30,

        width: "85%",
        height: 400,
        marginLeft: 34,
        marginTop: -30,
    },
    
    logoutButton: {
        width: 100,
    },

    profileDetail: {

    },
});
