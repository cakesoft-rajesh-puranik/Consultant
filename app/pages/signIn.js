import React from 'react';
import { Container, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Alert, Image, ScrollView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import Profile from './profile'
import CustomProgressBar from '../components/progressBar';
import { TextField } from 'react-native-material-textfield';

export default class SignIn extends React.Component {

  static navigationOptions = {
      header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      textEmail: "cdemo@mailinator.com",
      textPassword: "abcd1234",
      isProgressBar: false,
      emailError: null,
      passError: null,
    }
  }

  componentDidMount() {
    console.disableYellowBox = true;
  }

  onPressSignIn = async () => {
    console.log(this.state.textEmail);
    console.log(this.state.textPassword);
    this.setState({ isProgressBar: true });
    var result = await firebase.auth().signInWithEmailAndPassword(this.state.textEmail, this.state.textPassword)
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          this.showAlertDialog('Alert', 'Wrong password.');
        } else {
          this.showAlertDialog('Alert', errorMessage);
        }
        //console.log(error);
      });

    if (result) {
      console.log('result ' + result.user.uid)
      this.setState({ isProgressBar: false });
      await AsyncStorage.setItem('userID', result.user.uid);
      await AsyncStorage.setItem('email', result.user.email);
      this.props.navigation.navigate('Profile');
    }
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

  onPressSignUp = async () => {
    console.log('SignUp');
    this.props.navigation.navigate('SignUp');
  }

  checkEmail = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(text !== ""){
    if(reg.test(text) === false)
    {
    console.log("Email is Not Correct");
    this.setState(() => ({ emailError: "Please enter valid email"}));
    this.setState({textEmail: text})
    return false;
    }
    else {
      this.setState({textEmail: text})
      this.setState(() => ({ emailError: null}));
      console.log("Email is Correct");
    }
  }
  else{
    this.setState(() => ({ emailError: "Email required"}));
    return false;
  }
  }

  checkPassword = async () => {
    if (this.state.textPassword.trim() === "") {
      this.setState(() => ({ passError: "Password required"}));
      return false;
    } 
    else{
      this.setState(() => ({ passError: null}));
      return true;
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'
        >
      <View style={styles.container}>
          <CustomProgressBar visible={this.state.isProgressBar}></CustomProgressBar>
          <Text style={fontsize = 50}></Text>
          <Image
          style={{width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 30}}
          source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.checkEmail(text)}
             onBlur={() => this.checkEmail(this.state.textEmail)}
            />
        </View>
        {!!this.state.emailError && (
            <Text style={styles.errorContainer}>{this.state.emailError}</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(text) => {this.setState({ textPassword: text }), this.setState({ passError: "" })}}
          onBlur={() => this.checkPassword()}
          />
    </View>
    {!!this.state.passError && (
            <Text style={styles.errorContainer}>{this.state.passError}</Text>
    )}

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onPressSignIn()}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop : 20 }} onPress={() => this.onPressSignUp()}>
            <Text style={{ color: '#1f43bd' }}>Don't have an account? Sign up</Text>
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
  errorContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop : -5,
    marginBottom: 5,
    color: '#f30000',
    width:250,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:5,
      width:250,
      height:45,
      marginBottom:10,
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
