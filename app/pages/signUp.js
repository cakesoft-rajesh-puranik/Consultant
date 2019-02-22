import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight, Alert, ScrollView, TextInput } from 'react-native';
import firebase from 'firebase';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import SignIn from './signIn'
import CustomProgressBar from '../components/progressBar';
import { TextField } from 'react-native-material-textfield';

export default class SignUp extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      textEmail: '',
      textPassword: '',
      textPhoneNumber: '',
      textPortal: '',
      price: '100',
      isProgressBar: false,
      verificationMailSent: false,
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
        this.setState({ verificationMailSent: true });
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
            if(this.state.verificationMailSent === true){
             this.onPressSignIn() 
            }
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
      <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='handled'
    >
  <View style={styles.container}>
      <CustomProgressBar visible={this.state.isProgressBar}></CustomProgressBar>
      <Text style={fontsize = 50}></Text>
      {/* <Image source= {require('./../components/images/reactimg.png')}  style = {{height: 200, width: 250, resizeMode : 'stretch'}} /> */}
    <View style={styles.inputContainer}>
      <TextInput style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid='transparent'
          onChangeText={(text) => this.setState({ textEmail: text })}/>
    </View>
    
    <View style={styles.inputContainer}>
      <TextInput style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          underlineColorAndroid='transparent'
          onChangeText={(text) => this.setState({ textPassword: text })}/>
    </View>

    <View style={styles.inputContainer}>
      <TextInput style={styles.inputs}
          placeholder="Phone number"
          keyboardType="Number"
          underlineColorAndroid='transparent'
          onChangeText={(text) => this.setState({ textPhoneNumber: text })} />
    </View>

    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onPressMakeAccount()}>
      <Text style={styles.loginText}>Sign up</Text>
    </TouchableHighlight>

    <RadioGroup style={{
             flexDirection: "row", marginLeft: 30, marginRight: 30, justifyContent: "space-around"
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
      
      <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center', }} onPress={() => this.onPressSignIn()}>
          <Text style={{ color: '#1f43bd' }}>Already a member? Sign in now!</Text>
      </TouchableOpacity>
  </View>
  </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aec1ff',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:5,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      marginRight:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  logo: {
    position: 'absolute',
    width: 300,
    height: 100
},
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:250,
    borderRadius:5,
  },
  loginButton: {
    backgroundColor: "#1f43bd",
  },
  loginText: {
    color: 'white',
  }
});

