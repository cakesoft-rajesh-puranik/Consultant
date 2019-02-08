import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import SignUp from './pages/signUp';
import SignIn from './pages/signIn'
import Profile from './pages/profile'
import { createStackNavigator,createAppContainer} from 'react-navigation';

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB5upggL3Ch81UAT9BsX5mXuhE9vyJrhw4",
    authDomain: "consultant-d3f7f.firebaseapp.com",
    databaseURL: "https://consultant-d3f7f.firebaseio.com",
    projectId: "consultant-d3f7f",
    storageBucket: "consultant-d3f7f.appspot.com",
    messagingSenderId: "92712248490"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const MainScreen = createStackNavigator(
{
  SignUp: { screen: SignUp },  
  SignIn: { screen: SignIn }, 
  Profile:{ screen: Profile},
},);

const App = createAppContainer(MainScreen);

export default App;

