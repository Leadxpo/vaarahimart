import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Redux/Actions/loginAction';
import axios from "react-native-axios";
import store from '../../Redux/store';

const Login = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { loading, userInfo, error, } = userLogin;

    const handleGetStarted = useCallback(async () => {
        if (phoneNumber.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
            return;
        }
        if (!name) {
            Alert.alert('Invalid Name', 'Please enter a your Name.');
            return;
        }
        if (!loading) {
            try {
                // Dispatch login action to fetch OTP
                const userDetailsInfo = await dispatch(login(phoneNumber, name));
                navigation.navigate("OTP", { userData: userDetailsInfo });
            } catch (error) {
                Alert.alert("Login Failed", "Unable to fetch OTP. Please try again.");
            }
        }

    }, [phoneNumber, dispatch]);


    return (
        <View style={styles.container}>
            <Surface style={styles.header}>
                <Image
                    source={require('../../utilities/images/logo.png')} // Add your logo image here
                    style={styles.logo}
                />
            </Surface>
            <View style={{ marginHorizontal: 30 }}>
                <Text style={styles.title}>Login With Phone Number</Text>
                <Text style={styles.subtitle}>We will send you an OTP on this number</Text>
                    <View style={styles.phoneNum_three}>

                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Name"
                            placeholderTextColor={"#555555"}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                <View style={styles.inputContainer}>
                    <View style={styles.phoneNum_one} >

                        <Text style={styles.flag}>🇮🇳 +91</Text>
                    </View>

                    <View style={styles.phoneNum_two}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Phone Number"
                            placeholderTextColor={"#555555"}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            maxLength={10}
                        />
                    </View>
                </View>

                <Text style={[styles.infoText]}>
                    Your number is safe with us. We don’t use your number for any unsolicited communication.
                </Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <TouchableOpacity style={[styles.button, { minHeight: 48 }]} onPress={handleGetStarted} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Get Started</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#FDE8E8',
        height: 250,
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
    title: {
        fontSize: 20,
        fontFamily:"Parkinsans-SemiBold",
        color:"#F07825",
        marginTop: 70,
    },
    subtitle: {
        fontSize: 14,
        color: '#6c290f',
        fontWeight: '500',
        textAlign: 'left',
        marginVertical: 18,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        width: "100%",
        paddingHorizontal: 10,
    },
    phoneNum_one: {
        borderBottomWidth: 1,
        height: 50, 
        minHeight: 48, // Ensuring touch target size
        borderColor: '#A63A50',
        justifyContent: 'center',
    },
    phoneNum_two: {
        borderBottomWidth: 1,
        marginStart: 10,
        width: "80%",
        height: 50,
        minHeight: 48, // Ensuring touch target size
        borderColor: '#7E7E7E',
        justifyContent: 'center',
    },
    phoneNum_three: {
        borderBottomWidth: 1,
        marginStart: 10,
        marginBottom: 20,
        width: "100%",
        height: 50,
        minHeight: 48, // Ensuring touch target size
        borderColor: '#7E7E7E',
        justifyContent: 'center',
    },
    flag: {
        fontSize: 18,
        color: "#6c290f"
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#6c290f',
        height: 48,
        padding: 5,
    },
    infoText: {
        fontSize: 14,
        color: '#6c290f',
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 40,
    },
    button: {
        borderColor: '#F07825',
        width: "60%",
        backgroundColor: 'white',
        paddingHorizontal: 40,
        justifyContent: 'center',
        alignSelf: "center",
        borderRadius: 5,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        height: 48,
        minHeight: 48, // Ensuring touch target size
    },
    buttonText: {
        color: '#A63A50',
        fontSize: 18,
        alignSelf: "center",
        fontWeight: 'bold',
    },
});

export default Login;
