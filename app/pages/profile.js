import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import firebase from "firebase";
import CustomProgressBar from "../components/progressBar";

export default class Profile extends React.Component {
  static navigationOptions = {
    title: "Profile",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      textEmail: " ",
      textPortal: " ",
      textPhoneNumber: " ",
      textPrice: " ",
      availabilityORAppointment: "",
      isProgressBar: false,
      isPriceVisible: true
    };
  }

  componentDidMount() {
    this.setState({ isProgressBar: true });
    this.getUser();
    console.disableYellowBox = true;
  }

  getUser = async () => {
    var userId = await AsyncStorage.getItem("userID");
    await firebase
      .database()
      .ref("users/" + userId)
      .once("value")
      .then(value => {
        var portal = value.val()["portal"];
        this.setState({
          isProgressBar: false,
          textEmail: value.val()["email"],
          textPortal: value.val()["portal"],
          textPhoneNumber: value.val()["PhoneNumber"],
          textPrice: value.val()["price"],
          availabilityORAppointment:
            portal === "Consultant" ? "Availability" : "Book Appointment"
        });
        if (portal === "Student") {
          console.log("check studet " + portal);
          this.setState({ isPriceVisible: false });
        } else {
          console.log("check " + portal);
          this.setState({ isPriceVisible: true });
        }
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        Alert.alert(
          "Alert",
          errorMessage,
          [
            {
              text: "OK",
              onPress: () => {
                this.setState(() => ({
                  isProgressBar: false
                }));
              }
            }
          ],
          { cancelable: false }
        );
        //console.log(error);
      });
  };

  onPressAppointment = async () => {
    this.state.availabilityORAppointment === "Availability"
      ? this.props.navigation.navigate("Availability")
      : this.props.navigation.navigate("Appointment");
  };

  startChat() {
    this.props.navigation.navigate("Conversation");
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomProgressBar visible={this.state.isProgressBar} />
        <View style={styles.editTextLabel}>
          <View style={{ marginRight: 10 }}>
            <Text style={(fontsize = 50)}>Email:</Text>
          </View>
          <View>
            <Text style={{ color: "red" }}>{this.state.textEmail}</Text>
          </View>
        </View>
        <View style={styles.editTextLabel}>
          <View style={{ marginRight: 10, marginTop: 20 }}>
            <Text style={(fontsize = 50)}>Phone Number:</Text>
          </View>
          <View>
            <Text style={{ color: "red", marginRight: 10, marginTop: 20 }}>
              {this.state.textPhoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.editTextLabel}>
          <View style={{ marginRight: 10, marginTop: 20 }}>
            <Text style={(fontsize = 50)}>Portal:</Text>
          </View>
          <View>
            <Text style={{ color: "red", marginRight: 10, marginTop: 20 }}>
              {this.state.textPortal}
            </Text>
          </View>
        </View>
        <View style={styles.editTextLabel}>
          <View style={{ marginRight: 10, marginTop: 20 }}>
            {this.state.isPriceVisible ? (
              <Text style={(fontsize = 50)}>Price:</Text>
            ) : (
              <Text style={(fontsize = 50)} />
            )}
          </View>
          <View>
            {this.state.isPriceVisible ? (
              <Text style={{ color: "red", marginRight: 10, marginTop: 20 }}>
                {this.state.textPrice}
              </Text>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch"
          }}
          onPress={() => this.onPressAppointment()}
        >
          <Text style={{ color: "purple" }}>
            {this.state.availabilityORAppointment}
          </Text>
        </TouchableOpacity>
        {this.state.isPriceVisible ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "stretch"
            }}
            onPress={() => this.startChat()}
          >
            <Text style={{ color: "purple" }}>Chat</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 30,
    marginRight: 10
  },
  editTextLabel: {
    flexDirection: "row"
  }
});
