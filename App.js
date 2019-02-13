import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import SignUp from './app/pages/signUp';
import SignIn from './app/pages/signIn'
import Profile from './app/pages/profile'
import Availability from './app/pages/availability'
import Appointment from './app/pages/appointment'
import MakeAppointment from './app/pages/makeAppointment'
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
  Availability: { screen: Availability },   
  Appointment: { screen: Appointment },   
  MakeAppointment: { screen: MakeAppointment },   
  Profile:{ screen: Profile},
},);


const App = createAppContainer(MainScreen);

export default App;

