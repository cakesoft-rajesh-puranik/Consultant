import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

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
      textPhoneNumber: '',
      textPortal:'',
    }
  }

  onSelect(index, value) {
    this.setState({
      textPortal: value
    })
  }

  verifyEmail = async () => {
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        // Verification email sent.
        console.log("email Verification sent");
        Alert.alert(
          'Email Verification',
          "We've sent a user verification email. Please click the link in your email inbox to be verified as a user",
          { cancelable: false }
        )
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
      });
  }

  completeSignUp = async () => {
    console.log(this.state.textPortal);
    this.verifyEmail();
    var user = firebase.auth().currentUser;
    firebase.database().ref('users').child(user.uid).child('PhoneNumber').set(this.state.textPhoneNumber);
    firebase.database().ref('users').child(user.uid).child('email').set(this.state.textEmail);
    firebase.database().ref('users').child(user.uid).child('portal').set(this.state.textPortal);
  }


  onPressMakeAccount = async () => {
    console.log(this.state.textEmail);
    console.log(this.state.textPassword);
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
  }

  render() {
    const { checked } = this.state;
    return (
      <View>
        <View style={styles.container}>
          <Text style={fontsize = 50}></Text>
        </View>
        <View>
          <TextInput
            placeholder="Enter Email"
            style={{ padding: 10, marginTop: 40, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({ textEmail: text })}
          />
        </View>
        <View>
          <TextInput
            placeholder="Enter Password"
            style={{ padding: 10, marginTop: 20, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({ textPassword: text })}
          />
        </View>
        <View>
          <TextInput
            placeholder="Enter Phone Number"
            style={{ padding: 10, marginTop: 20, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({ textPhoneNumber: text })}
          />
        </View>
        <View>
          {/* <View style={styles.container}> */}

            <RadioGroup
              onSelect={(index, value) => this.onSelect(index, value)}
            >
              <RadioButton value={'Student'} style={{marginTop: 20,justifyContent: 'center', alignItems: 'center'}}>
                <Text>Student</Text>
              </RadioButton>

              <RadioButton value={'Consultant'} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text>Consultant</Text>
              </RadioButton>
            </RadioGroup>
          {/* </View> */}
          <TouchableOpacity
            style={{ marginTop: 20, marginLeft: 30, marginRight: 30, justifyContent: 'center', alignItems: 'center', }}
            onPress={() => this.onPressMakeAccount()}
          >
            <Text style={{ color: 'purple' }}>MAKE AN ACCOUNT</Text>
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
