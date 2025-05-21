import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Checkbox } from 'react-native-paper'

export default function DeliveryVerification() {
    const [onlinePayment, setOnlinePayment] = useState(false)
    const [COD, setCOD] = useState(false)
    const [amount, setAmount] = useState(3000)
    return (
        <View style={styles.container}>
            <Checkbox.Item mode='android' status={onlinePayment ? 'checked' : 'unchecked'} color='orange' label='Online Payment' onPress={() => {
                setOnlinePayment(!onlinePayment);
                setCOD(false)
            }} />
            <Checkbox.Item mode='android' status={COD ? 'checked' : 'unchecked'} color='orange' label='Cash on Delivery' onPress={() => {
                setCOD(!COD);
                setOnlinePayment(false)

                if (COD) {
                    setShowAmt('flex')
                } else {
                    setShowAmt('none')
                }
            }} />

            <Text style={styles.header}>Cash on Delivery : {amount}</Text>
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    input: {
        width: '100%',
        borderColor: '#ddd',
        color:"#6c290f",
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // Shadow for Android
    },
    button: {
        backgroundColor: '#FF7F45',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})