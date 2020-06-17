import React, {Component} from 'react';
import {
  Keyboard,
  TextInput,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  AsyncStorage,
  StatusBar,
  KeyboardAvoidingView,
  View,
  Text,
  Button,
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {LOGIN_ENDPOINT} from '../api/endpoint';
import NavigationService from '../service/navigation';
import {POSTLOGIN} from '../api/caller'

export default class LoginScreen extends Component {
  state = {username: '', password: ''};

  handleLogin = async () => {
    const {username, password} = this.state;
    // if (username === '' || password === '') {
    //   this.dropDownAlertRef.alertWithType (
    //     'warn',
    //     'Error Message',
    //     'Please Fill username and password'
    //   );
    // } else {
      // await POSTLOGIN (
      //   LOGIN_ENDPOINT,
      //   {},
      //   {},
      //   {
      //     username: username,
      //     password: password
      //   }
      // ).then (async res => {
      //   if (res.status === 200) {
         
      //     await AsyncStorage.setItem ('jwt', res.headers.get("Authorization"));
      //     console.log(res.headers.get("Authorization"));
          NavigationService.navigate('Home');
      //   }
      //   if(res.status != 200) {
      //     this.dropDownAlertRef.alertWithType('error','Error', res.status)
      //   }
      // });
    // }
  };

  render () {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
              <Text style={styles.logoText}>Fixxy Worker</Text>
              <TextInput
                onChangeText={text => {
                  this.setState ({username: text});
                }}
                placeholder="Username"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
              />
              <TextInput
                onChangeText={text => {
                  this.setState ({password: text});
                }}
                placeholder="Password"
                placeholderColor="#c4c3cb"
                style={styles.loginFormTextInput}
                secureTextEntry={true}
              />
              <Button
                buttonStyle={styles.loginButton}
                onPress={this.handleLogin}
                title="Login"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create ({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
});
