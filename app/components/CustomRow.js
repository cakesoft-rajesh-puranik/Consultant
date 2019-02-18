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
    email: {
        fontSize: 16,
        color: '#000',
        marginTop: 5
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    PhoneNumber: {
        fontSize: 16,
        color: 'purple',
    },
});

const CustomRow = ({ email, PhoneNumber, Price }) => (
    <View style={styles.container}>
        <View style={styles.container_text}>
            <Text style={styles.email}>
                Email:
            </Text>
            <Text style={styles.PhoneNumber}>
                {email}
            </Text>
            <Text style={styles.email}>
                PhoneNumber:
            </Text>
            <Text style={styles.PhoneNumber}>
                {PhoneNumber}
            </Text>
            <Text style={styles.email}>
                Price:
            </Text>
            <Text style={styles.PhoneNumber}>
                {Price}
            </Text>
        </View>

    </View>
);

export default CustomRow;

