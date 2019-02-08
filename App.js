import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import SignUp from './pages/signUp';
import { createStackNavigator,createAppContainer} from 'react-navigation';



var config = {
  databaseURL: "https://consultant-d3f7f.firebaseio.com",
  projectId: "consultant-d3f7f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const MainScreen = createStackNavigator(
{
  SignUp: { screen: SignUp },   
},);


const App = createAppContainer(MainScreen);

export default App;

