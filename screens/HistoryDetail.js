import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, StatusBar, AsyncStorage, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-elements';
import { GET } from '../api/caller';
import NavigationService from '../service/navigation';
import { ACCEPT_ORDER_ENDPOINT } from '../api/endpoint';
import { Icon } from 'react-native-elements';



export default class HistoryDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        orderId: 1,
        workerId: 1,
        workerName: '',
        description: '',
        dateCreated: '',
        rate: 0,
        nameDevice: '',
        status: '',
        totalCredit: null,
        feedback: null,

    };


    async componentDidMount() {
        // this.focusListener = this.props.navigation.addListener(
        //     'didFocus',
        //     async () => {
        await this.setState({
            orderId: this.props.navigation.getParam('orderId', 2)
        })

        await GET(
            ACCEPT_ORDER_ENDPOINT + '/' + this.state.orderId,
            {},
            {},
        ).then((resJson) => {
            
            this.setState({
                description: resJson.workDescription.description,
                dateCreated: resJson.workDescription.dateCreated,
                rate: resJson.rate,
                nameDevice: resJson.nameDevice,
                status: resJson.status,
                totalCredit: resJson.totalCredit,
                feedback: resJson.feedback,
            })
        })
        
        // })
    }

    render() {
        switch (this.state.status) {

            case 'COMPLETED': {
                return (
                    <SafeAreaView style={styles.container}>
                        <StatusBar barStyle="light-content" />
                        <View style={styles.bgHeader}>
                            <TouchableHighlight onPress={() => NavigationService.navigate("HistoryScreen")}>
                                <View style={styles.profile}>
                                    <Icon
                                        name='arrow-left'
                                        type='font-awesome-5'
                                        color='#000'
                                    />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.headerStyle}>History orders</Text>

                        </View>
                        <View style={styles.itemHandle}>
                            <Image source={require('../assets/images/complete.png')} style={styles.image} />
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={styles.title}>{this.state.description}</Text>
                                <Text style={styles.subtitle}>{this.state.dateCreated}</Text>
                            </View>
                        </View >

                        <View style={styles.itemHandleDetail}>
                            <Rating imageSize={55} readonly startingValue={this.state.rate} style={styles.rating} />
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Date order</Text>
                                <Text style={styles.text}>: {this.state.dateCreated}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Device</Text>
                                <Text style={styles.text}>: {this.state.nameDevice}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Status</Text>
                                <Text style={styles.text}>: {this.state.status}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Credit</Text>
                                <Text style={styles.text}>: {this.state.totalCredit}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Feedback</Text>
                                <Text style={styles.text}>: {this.state.feedback}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                );
            }
            case 'PROCESSING': {
                return (
                    <SafeAreaView style={styles.container}>
                        <StatusBar barStyle="light-content" />
                        <View style={styles.bgHeader}>
                            <TouchableHighlight onPress={() => NavigationService.navigate("HistoryScreen")}>
                                <View style={styles.profile}>
                                    <Icon
                                        name='arrow-left'
                                        type='font-awesome-5'
                                        color='#000'
                                    />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.headerStyle}>History orders</Text>

                        </View>
                        <View style={styles.itemHandle}>
                            <Image source={require('../assets/images/processing.png')} style={styles.image} />
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={styles.title}>{this.state.description}</Text>
                                <Text style={styles.subtitle}>{this.state.dateCreated}</Text>
                            </View>
                        </View >

                        <View style={styles.itemHandleDetail}>
                            <Rating imageSize={55} readonly startingValue={this.state.rate} style={styles.rating} />
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Date order</Text>
                                <Text style={styles.text}>: {this.state.dateCreated}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Device</Text>
                                <Text style={styles.text}>: {this.state.nameDevice}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Status</Text>
                                <Text style={styles.text}>: {this.state.status}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Credit</Text>
                                <Text style={styles.text}>: {this.state.totalCredit}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Feedback</Text>
                                <Text style={styles.text}>: {this.state.feedback}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                );
            }
            case 'CANCELED': {
                return (
                    <SafeAreaView style={styles.container}>
                        <StatusBar barStyle="light-content" />
                        <View style={styles.bgHeader}>
                            <TouchableHighlight onPress={() => NavigationService.navigate("HistoryScreen")}>
                                <View style={styles.profile}>
                                    <Icon
                                        name='arrow-left'
                                        type='font-awesome-5'
                                        color='#000'
                                    />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.headerStyle}>History orders</Text>

                        </View>
                        <View style={styles.itemHandle}>
                            <Image source={require('../assets/images/cancel.png')} style={styles.image} />
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <Text style={styles.title}>{this.state.description}</Text>
                                <Text style={styles.subtitle}>{this.state.dateCreated}</Text>
                            </View>
                        </View >

                        <View style={styles.itemHandleDetail}>
                            <Rating imageSize={55} readonly startingValue={this.state.rate} style={styles.rating} />
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Date order</Text>
                                <Text style={styles.text}>: {this.state.dateCreated}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Device</Text>
                                <Text style={styles.text}>: {this.state.nameDevice}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Status</Text>
                                <Text style={styles.text}>: {this.state.status}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Credit</Text>
                                <Text style={styles.text}>: {this.state.totalCredit}</Text>
                            </View>
                            <View style={styles.textRow}>
                                <Text style={styles.textHeader}>Feedback</Text>
                                <Text style={styles.text}>: {this.state.feedback}</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                );
            }

            default: {
                return (
                    <View style={{flex: 1,
                        backgroundColor: '#edebe9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}>
                        <ActivityIndicator size="large"/>
                    </View>
                )
            }
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#edebe9',
        alignItems: 'center',
        justifyContent: 'flex-start',
        // paddingTop: 20,
    },
    image: {
        width: 52,
        height: 52,
        margin: 15
    },
    item: {

        alignSelf: 'stretch',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
    },
    itemHandle: {

        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',

        marginBottom: 0.5,
        marginTop: 0.5,
        height: 112,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 23,
        fontWeight: '700',
        padding: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        paddingLeft: 10,
        // fontWeight: '700',
        color: '#7a7876',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: 3
    },
    textHeader: {
        fontSize: 20,
        fontWeight: '700',
        padding: 6,
        width: '30%',

    },
    text: {
        width: '70%',
        fontSize: 20,
        padding: 6,
        // fontWeight: '700',
        color: '#000',
    },
    itemHandleDetail: {
        // flex: 1,
        width: '100%',
        // height: 500,
        flexDirection: 'column',
        backgroundColor: '#fff',
        // marginLeft: 6,
        // marginRight: 6,
        marginBottom: 0.5,
        marginTop: 0.5,
        paddingLeft: 12,
        paddingTop: 7,
        paddingBottom: 7,
        // borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    rating: {
        marginBottom: 20,
        marginTop: 9
    },
    bgHeader: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        elevation: 10,
        height: '7.5%',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        flexDirection: 'row',
        position: 'relative'
    },
    headerStyle: {
        fontSize: 25,
        textAlign: 'center',
        marginLeft: '1%',
        color: '#000',
    },
    profile: {
        marginLeft: '7%',
        alignItems: 'center'

    }
});