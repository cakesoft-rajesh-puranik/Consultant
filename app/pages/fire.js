import firebase from 'firebase'; // 4.8.1
import {AsyncStorage} from 'react-native';


class Fire {
  constructor() {
  }

  get uid() {
     console.log((firebase.auth().currentUser || {}).uid); 
    return (firebase.auth().currentUser || {}).uid;
  }

  consultantId = async () => {
    var consultantId = await AsyncStorage.getItem('consultantId');
    console.log("consultantId");
    console.log(consultantId);
    return consultantId;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
