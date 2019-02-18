import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import firebase from 'firebase';
import CustomProgressBar from '../components/progressBar';


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
            textPhoneNumber: " ",
            textPrice: " ",
            availabilityORAppointment: "",
            isProgressBar: false
        }
    }

    componentDidMount() {
        this.setState({ isProgressBar: true });
        this.getUser();
        console.disableYellowBox = true;
    }

    getUser = async () => {
        var userId = await AsyncStorage.getItem('userID');
        await firebase.database().ref('users/' + userId).once('value').then(value => {
            console.log(value.val())
            console.log(value.val()['email'])
            var portal = value.val()['portal'];
            this.setState({ isProgressBar: false, textEmail: value.val()['email'], textPortal: value.val()['portal'], textPhoneNumber: value.val()['PhoneNumber'], textPrice: value.val()['price'], availabilityORAppointment: portal === "Consultant" ? "Availability" : "Book Appointment" })
        }).catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(
                "Alert",
                errorMessage, [
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
            //console.log(error);
        });
    }

    onPressAppointment = async () => {
        this.state.availabilityORAppointment === "Availability" ? this.props.navigation.navigate('Availability') : this.props.navigation.navigate('Appointment')
    }

    render() {
        return (
            <View style={styles.container}>
                <CustomProgressBar visible={this.state.isProgressBar}></CustomProgressBar>
                <View style={{ marginRight: 10 }}><Text style={fontsize = 50}>Email:</Text></View>
                <View><Text style={{ color: 'red' }}>{this.state.textEmail}</Text></View>
                <View style={{ marginRight: 10, marginTop: 20 }}><Text style={fontsize = 50}>Phone Number:</Text></View>
                <View><Text style={{ color: 'red' }}>{this.state.textPhoneNumber}</Text></View>
                <View style={{ marginRight: 10, marginTop: 20 }}><Text style={fontsize = 50}>Portal:</Text></View>
                <View><Text style={{ color: 'red' }}>{this.state.textPortal}</Text></View>
                <View style={{ marginRight: 10, marginTop: 20 }}><Text style={fontsize = 50}>Price:</Text></View>
                <View><Text style={{ color: 'red' }}>{this.state.textPrice}</Text></View>

                <TouchableOpacity
                    style={{ marginTop: 20, marginLeft: 30, marginRight: 30, justifyContent: 'center', alignItems: 'center', }}
                    onPress={() => this.onPressAppointment()}
                >
                    <Text style={{ color: 'purple' }}>{this.state.availabilityORAppointment}</Text>
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