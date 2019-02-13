import React from 'react';
import { View, FlatList, StyleSheet, Text,TouchableOpacity } from 'react-native';
import CustomRow from './CustomRow';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


onPressCell = async(item) => {
    console.log("item "+item.id);   
}

const CustomListview = ({ itemList }) => (
    <View style={styles.container}>
        <FlatList
                data={itemList}
                renderItem={({ item }) =>
                <TouchableOpacity
                onPress={() => this.onPressCell(item)}>
                 <CustomRow
                    email={item.email}
                    PhoneNumber={item.PhoneNumber}
                />
                </TouchableOpacity>
            }
            />

    </View>
);

export default CustomListview;
