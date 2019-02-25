import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Image
} from "react-native";
import firebase from "firebase";
import DatePicker from "react-native-datepicker";
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

  componentWillMount() {
    this.getData();
  }

  startChat = async () => {
    await AsyncStorage.setItem("consultantId", this.state.id);
    this.props.navigation.navigate("Conversation");
  };

  getData = async () => {
    // for(var i = this.state.slot.length;i>0;i--){
    //   this.state.slot.pop()
    // }
    // console.log("cleared "+this.state.slot);
    this.setState({ isProgressBar: true });
    //console.log(this.state.date);
    this.getAppointments(this.state.date);
  };

  getAppointments = async()=> {
    await firebase
      .database()
      .ref("consultants/" + this.state.id)
      .child("availabilities")
      .on("value", snapshot => {
        console.log("GetApt " + snapshot);
        if (snapshot.exists()) {
          snapshot.forEach(element => {
            //console.log("element "+element.val());
            //var key = element.key;
            //console.log("element "+timeSlot);
            console.log("element " + element.key);
            //const obj = { title: element.key };
            element.forEach(item => {
              var val = item.val();
              var timeSlot = val.timeSlot;
              console.log(timeSlot);
              const time = { date: element.key, time: timeSlot, id: item.key };
              const mainArray = this.state.slot.slice(); // Create a copy
              mainArray.push(time); // Push the object
              console.log(mainArray);
              this.setState({ slot: mainArray });
              //console.log("List "+this.state.slot);
              //this.setState({ isProgressBar: false });
            });
            this.setState({ isProgressBar: false });
          });
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
  };

  //TODO for SectionList
  Data = async () => {
    var date;
    var slotArray = [];
    var tempArray = [];
    var time; 
    var obj;
    this.state.slot.forEach(item => {   
      if(slotArray.length === 0){
      time = { timeSlot: item.timeSlot };
      tempArray = slotArray.slice();
      tempArray.push(time);
      obj = { title: item.title, data: tempArray };
      slotArray.push(obj);
      console.log(slotArray);
      }else{
      }      
    });
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

        <FlatList
          data={this.state.slot}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.onPressCell(item)}
              style={{ alignSelf: "stretch" }}
            >
              <CustomRowMakeApt 
              date={item.date}
              time={item.time}
               />
            </TouchableOpacity>
          )}
        />

        {/* <SectionList
       renderSectionHeader={ ({section}) => <Text style={styles.SectionHeader}> { section.title } </Text> }
       renderItem={ ({item}) => <Text style={styles.SectionListItemS} onPress={this.GetSectionListItem.bind(this, item)}> { item } </Text> }
       keyExtractor={ (item, index) => index }
      /> */}

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
  }
});
