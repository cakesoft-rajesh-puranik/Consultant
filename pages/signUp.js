import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import firebase from 'firebase';

export default class SignUp extends React.Component {

  static navigationOptions = {
    title: 'SignUp',
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
      textEmail: '',
      textPassword: '',
      textPhoneNumber: ''
    }
  }

  completeSignUp = async () => {
    var user = firebase.auth().currentUser;
    firebase.database().ref('users').child(user.uid).child('PhoneNumber').set(this.state.textPhoneNumber);
    firebase.database().ref('users').child(user.uid).child('Email').set(this.state.email);
  }


  onPressMakeAccount = async () => {
    await firebase.auth().createUserWithEmailAndPassword(this.state.textEmail, this.state.textPassword)
    .then(this.completeSignUp)
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else if (errorCode == 'auth/email-already-in-use') {
        alert('This email already has an account');
      } else if (errorCode == 'auth/invalid-email') {
        alert('Please enter a valid email');
      } else {
        alert(errorMessage);
      }
      //console.log(error);
    });



    writeUserData(email,fname,lname){
      firebase.database().ref('UsersList/').push({
          email,
          fname,
          lname
      }).then((data)=>{
          //success callback
          console.log('data ' , data)
      }).catch((error)=>{
          //error callback
          console.log('error ' , error)
      })
  }
    //console.log(this.state.textEmail);
    //console.log(this.state.textPassword);
  }
  
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={fontsize = 50}></Text>
        </View>
        <View>
          <TextInput
            placeholder="Enter Email"
            style={{ padding: 10, marginTop: 100, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({textEmail:text})}
          />
        </View>
        <View>
          <TextInput
            placeholder="Enter Password"
            style={{ padding: 10, marginTop: 20, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({textPassword:text})}
          />
        </View>
        <View>
          <TextInput
            placeholder="Enter Phone Number"
            style={{ padding: 10, marginTop: 20, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({textPhoneNumber:text})}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{marginTop: 20, marginLeft: 30, marginRight: 30,justifyContent: 'center', alignItems: 'center',}}
            onPress={() => this.onPressMakeAccount()}
          >
            <Text style={{color: 'purple'}}>MAKE AN ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
  },
});
