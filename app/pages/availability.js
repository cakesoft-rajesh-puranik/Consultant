import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Button,
  BackHandler,
  AppState,
  Dimensions
} from "react-native";
import DatePicker from "react-native-datepicker";
import CustomProgressBar from "../components/progressBar";
import MultiSelect from "react-native-multiple-select";
import firebase from "firebase";
var deviceHeight = Dimensions.get("window").height;

export default class Availability extends Component {
  static navigationOptions = {
    title: "Availability",
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
    this.state = {
      selectedItems: [],
      selectedItemsValue: [],
      selectedDate: "",
      status: true,
      isProgressBar: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  componentDidMount() {
    console.log("In componentDidMount");
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.backHandler.remove();
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      this.checkLoginAuth();
    }
    this.setState({ appState: nextAppState });
  };

  handleBackButtonClick() {
    this.props.navigation.state.params.updateData(this.state.status);
    this.props.navigation.goBack();
    return true;
  }

  checkLoginAuth = async () => {
    const userId = await AsyncStorage.getItem("userID");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userId ? "App" : "Auth");
  };

  onDayPress(day) {
    this.setState({
      selectedDate: day
    });
    //this.props.navigation.navigate('Slot', { bookingDate : day })
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  onPressAddAppointment = async () => {
    var consultant = firebase.auth().currentUser;
    console.log(consultant.uid);
    console.log(this.state.date);
    console.log(this.state.selectedItems);
    console.log(this.state.fixedPrice);

    for (let time of this.state.selectedItems) {
      this.setState({ isProgressBar: true });
      console.log(time);
      this.addAppointmentData(
        consultant.uid,
        this.state.date,
        time,
        this.state.fixedPrice
      );
    }
  };

  addAppointmentData(consultant_id, date, slot) {
    firebase
      .database()
      .ref("consultants")
      .child(consultant_id)
      .child("availabilities")
      .child(date)
      .push({
        timeSlot: slot
      });
    this.setState({ isProgressBar: false });
    this.props.navigation.navigate("Profile");
  }

  items = [
    {
      id: "09:00am to 10:00am",
      value: "09:00am to 10:00am"
    },
    {
      id: "10:00am to 11:00am",
      value: "10:00am to 11:00am"
    },
    {
      id: "11:00am to 12:00pm",
      value: "11:00am to 12:00pm"
    },
    {
      id: "12:00am to 01:00pm",
      value: "12:00am to 01:00pm"
    },
    {
      id: "01:00pm to 02:00pm",
      value: "01:00pm to 02:00pm"
    },
    {
      id: "04:00pm to 05:00pm",
      value: "04:00pm to 05:00pm"
    },
    {
      id: "05:00am to 06:00am",
      value: "05:00am to 06:00am"
    },
    {
      id: "06:00pm to 07:00pm",
      value: "06:00pm to 07:00pm"
    },
    {
      id: "07:00pm to 08:00pm",
      value: "07:00pm to 08:00pm"
    },
    {
      id: "8:00apm to 09:00pm",
      value: "8:00apm to 09:00pm"
    },
    {
      id: "09:00pm to 10:00pm",
      value: "09:00pm to 10:00pm"
    }
  ];

  render() {
    const { selectedItems } = this.state;
    return (
      <View style={styles.container}>
        <CustomProgressBar visible={this.state.isProgressBar} />
        <Text style={(fontsize = 50)} />
        <StatusBar barStyle="light-content" />
        <View style={{ margin: 5 }}>
          <DatePicker
            date={this.state.date}
            showIcon={true}
            placeholder="Select Date"
            mode="date"
            format="DD-MM-YYYY"
            customStyles={{
              dateInput: {
                borderWidth: 0,
                height: 50,
                width: 300
              },
              dateText: {
                marginTop: 5,
                color: "black",
                fontSize: 18
              },
              placeholderText: {
                marginTop: 5,
                right: 10,
                color: "black",
                fontSize: 18
              }
            }}
            onDateChange={date => {
              this.props.onDateChange && this.props.onDateChange(date);
              this.setState({ date });
            }}
            placeholderTextColor="white"
            underlineColorAndroid={"rgba(0,0,0,0)"}
            style={{
              height: 50,
              width: 300,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 15,
              borderRadius: 4,
              borderColor: "gray"
            }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 25, marginRight: 25 }}>
          <MultiSelect
            hideTags
            items={this.items}
            uniqueKey="id"
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Pick Time Slot"
            searchInputPlaceholderText="Search Time Slot"
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="value"
            searchInputStyle={{ color: "#CCC" }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            hideSubmitButton={true}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.onPressAddAppointment()}
        >
          <Text style={{ color: "#FFF" }}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 350
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
  rootView: {
    height: deviceHeight / 2
  }
});
