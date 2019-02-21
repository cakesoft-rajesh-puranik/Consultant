import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Alert, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import Profile from './profile'
import CustomProgressBar from '../components/progressBar';

export default class SignIn extends React.Component {

  static navigationOptions = {
    title: 'SignIn',
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
      textEmail: "nilesh@mailinator.com",
      textPassword: "abcd1234",
      isProgressBar: false
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

  render() {
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
            secureTextEntry={true}
            style={{ padding: 10, marginTop: 20, marginLeft: 30, marginRight: 30, height: 40, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', }}
            onChangeText={(text) => this.setState({ textPassword: text })}
          />
        </View>
        <View>
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
