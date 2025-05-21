import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, } from 'react-native';
import { Surface, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCarts } from '../../Redux/Actions/cartAction';
import { fetchOrders } from '../../Redux/Actions/orderAction';
import { fetchNotifications } from '../../Redux/Actions/notificationAction';
import { fetchRecent_Orders } from '../../Redux/Actions/recentOrdersAction';
import { getUserById } from '../../Redux/Actions/userAction';
import axios from "react-native-axios";
import { saveData } from '../../Utils/appData'
import { login } from '../../Redux/Actions/loginAction';
import store from '../../Redux/store';
import { CommonActions } from '@react-navigation/native';

const Otp = ({ navigation, route }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(30);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const otpInputs = useRef([]);

  const { userData } = route.params;
  const dispatch = useDispatch();

  const { userInfo: userLoginInfo } = useSelector((state) => state.userLogin);

  // Fetches required user data after successful OTP verification
  const fetchUserData = async (userId, userData) => {
    try {
      await Promise.all([
        dispatch(getUserById(userId)),
        dispatch(fetchCarts(userId)),
        dispatch(fetchOrders(userId)),
        dispatch(fetchNotifications(userId)),
        dispatch(fetchRecent_Orders(userId)),
      ]);
      await saveData('isLogin', true);
      await saveData("role", "user");
      await saveData('userData', userData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Handles OTP input and verification
  const handleOTPVerification = async () => {
    setLoading(true)
    await dispatch(getUserById(userLoginInfo?.id));
    const state = store.getState(); // Assuming you have access to the Redux store
    const userDetailsInfo = state.userDetails.userInfo;
    const enteredOtp = otp.join('');
    const otpFromData = userDetailsInfo?.OTP;
    const userId = userDetailsInfo?.id;

    if (enteredOtp === otpFromData) {
      await fetchUserData(userId, userDetailsInfo);
      setLoading(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Bottom_Home', params: { screen: 'Home' } },
          ],
        })
      )
      } else {
      Alert.alert('Invalid OTP. Please try again.');
    }
  };

  // Updates OTP input and auto-focuses the next field
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpInputs.current[index + 1].focus();
    }

    if (!text && index > 0) {
      otpInputs.current[index - 1].focus();
    }

    setIsOtpValid(newOtp.every((digit) => digit !== ''));
  };

  // Handles OTP resend functionality
  const handleResendOtp = async () => {
    if (resendTimer === 0) {
      setOtp(Array(6).fill(''));
      setResendTimer(30);
      Alert.alert('OTP Resent', 'A new OTP has been sent to . ' + userData.phone_no);
      await dispatch(login(userData?.phone_no, userData?.name));
      await dispatch(getUserById(userData?.id));
    }
  };

  // Timer for resending OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  // Sets user phone number on initial load
  useEffect(() => {
    if (userData) {
      setPhoneNumber((prev)=>prev=userData.phone_no);
      setName((prev)=>prev=userData.name);
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Image source={require('../../utilities/images/logo.png')} style={styles.logo} />
      </Surface>

      <View style={styles.content}>
        <Text style={styles.title}>OTP Sent</Text>
        <Text style={styles.subtitle}>
          OTP has been sent to <Text style={[styles.phoneNumber,{textTransform:'capitalize'}]}>{name}</Text> holding Phone No<Text style={styles.phoneNumber}>  {phoneNumber}</Text>
        </Text>

        <TouchableOpacity onPress={handleResendOtp} disabled={resendTimer > 0}>
          <Text style={[styles.resendText, resendTimer === 0 && styles.activeResendText]}>
            Resend OTP in {resendTimer > 0 ? `${resendTimer} Sec` : 'Now'}
          </Text>
        </TouchableOpacity>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              ref={(input) => (otpInputs.current[index] = input)}
            />
          ))}
        </View>

        {isOtpValid && (
          <TouchableOpacity style={styles.button} onPress={handleOTPVerification}>
            {loading ? <ActivityIndicator></ActivityIndicator> : <Text style={styles.buttonText}>Get Started</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal:25,
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
    fontWeight: '600',
    marginTop: 70,
  },
  subtitle: {
    fontSize: 16,
    color: '#7E7E7E', letterSpacing:1,
    marginVertical: 20,fontFamily:"Roboto-Regular"
  },
  phoneNumber: {
    fontWeight: 'bold',
    color: '#A63A50',
  },
  resendText: {
    fontSize: 14,
    color: '#7E7E7E',
    marginBottom: 40,
  },
  activeResendText: {
    color: 'green',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#7E7E7E',
    textAlign: 'center',
    fontSize: 18,fontWeight:'600',
    width: 40, height: 40,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4, 
    color: '#6c290f',
    elevation: 5,
    backgroundColor: '#FFF', // Set a solid background color
  },
  button: {
    paddingVertical: 15,
    width: "60%", backgroundColor: "#F07825",
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 5,
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 5 }, // iOS shadow
    shadowOpacity: 0.3, // iOS shadow
    shadowRadius: 4, // iOS shadow
    elevation: 5, // Android shadow    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    alignSelf: "center",
    fontWeight: '700',
  },

});

export default Otp;
