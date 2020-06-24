import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList, ActivityIndicator, Image, TouchableHighlight, Dimensions } from 'react-native';
import { GET } from '../api/caller';
import { WORKER_HISTORY_ENDPOINT } from '../api/endpoint';
import NavigationService from '../service/navigation';
import { FontAwesome5 } from '@expo/vector-icons';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;


class FlatListItem extends Component {
  handlerSelectCatogery = (orderId) => {
    NavigationService.navigate("HistoryDetail", { orderId: orderId })
  }

  render() {
    switch (this.props.item.status) {

      case 'COMPLETED': {
        return (
          <TouchableHighlight onPress={() => {
            this.handlerSelectCatogery(this.props.item.id)

          }
          }>
            <View style={styles.itemHandle}>
              <Image source={require('../assets/images/complete.png')} style={styles.image} />
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.title}>{this.props.item.workDescription.description}</Text>
                <Text style={styles.subtitle}>{this.props.item.workDescription.dateCreated}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
      case 'PROCESSING': {
        return (
          <TouchableHighlight onPress={() => {
            this.handlerSelectCatogery(this.props.item.id)
          }
          }>
            <View style={styles.itemHandle}>
              <Image source={require('../assets/images/processing.png')} style={styles.image} />
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.title}>{this.props.item.workDescription.description}</Text>
                <Text style={styles.subtitle}>{this.props.item.workDescription.dateCreated}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
      case 'CANCELED': {
        return (
          <TouchableHighlight onPress={() => {
            this.handlerSelectCatogery(this.props.item.id)
          }
          }>
            <View style={styles.itemHandle}>
              <Image source={require('../assets/images/cancel.png')} style={styles.image}></Image>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.title}>{this.props.item.workDescription.description}</Text>
                <Text style={styles.subtitle}>{this.props.item.workDescription.dateCreated}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      }
      default: {
        return (
          <View>
            <Text>{this.props.item.status}</Text>
            <Text>{this.props.item.id}</Text>
          </View>
        );
      }
    }
  }
}

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      isLoading: true,
      listOrder: [],

    });
  }



  async componentDidMount() {
    // let jwt = await AsyncStorage.getItem ('jwt');
    await GET(
      WORKER_HISTORY_ENDPOINT,
      {},
      {},
    ).then((resJson) => {

      for (var i = 0; i < resJson.length; i++) {
        this.state.listOrder.push(resJson[i])
      }

      this.setState({
        isLoading: false,
      });
    })
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View>
            <ActivityIndicator size="large" />
          </View>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.bgHeader}>
          <TouchableHighlight onPress={() => NavigationService.navigate("ProfileScreen")}>
            <View style={styles.profile}>
              <FontAwesome5 name="arrow-left" size={24} color="black" />
            </View>
          </TouchableHighlight>
          <Text style={styles.headerStyle}>History orders</Text>

        </View>
        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={this.state.listOrder}
            renderItem={({ item, index }) => {
              return (
                <FlatListItem item={item} index={index}></FlatListItem>
              )
            }}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingTop: 20,
  },
  itemHandel: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  flatListItem: {
    color: '#000',
    padding: 10,
    fontSize: 16,
  }, image: {
    width: 52,
    height: 52,
    margin: 15
  },
  item: {
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  itemHandle: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 2,
    marginTop: 2,
    borderRadius: 5,
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