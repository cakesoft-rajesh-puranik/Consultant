import React from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';

export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      textEmail: '',
      textPassword: '',
      textPhoneNumber: ''
    }
  }

  onPressMakeAccount = async () => {
    console.log(this.state.textEmail);
    console.log(this.state.textPassword);
  }
  
  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={fontsize = 50}>Sign Up</Text>
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
