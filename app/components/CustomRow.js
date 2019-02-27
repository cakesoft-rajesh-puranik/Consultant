import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
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
        marginLeft: 10,
        justifyContent: 'center',
    },
    OutputEmail: {
        fontSize: 18,
        color: '#000',
        marginLeft : 10,
        marginBottom : 10,
    },
    OutputPhone: {
        fontSize: 14,
        color: '#838383',
        marginLeft : 10,
        marginBottom : 10,
    },
    OutputPrice: {
        fontSize: 18,
        color: '#1f43bd',
        marginLeft : 10,
        marginBottom : 10,
    },
    inputIconPrice:{
        width:15,
        height:15,
        tintColor: '#1f43bd',
        justifyContent: 'center',
        marginRight : 10,
      },
      inputIconPhone:{
        width:15,
        height:15,
        tintColor: '#838383',
        justifyContent: 'center',
        marginRight : 10,
      },
});

const CustomRow = ({ email, PhoneNumber, Price }) => (
    <View style={styles.container}>
    <Image
          style={{width: 100 ,justifyContent: 'center', alignItems: 'center'}}
          source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
        />
        <View style={styles.container_text}>
        <View style={{flexDirection : 'row',}}>
            <Text style={styles.OutputEmail}>
            {email}
            </Text>
        </View>
                
        <View style={{flexDirection : 'row',}}>
            <Text style={styles.OutputPhone}>
            <Image style={styles.inputIconPhone} source={{uri: 'https://img.icons8.com/material/000000/phone.png'}}/>
            {PhoneNumber}
            </Text>
        </View>
            
        {Price ? (<View style={{flexDirection : 'row',}}>    
            <Text style={styles.OutputPrice}>
            <Image style={styles.inputIconPrice} source={{uri: 'https://img.icons8.com/material/000000/rupee.png'}}/>
                {Price}
            </Text>
        </View>) : (
            null
        )}
        
        </View>
    </View>
);

export default CustomRow;

