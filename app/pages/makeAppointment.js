import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Image,
  SectionList
} from "react-native";
import firebase from "firebase";
import CustomProgressBar from "../components/progressBar";
import CustomRowMakeApt from "../components/CustomRowMakeApt";

export default class MakeAppointment extends React.Component {
  static navigationOptions = {
    title: "Make Appointment",
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
      slot: [],
      slots: [],
      id: this.props.navigation.state.params.id,
      isProgressBar: false
    };
  }

  componentDidMount(){
    this.getData();
  }

  startChat = async () => {
    await AsyncStorage.setItem("consultantId", this.state.id);
    this.props.navigation.navigate("Conversation");
  };

  getData = () => {
    this.setState({ isProgressBar: true });
    //console.log(this.state.date);
    this.getAppointments();
  };

  getAppointments = async () => {
    try {
      await firebase
      .database()
      .ref("consultants/" + this.state.id)
      .child("availabilities")
      .on("value", snapshot => {
        console.log(snapshot);
        if (snapshot.exists()) {
          var mainArray = [];
          snapshot.forEach(element => {
            //console.log(element.val());
            //var key = element.key;
            //console.log("element "+timeSlot);
            //console.log("element " + element.key);
            //const obj = { title: element.key };
            element.forEach(item => {
              var val = item.val();
              var timeSlot = val.timeSlot;
              //console.log(timeSlot);
              const time = { date: element.key, time: timeSlot, id: item.key };
              mainArray.push(time);
              console.log(mainArray);
            });
            this.setState({ isProgressBar: false });
          });
          this.Data(mainArray);
        } else {
          Alert.alert(
            "Alert",
            "NO TimeSlot",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
          this.setState({ isProgressBar: false });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //SectionList
  Data = async (Slot) => {
    var timeSlot = [];
    var date = [];
    var array = [];
    for (var i = 0; i < Slot.length; i++) {
      var data = Slot[i];
      //console.log(data['date'])
      date.push(data["date"]);
    }
    //console.log(date);
    var uniqueDate = Array.from(new Set(date));
    //console.log(uniqueDate);

    for (var i = 0; i < uniqueDate.length; i++) {
      var obj;
      var _date = uniqueDate[i];
      for (var j = 0; j < Slot.length; j++) {
        var data = Slot[j];
        //console.log(data['time'])
        //console.log(__date)
        if (uniqueDate[i] === data["date"]) {
          var obj = {time:data["time"],date: data["date"],id:data['id']}
          timeSlot.push(obj);
        }
      }
      obj = { date: _date,  data: timeSlot };
      array.push(obj);
      timeSlot = [];
    }
    this.setState({ slots: array });
    //console.log(array);
  };

  onPressCell = async item => {
    this.setState({ isProgressBar: true });
    console.log("item " + item.id);
    Alert.alert(
      "Alert",
      "Booked Appointment",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: false }
    );
    this.addAppointmentData(this.state.id, item);
    console.log(item.date);
    console.log(item.id);
    await firebase
      .database()
      .ref("consultants/" + this.state.id)
      .child("availabilities")
      .child(item.date)
      .child(item.id)
      .remove();
    this.getAppointments();
    this.setState({ isProgressBar: false });
  };

  addAppointmentData = async (consultant_id, item) => {
    var userId = await AsyncStorage.getItem("userID");
    //console.log(userId);
    //console.log(consultant_id);
    //console.log(item.time);
    await firebase
      .database()
      .ref("bookedAppointment")
      .child(consultant_id)
      .child("Student")
      .child(userId)
      .child(item.date)
      .push({
        timeSlot: item.time
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ marginBottom: 20, color: "purple" }}>
            On Tap of Time Appointment will be booked
          </Text>
        </View>
        <View>
          <CustomProgressBar visible={this.state.isProgressBar} />
        </View>

        <SectionList
          sections={this.state.slots}
          renderSectionHeader={({ section }) => (
            <Text style={styles.SectionHeader}> {section.date} </Text>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.onPressCell(item)}
              style={{ alignSelf: "stretch" }}
            >
              <CustomRowMakeApt time={item.time} />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.startChat()}
          style={styles.TouchableOpacityStyle}
        >
          <Image
            //We are making FAB using TouchableOpacity with an image
            //We are using online image here
            //  source={{
            //  uri:'http://aboutreact.com/wp-content/uploads/2018/08/bc72de57b000a7037294b53d34c2cbd1.png',
            // }}
            //You can use you project image Example below
            source={require("../images/chat.png")}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC"
  },

  calendarStyle: {
    flexDirection: "row",
    backgroundColor: "#FCFCFC"
  },

  TouchableOpacityStyle: {
    position: "absolute",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20
  },

  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 50,
    height: 50
    //backgroundColor:'black'
  },

  buttonContainer: {
    marginTop: 10,
    height: 45,
    //flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    //marginBottom:20,
    borderRadius: 5,
    margin: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#4285F4"
  },

  SectionHeader:{
    backgroundColor : '#1f43bd',
    fontSize : 20,
    padding: 5,
    color: '#fff',
    fontWeight: 'bold'
  }


});
