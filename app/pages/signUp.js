import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import SignIn from './signIn'
import CustomProgressBar from '../components/progressBar';

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
      textPortal: '',
      price: '100',
      isProgressBar: false
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
        this.showAlertDialog('Email Verification',
          "We've sent a user verification email. Please click the link in your email inbox to be verified as a user");
      })
      .catch(error => {
        // Error occurred. Inspect error.code.
        var errorMessage = error.message;
        this.showAlertDialog('Alert', errorMessage);
      });
  }

  completeSignUp = async () => {
    console.log(this.state.textPortal);
    this.verifyEmail();
    var user = firebase.auth().currentUser;
    firebase.database().ref('users').child(user.uid).child('PhoneNumber').set(this.state.textPhoneNumber);
    firebase.database().ref('users').child(user.uid).child('email').set(this.state.textEmail);
    firebase.database().ref('users').child(user.uid).child('portal').set(this.state.textPortal);
    firebase.database().ref('users').child(user.uid).child('price').set(this.state.price);
  }

  componentDidMount() {
    console.disableYellowBox = true;
  }

  onPressMakeAccount = async () => {
    console.log(this.state.textEmail);
    console.log(this.state.textPassword);
    this.setState({ isProgressBar: true });
    await firebase.auth().createUserWithEmailAndPassword(this.state.textEmail, this.state.textPassword)
      .then(this.completeSignUp)
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          this.showAlertDialog('Alert', 'The password is too weak.');
        } else if (errorCode == 'auth/email-already-in-use') {
          this.showAlertDialog('Alert', 'This email already has an account');
        } else if (errorCode == 'auth/invalid-email') {
          this.showAlertDialog('Alert', 'Please enter a valid email');
        } else {
          this.showAlertDialog('Alert', errorMessage);
        }
        //console.log(error);
      });
  }

  showAlertDialog(alertStr, messageStr) {
    Alert.alert(
      alertStr,
      messageStr, [
        {
          text: "OK",
          onPress: () => {
            this.setState(() => ({
              isProgressBar: false
            }));
          }
        }
      ],
      { cancelable: false });
  }

  onPressSignIn = async () => {
    console.log('Signin');
    this.props.navigation.navigate('SignIn');
  }

  render() {
    const { checked } = this.state;
    return (
      <View>
        <View style={styles.container}>
          <CustomProgressBar visible={this.state.isProgressBar}></CustomProgressBar>
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

          <RadioGroup style={{
            flexDirection: "row", marginTop: 20, marginLeft: 30, marginRight: 30, justifyContent: "space-around"
          }}
            onSelect={(index, value) => this.onSelect(index, value)}
          >
            <RadioButton value={'Student'}>
              <Text>Student</Text>
            </RadioButton>

            <RadioButton value={'Consultant'}>
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
          <TouchableOpacity
            style={{ marginTop: 20, marginLeft: 30, marginRight: 30, justifyContent: 'center', alignItems: 'center', }}
            onPress={() => this.onPressSignIn()}
          >
            <Text style={{ color: 'purple' }}>SIGN IN</Text>
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
