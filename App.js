import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import firebase from "firebase";
import SignUp from "./app/pages/signUp";
import SignIn from "./app/pages/signIn";
import Profile from "./app/pages/profile";
import Availability from "./app/pages/availability";
import Appointment from "./app/pages/appointment";
import MakeAppointment from "./app/pages/makeAppointment";
import Conversation from "./app/pages/conversation";
import SplashScreen from "./app/pages/SplashScreen";
import { createSwitchNavigator, createStackNavigator, createAppContainer } from "react-navigation";
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
const AuthStack = createStackNavigator({  
  SignIn: { screen: SignIn },
  SignUp: { screen: SignUp }, });
const MainScreen = createStackNavigator({
  Profile: { screen: Profile },
  Appointment: { screen: Appointment },
  Availability: { screen: Availability },
  MakeAppointment: { screen: MakeAppointment },
  Conversation:{screen:Conversation},
  
});

const App = createAppContainer(createSwitchNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    App: MainScreen,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'SplashScreen',
  }
));

//const App = createAppContainer(MainScreen);

export default App;

