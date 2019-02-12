import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,AsyncStorage } from 'react-native';
import firebase from 'firebase';


export default class Profile extends React.Component {

    static navigationOptions = {
        title: 'Profile',
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    constructor(props) {
        super(props)
        this.state = {
            textEmail: " ",
            textPortal: " ",
            textPhoneNumber: " "
        }
    }

    componentDidMount() {
       this.getUser();
       console.disableYellowBox = true;
    }

    getUser = async () => {
        var userId = await AsyncStorage.getItem('userID');
        await firebase.database().ref('users/'+userId).once('value').then(value => {
            console.log(value.val())
            console.log(value.val()['email'])
            this.setState({textEmail:value.val()['email'],textPortal:value.val()['portal'],textPhoneNumber:value.val()['PhoneNumber']})
        });
    }

    onPressAppointment = async() => {
        this.props.navigation.navigate('Appointment');
    }

    render() {
        return (
            <View style={styles.container}>
                    <View style={{ marginRight: 10 }}><Text style={fontsize = 50}>Email:</Text></View>
                    <View><Text style={{color:'red'}}>{this.state.textEmail}</Text></View>
                    <View style={{ marginRight: 10,marginTop:20 }}><Text style={fontsize = 50}>Phone Number:</Text></View>
                    <View><Text style={{color:'red'}}>{this.state.textPhoneNumber}</Text></View>
                    <View style={{ marginRight: 10,marginTop:20 }}><Text style={fontsize = 50}>Portal:</Text></View>
                    <View><Text style={{color:'red'}}>{this.state.textPortal}</Text></View>

                    <TouchableOpacity
                        style={{ marginTop: 20, marginLeft: 30, marginRight: 30, justifyContent: 'center', alignItems: 'center', }}
                        onPress={() => this.onPressAppointment()}
                    >
                    <Text style={{ color: 'purple' }}>Book Appointment</Text>
                    </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginTop: 30,
      marginRight: 10 
    },
});