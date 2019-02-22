import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableHighlight,
  Keyboard,
  AsyncStorage
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AutogrowInput from "react-native-autogrow-input";
import firebase from "firebase";

export default class Conversation extends Component {
  constructor(props) {
    super(props);

    var messages = [];

    this.state = {
      messages: messages,
      inputBarText: ""
    };

    this.getConversation();
  }

  getConversation = async () => {
    var userId = await AsyncStorage.getItem("userID");
    var messages = [];
    await firebase
      .database()
      .ref("messages")
      .on("child_added", snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
          _id,
          timestamp,
          text,
          user
        };
        // console.log(message.text);
        console.log(message);
        // console.log(userId);
        if (message.user._id === userId) {
          messages.push({
            direction: "right",
            text: message.text
          });
        } else {
          messages.push({
            direction: "left",
            text: message.text
          });
        }
        this.setState({ messages: messages });
      });
  };

  static navigationOptions = {
    title: "Conversation",
    headerStyle: {
      backgroundColor: "#1f43bd"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow(e) {
    this.scrollView.scrollToEnd();
  }

  keyboardDidHide(e) {
    this.scrollView.scrollToEnd();
  }

  componentDidMount() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  componentDidUpdate() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  get getUser() {
    return {
      name: "Ashish",
      _id: (firebase.auth().currentUser || {}).uid
    };
  }

  _sendMessage = async () => {
    //this.state.messages.push({direction: "right", text: this.state.inputBarText});
    const text = this.state.inputBarText;
    const timestamp = await this.timestamp();
    const user = this.getUser;
    const message = {
      text,
      user,
      timestamp
    };
    await firebase
      .database()
      .ref("messages")
      .push(message);
    this.setState({
      //messages: this.state.messages,
      inputBarText: ""
    });
  };

  timestamp() {
    var time;
    var timestamp = firebase.database().ref("message");
    timestamp.set(firebase.database.ServerValue.TIMESTAMP);
    timestamp.once("value", function(snap) {
      console.log(snap.val());
      time = snap.val();
    });
    return time;
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text
    });
  }

  _onInputSizeChange() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd({ animated: false });
      }.bind(this)
    );
  }

  render() {
    var messages = [];

    this.state.messages.forEach(function(message, index) {
      messages.push(
        <Bubble key={index} direction={message.direction} text={message.text} />
      );
    });

    return (
      <View style={styles.outer}>
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            flexDirection: "column"
          }}
        >
          {messages}
        </ScrollView>
        <InputBar
          onSendPressed={() => this._sendMessage()}
          onSizeChange={() => this._onInputSizeChange()}
          onChangeText={text => this._onChangeInputBarText(text)}
          text={this.state.inputBarText}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}

class Bubble extends Component {
  render() {
    var leftSpacer =
      this.props.direction === "left" ? null : <View style={{ width: 70 }} />;
    var rightSpacer =
      this.props.direction === "left" ? <View style={{ width: 70 }} /> : null;

    var bubbleStyles =
      this.props.direction === "left"
        ? [styles.messageBubble, styles.messageBubbleLeft]
        : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle =
      this.props.direction === "left"
        ? styles.messageBubbleTextLeft
        : styles.messageBubbleTextRight;

    return (
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}

class InputBar extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.text === "") {
      this.autogrowInput.resetInputText();
    }
  }

  render() {
    return (
      <View style={styles.inputBar}>
        <AutogrowInput
          style={styles.textBox}
          ref={ref => {
            this.autogrowInput = ref;
          }}
          multiline={true}
          defaultHeight={30}
          onChangeText={text => this.props.onChangeText(text)}
          onContentSizeChange={this.props.onSizeChange}
          value={this.props.text}
        />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => this.props.onSendPressed()}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white"
  },

  messages: {
    flex: 1
  },

  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 3
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: "#66db30"
  },

  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: "#d5d8d4"
  },

  messageBubbleTextLeft: {
    color: "black"
  },

  messageBubbleRight: {
    backgroundColor: "#66db30"
  },

  messageBubbleTextRight: {
    color: "white"
  }
});
