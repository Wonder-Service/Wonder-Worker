import React, {Component} from 'react';
import Text from 'react-native'
import { createAppContainer} from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import * as Font from "expo-font";
import { Platform, ActivityIndicator, StatusBar, View } from "react-native";
import Login from "./screens/LoginScreen";
import Home from "./screens/HomeScreen";
// import NewHome from "./screens/NewHomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginV2 from "./screens/LoginScreenV2";
import NavigationService from "./service/navigation";
import MapDirection from './components/MapDirection';
import HistoryScreen from './screens/HistoryScreen';
import HistoryDetail from "./screens/HistoryDetail";
import RequestScreen from "./screens/ListRequestScreen";
import { AppLoading } from 'expo';


const Container = createStackNavigator (
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    LoginV2:{
      screen: LoginV2,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    HistoryScreen:{
      screen:HistoryScreen,
      navigationOptions:{
        header: null,
        gesturesEnabled: false,
      },
    },
    HistoryDetail:{
      screen:HistoryDetail,
      navigationOptions:{
        header: null,
        gesturesEnabled: false,
      },
    },
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    // NewHome: {
    //   screen: NewHome,
    //   navigationOptions: {
    //     header: null,
    //     gesturesEnabled: false,
    //   },
    // },
    MapDirection: {
      screen: MapDirection,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },

    RequestScreen: {
      screen: RequestScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: "LoginV2",
  }
);

const AppContainer = createAppContainer(Container);

class App extends Component {                                                                                                                                                                                                                                                                                                                                                         
  state = {
    fontsAreLoaded: false,
    notification: {},
    isReady: false,
 };

 async loadAsset() {
  await Font.loadAsync({
    "Rubik-Black": require("./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf"),
    "Rubik-BlackItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf"),
    "Rubik-Bold": require("./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf"),
    "Rubik-BoldItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf"),
    "Rubik-Italic": require("./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf"),
    "Rubik-Light": require("./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf"),
    "Rubik-LightItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf"),
    "Rubik-Medium": require("./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf"),
    "Rubik-MediumItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf"),
    "Rubik-Regular": require("./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf"),
    "rubicon-icon-font": require("./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf")
   });
  }
  
  render() {
  
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAsset}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )

    } else {
      return (
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      );
    }
  }
}

export default App;