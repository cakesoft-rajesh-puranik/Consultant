import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Button
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {Calendar} from 'react-native-calendars';
import MultiSelect from 'react-native-multiple-select';
import firebase from 'firebase';

export default class Appointment extends Component {
  static navigationOptions = {
    title: 'Appointment',
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
      selectedItems : [],
      selectedItemsValue : [],
      selectedDate : '',
      fixedPrice : '100',
    };
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    this.setState({
      selectedDate: day
    });
    //this.props.navigation.navigate('Slot', { bookingDate : day })
  }

  _onPressBack(){
    const {goBack} = this.props.navigation
      goBack()
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  }

  

  onPressAddAppointment = async () => {
    var consultant = firebase.auth().currentUser;
    console.log(consultant.uid);
    console.log(this.state.date);
    console.log(this.state.selectedItems);
    console.log(this.state.fixedPrice);
    this.addAppointmentData(consultant.uid, this.state.date, this.state.selectedItems, this.state.fixedPrice)
  }

  addAppointmentData(consultant_id, date, selected_items, fixed_price){
      firebase.database().ref('Appointment').push({
        consultant_id,
        date,
        selected_items,
        fixed_price
    }).then(()=>{
        this.props.navigation.navigate('Profile');
    }).catch((error)=>{
       var errorMessage = error.message;
        alert(errorMessage);
        console.log('error ' , error)
    })
    
  }
  
  items  = [{
    id: '1',
    value: '09:00am to 10:00am',
  }, {
    id: '2',
    value: '10:00am to 11:00am',
  }, {
    id: '3',
    value: '11:00am to 12:00pm',
  }, {
    id: '4',
    value: '12:00am to 01:00pm',
  },{
    id: '5',
    value: '01:00pm to 02:00pm',
  },{
    id: '6',
    value: '04:00pm to 05:00pm',
  },{
    id: '7',
    value: '05:00am to 06:00am',
  },{
    id: '8',
    value: '06:00pm to 07:00pm',
  },{
    id: '9',
    value: '07:00pm to 08:00pm',
  },{
    id: '10',
    value: '8:00apm to 09:00pm',
  },{
    id: '11',
    value: '09:00pm to 10:00pm',
  },];

  render() {
    const { selectedItems } = this.state;
    return (
      <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={{ margin: 5 }}>
            <DatePicker date={this.state.date} showIcon={true} placeholder="Select Date" mode="date" format="DD-MM-YYYY"
              customStyles={{
                dateInput: {
                  borderWidth: 0,
                  height: 50,
                  width: 300,
                },
                dateText: {
                  marginTop: 5,
                  color: 'black',
                  fontSize: 18,
                },
                placeholderText: {
                  marginTop: 5,
                  right: 10,
                  color: 'black',
                  fontSize: 18,
                }
              }
              }
              onDateChange={(date) => { this.props.onDateChange && this.props.onDateChange(date); this.setState({ date });}} placeholderTextColor="white" underlineColorAndroid={'rgba(0,0,0,0)'} style={{ height: 50,width: 300, justifyContent: 'center', alignItems: 'center', paddingLeft: 15, borderRadius: 4, borderColor: 'gray', }}></DatePicker>
          </View>
          <MultiSelect
          hideTags
          items={this.items}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Time Slot"
          searchInputPlaceholderText="Search Time Slot"
          onChangeInput={ (text)=> console.log(text)}      
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="value"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <Button
          onPress={() => this.onPressAddAppointment()}
          title="Add Appointment"
          color="#4285F4"
        />
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
    borderColor: '#eee',
    height: 350
  }
});