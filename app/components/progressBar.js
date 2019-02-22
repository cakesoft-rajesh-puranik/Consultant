
import React, { Component } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";

const CustomProgressBar = ({ visible }) => (
    <Modal transparent={true} animationType={"none"} visible={visible}>
        <View
            style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, .5)",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <View style={{ borderRadius: 10, backgroundColor: "white", padding: 5 }}>
                <ActivityIndicator size="large" />
            </View>
        </View>
    </Modal>
);

export default CustomProgressBar;
