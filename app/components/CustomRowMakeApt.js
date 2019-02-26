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
    time: {
        fontSize: 16,
        color: '#000',
        marginTop: 5,
    },
});

const CustomRowMakeApt = ({ time }) => (
    <View style={styles.container}>
        <View style={styles.container_text}>
            <Text style={styles.email}>
                TimeSlot:
            </Text>
            <Text style={styles.PhoneNumber}>
                {time}
            </Text>
        </View>
    </View>
);

export default CustomRowMakeApt;

