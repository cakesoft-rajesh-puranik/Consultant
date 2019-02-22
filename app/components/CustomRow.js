import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 5,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 20,
        justifyContent: 'center',
    },
    Output: {
        fontSize: 15,
        color: '#1f43bd',
        marginLeft : 10,
    },
    inputIcon:{
        width:15,
        height:15,
        justifyContent: 'center',
        marginRight : 10,
      },
});

const CustomRow = ({ email, PhoneNumber, Price }) => (
    <View style={styles.container}>
    <Image
          style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}
          source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />
        <View style={styles.container_text}>
        <View style={{flexDirection : 'row',}}>
            <Text style={styles.Output}>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/material-outlined/000000/filled-message.png'}}/>
            {email}
            </Text>
        </View>
                
        <View style={{flexDirection : 'row',}}>
            <Text style={styles.Output}>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/material/000000/phone.png'}}/>
            {PhoneNumber}
            </Text>
        </View>
            
        {Price ? (<View style={{flexDirection : 'row',}}>    
            <Text style={styles.Output}>
            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/material/000000/rupee.png'}}/>
                {Price}
            </Text>
        </View>) : (
            null
        )}
        
        </View>
    </View>
);

export default CustomRow;

