import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import store from '../../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { deliveryStafflogin } from '../../Redux/Actions/loginAction';
import { Surface } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveData } from '../../Utils/appData';

export default function DeliveryLogin({ navigation }) {
    const [staff_id, setStaff_id] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleStaffLogin = async () => {
        // Add form validation or API call here
        if (!staff_id || !password) {
            Alert.alert('Error', 'Please fill all fields');
        } else {
            try {
                const staffLoginData = { staff_id: staff_id, password: password }
                await dispatch(deliveryStafflogin(staffLoginData));
                const state = store.getState(); // Assuming you have access to the Redux store
                const {deliveryStaffInfo,error:deliveryLoginStatus} = state.deliveryStaffLogin;

                if (deliveryLoginStatus) {
                    await saveData("isStaffLogin", true);
                    await saveData("role", "staff");
                    await saveData("delivryStaffData", deliveryStaffInfo)
                    navigation.navigate("DeliveryHome");
                } else {
                    Alert.alert("sorry", "these cradintials are not found")
                }
            } catch (error) {
                console.log("Login error:", error);
            }
           
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Surface style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
                </TouchableOpacity>

                <Image
                    source={require('../../utilities/images/logo.png')} // Add your logo image here
                    style={styles.logo}
                />
            </Surface>
            <View style={styles.inputContainer}>

                <Text style={styles.title}>Delivery Partner Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="StaffID"
                    value={staff_id} placeholderTextColor={"#aaaaaa"}
                    onChangeText={setStaff_id}
                    keyboardType="numeric"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleStaffLogin}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#FDE8E8',
        height: 230,
        width: "100%",
        justifyContent: 'center',
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50
    },
    logo: {
        alignSelf: 'center',
        width: 250,
        height: 94
    },
    inputContainer: {
        alignItems: 'center',
        marginVertical: 20,
        width: "100%",
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 40, color: '#6c290f'
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 8,
        borderRadius: 50,
    },
    input: {
        width: '90%',
        color: "#6c290f",
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3, // Shadow for Android
    },
    button: {
        backgroundColor: '#FF7F45',
        width: '70%',
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center', alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
    },
})