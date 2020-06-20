import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    LOGIN_ENDPOINT,
    USER_ENDPOINT,
} from '../api/endpoint';
import DropdownAlert from 'react-native-dropdownalert';
import NavigationService from '../service/navigation';
import { POSTLOGIN, PUT, GET } from '../api/caller';

export default class LoginScreenV2 extends React.Component {
    state = { username: '', password: '' };

    handleLogin = async () => {
        const { username, password } = this.state;
        if (username === '' || password === '') {
            this.dropDownAlertRef.alertWithType(
                'warn',
                'Error Message',
                'Please Fill username and password'
            );
        } else {
            await POSTLOGIN(
                LOGIN_ENDPOINT,
                {},
                {},
                {
                    username: username,
                    password: password,
                }
            ).then(async res => {
                if (res.status === 200) {
                    const jwt = res.headers.get('Authorization');
                    await AsyncStorage.setItem('jwt', jwt);
                    NavigationService.navigate('Home');
                    await GET(USER_ENDPOINT + '?isMyProfile=1', {}, {})
                        .then(async res => {

                            await AsyncStorage.setItem('userId', res[0].id + '');
                        })
                        .catch(error => {
                            console.log('ReqeustDetailScreen apiget User ERROR');
                            console.log(error);
                        });
                }
                if (res.status != 200) {
                    this.dropDownAlertRef.alertWithType('error', 'Error', res.status);
                }
            });
        }
    };
    render() {
        return (
            <SafeAreaView style={styles.Containter}>
                <StatusBar />
                {/* <View style={styles.Containter}> */}
                <KeyboardAvoidingView style={styles.Containter}>
                    <DropdownAlert ref={ref => (this.dropDownAlertRef = ref)} />
                    <TouchableWithoutFeedback style={styles.Containter} onPress={Keyboard.dismiss}>
                        <View style={styles.Containter}>
                            <View style={styles.LogoContaninter}>
                                <Image style={styles.Logo}
                                    source={require('../assets/images/LogoV2.png')} >
                                </Image>
                                <Text style={styles.Titles}>Lets find some job!</Text>
                            </View>
                            <View style={styles.infoContainter}>
                                <TextInput style={styles.input}
                                    placeholder="Username/email"
                                    placeholderTextcolor='rgba(255,255,255,0.8)'
                                    keyboardType='email-address'
                                    returnKeyType='next'
                                    autoCorrect={false}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextcolor='rgba(255,255,255,0.8)'
                                    keyboardType='default'
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                    ref={"txtPassword"}
                                />
                                <TouchableOpacity style={styles.buttonContainer} onPress={this.handleLogin}>
                                    <Text style={styles.buttonText}>SIGN IN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                {/* </View> */}
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    Containter: {
        flex: 1,
        backgroundColor: 'rgb(246,246,246)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    LogoContaninter: {
        alignItems: 'center',
        justifyContent: 'center',
        // paddingBottom: hp(2),
        // flex: 1,
        flexDirection: "column",
    },
    Titles: {
        color: '#f7c744',
        fontSize: 20,
        textAlign: 'center',
        // marginTop: hp(2),
        marginBottom: hp(4),
        opacity: 0.9
    },
    Logo: {
        width: wp(80),
        height: hp(20),
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 200,
        padding: 20,
        backgroundColor: 'red'
    },
    input: {
        color: '#fff',
        height: hp(5.2),
        width: wp(80),
        backgroundColor: '#707070',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonContainer: {
        backgroundColor: 'rgb(246, 150, 14)',
        paddingVertical: hp(1.7),
        paddingHorizontal: wp(20),
        marginTop: hp(1.2),
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32,53,70)',
        fontWeight: 'bold',
        fontSize: 20,
    }
});
