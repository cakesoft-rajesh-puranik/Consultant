import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Button,
  FlatList
} from "react-native";
import firebase from "firebase";
import CustomRow from "../components/CustomRow";
import CustomProgressBar from '../components/progressBar';

export default class Appointment extends React.Component {
  static navigationOptions = {
    title: "Book Appointment",
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };


  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isProgressBar: false
    };
  }

  componentWillMount() {
    this.setState({ isProgressBar: true });
    this.getConsultants();
  }

  onPressCell = async (item) => {
    console.log("item " + item.id);
    this.props.navigation.navigate('MakeAppointment', { id: item.id })
  }

  getConsultants = async () => {
    await firebase.database().ref('consultants').once('value').then(value => {
      const usersDict = {}
      const data = value.val();
      Object.keys(data).map((key, index) => {
        firebase.database().ref('users/' + key).once('value').then(value => {
          usersDict[key] = value.val();
          const obj = { 'email': value.val()['email'], 'PhoneNumber': value.val()['PhoneNumber'], 'Price': value.val()['price'], 'id': key };
          const newArray = this.state.users.slice(); // Create a copy
          newArray.push(obj); // Push the object
          this.setState({ users: newArray });
          console.log("Default user printin :- ", this.state.users);
        });
      });
    });
    this.setState({ isProgressBar: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <CustomProgressBar visible={this.state.isProgressBar}></CustomProgressBar>
          <Text style={fontsize = 50}></Text>
        </View>
        <FlatList
          data={this.state.users}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() => this.onPressCell(item)}>
              <CustomRow
                email={item.email}
                PhoneNumber={item.PhoneNumber}
                Price={item.Price}
              />
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  }
});