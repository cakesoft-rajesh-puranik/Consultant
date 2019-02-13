import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import firebase from 'firebase';

export default class MakeAppointment extends React.Component {
  static navigationOptions = {
    title: 'Make Appointment',
    headerStyle: {
        backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    },
};


constructor(props) {
  super(props);
  this.state = {
    slot : [],
    id:this.props.navigation.state.params.id,
  };
}

componentWillMount(){
  this.getAppointments();
}


getAppointments = async() =>{
 await firebase.database().ref('consultants/'+this.state.id).child('availabilities')
    .child("13-02-2019").on('child_added', (snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      childData.key = childKey;
      console.log(childData.timeSlot)
      const obj = {'key':childData.timeSlot};
      const newArray = this.state.slot.slice(); // Create a copy
      newArray.push(obj); // Push the object
      this.setState({ slot: newArray });
      console.log(this.state.slot);   
    });
}

  render() {
    return (
        <View style={styles.container}>
        <Text style={{ color: 'purple' }}>13-02-2019</Text>
        <FlatList
          data={this.state.slot}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
  );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FCFCFC',
      alignItems: 'center',
    }
  });