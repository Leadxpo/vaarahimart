// components/Error.js
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';

const Message = ({ message,type }) => {
    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={type==="Error"?styles.errorText:styles.normalText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,width:"100%"
    },
    errorText: {
        color: '#D32F2F',  // Red color for errors
        fontSize: 14,width:"100%"
    },
    normalText: {
        color: MD3Colors.primary30,  
        fontSize: 14,
    },
});

export default Message;
