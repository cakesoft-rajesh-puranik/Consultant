import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import firebase from "firebase";
import DatePicker from "react-native-datepicker";
import CustomProgressBar from "../components/progressBar";

export default class MakeAppointment extends React.Component {
  static navigationOptions = {
    title: "Make Appointment",
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
      slot: [],
      id: this.props.navigation.state.params.id,
      selectedDate: "",
      isProgressBar: false
    };
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    this.setState({
      selectedDate: day
    });
  }

  componentWillMount() {}

  getData = async () => {
    for(var i = this.state.slot.length;i>0;i--){
      this.state.slot.pop()
    }
    this.setState({slot:[]})
    console.log("cleared "+this.state.slot);
    this.setState({ isProgressBar: true });
    console.log(this.state.date);
    this.getAppointments(this.state.date);
  };

  getAppointments = async date => {
    await firebase
      .database()
      .ref("consultants/" + this.state.id)
      .child("availabilities")
      .child(date)
      .on("child_added", snapshot => {
        var childKey = snapshot.key;
        var childData = snapshot.val();
        childData.key = childKey;
        console.log(childData.key);
        console.log(childData.timeSlot);
        const obj = { key: childData.timeSlot, id: childData.key };
        const newArray = this.state.slot.slice(); // Create a copy
        newArray.push(obj); // Push the object
        this.setState({ slot: newArray });
        console.log("List "+this.state.slot);
        this.setState({ isProgressBar: false });
      });
  };

  onPressCell = async item => {
    this.setState({ isProgressBar: true });
    console.log("item " + item.id);
    Alert.alert(
      "Alert",
      "Booked Appointment",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );

    this.addAppointmentData(this.state.id, item);

    await firebase
      .database()
      .ref("consultants/" + this.state.id)
      .child("availabilities")
      .child(this.state.date)
      .child(item.id)
      .remove();
    this.getAppointments();
    this.setState({ isProgressBar: false });
  };

  addAppointmentData = async (consultant_id, item) => {
    var userId = await AsyncStorage.getItem("userID");
    console.log(userId);
    console.log(consultant_id);
    await firebase
      .database()
      .ref("bookedAppointment")
      .child(consultant_id)
      .child("Student")
      .child(userId)
      .child(this.state.date)
      .push({
        timeSlot: item.key
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <CustomProgressBar visible={this.state.isProgressBar} />
        </View>
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

        <TouchableOpacity onPress={() => this.getData()}>
          <Text style={{ marginTop: 20, color: "purple" }}>Get</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.slot}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressCell(item)}>
              <Text style={styles.item}>{item.key}</Text>
            </TouchableOpacity>
          )}
        />
        <Text style={{ marginBottom: 20, color: "purple" }}>
          On Tap of Time Appointment will be booked
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    alignItems: "center"
  }
});
