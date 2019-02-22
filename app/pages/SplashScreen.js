import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  Text,
  View,
} from 'react-native';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.checkLoginAuth();
  }

  checkLoginAuth = async () => {
    const userId = await AsyncStorage.getItem('userID');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userId ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
        <View style={{ flex: 1 , justifyContent: 'center' , alignItems: 'center' , backgroundColor : '#34495e'}}>
        <StatusBar backgroundColor="#2c3e50" barStyle="light-content"/> 
        <ActivityIndicator color={'white'}/> 
    </View>
    );
  }
}