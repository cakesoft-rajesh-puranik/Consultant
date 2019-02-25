import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  Image,
  ScrollView,
  BackHandler,
  AppState
} from "react-native";
import firebase from "firebase";
import CustomProgressBar from "../components/progressBar";
import { TextField } from "react-native-material-textfield";

export default class Profile extends React.Component {
  static navigationOptions = {
    title: "Profile",
    headerStyle: {
      backgroundColor: "#1f43bd"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    console.log("In constructor");
    this.state = {
      textEmail: " ",
      textPortal: " ",
      textPhoneNumber: " ",
      textPrice: " ",
      availabilityORAppointment: "",
      isProgressBar: false,
      isPriceVisible: true,
      backHandler: " ",
      appState: AppState.currentState,
      dataSend: true
    };
  }

  componentDidMount() {
    console.log("In componentDidMount");
    this.setState({ isProgressBar: true });
    this.getUser();
    console.disableYellowBox = true;
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.backHandler.remove(); // = BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      this.checkLoginAuth();
    }
    this.setState({ appState: nextAppState });
  };

  checkLoginAuth = async () => {
    const userId = await AsyncStorage.getItem("userID");
    console.log("userId");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userId ? "App" : "Auth");
  };

  handleBackButtonClick() {
    Alert.alert(
      "Exit App",
      "Exiting the application?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            BackHandler.exitApp(), this.removeItemValue("userID");
          }
        }
      ],
      { cancelable: false }
    );
    return true;
  }

  updateData = dataSend => {
    console.log(dataSend);
    console.log("come back status: " + dataSend);
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  };

  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  }

  Logout = async()=>{
    await firebase.auth().signOut();  
    this.props.navigation.navigate("SignIn");
  }

  getUser = async () => {
    console.log("In getUser");
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
      ? this.props.navigation.navigate("Availability", {
          name: "from parent",
          updateData: this.updateData
        })
      : this.props.navigation.navigate("Appointment");
  };

  startChat() {
    this.props.navigation.navigate("Conversation");
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <CustomProgressBar visible={this.state.isProgressBar} />
          <View style={styles.header}>
            <Image
              style={styles.avatar}
              source={{
                uri: "https://bootdey.com/img/Content/avatar/avatar6.png"
              }}
            />
            <Text style={styles.name}>John Doe</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.textFieldContainer}>
              <TextField
                keyboardType="email-address"
                label="Email"
                value={this.state.textEmail}
                editable={false}
              />

              <TextField
                keyboardType="phone-pad"
                label="Phone Number"
                value={this.state.textPhoneNumber}
                editable={false}
              />

              <TextField
                keyboardType="default"
                label="Portal"
                value={this.state.textPortal}
                editable={false}
              />
              {this.state.isPriceVisible ? (
                <TextField
                  keyboardType="default"
                  label="Price"
                  value={this.state.isPriceVisible}
                  editable={false}
                />
              ) : null}

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  this.backHandler.remove(), this.onPressAppointment();
                }}
              >
                <Text style={{ color: "#FFF" }}>
                  {this.state.availabilityORAppointment}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                  this.Logout();
                }}
              >
                <Text style={{ color: "#FFF" }}>
                 Logout
                </Text>
              </TouchableOpacity>

              {this.state.isPriceVisible ? (
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => this.startChat()}
                >
                  <Text style={{ color: "#FFF" }}>Chat</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          {/* {this.state.isPriceVisible ? (
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
        ) : null} */}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4285F4",
    height: 180
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10
  },
  name: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "600",
    alignSelf: "center",
    marginTop: 140
  },
  body: {
    marginTop: 20,
    margin: 20
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30
  },
  info: {
    fontSize: 16,
    color: "#4285F4",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center"
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 30,
    margin: 25,
    backgroundColor: "#4285F4"
  },
  textFieldContainer: {
    marginTop: 10
  }
});
