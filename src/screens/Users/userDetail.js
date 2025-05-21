import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById, updateUser } from '../../Redux/Actions/userAction';
import store from '../../Redux/store';
import { saveData } from '../../Utils/appData'

const UserDetails = ({ navigation, route }) => {
  const { userData } = route.params;
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phoneNumber, setPhoneNumber] = useState(userData.phone_no);
  const [currentAddress, setCurrentAddress] = useState(userData.address);
  const dispatch = useDispatch();
  const handleContinue = async () => {
    // Add form validation or API call here
    if (!name || !email || !phoneNumber || !currentAddress) {
      Alert.alert('Error', 'Please fill all fields');
    } else {
      Alert.alert('Success', 'Details submitted successfully');
      const userInfo = { userID: userData.id, name: name, phone_no: phoneNumber, email: email, address: currentAddress }
      try {
        await dispatch(updateUser(userInfo));
        await dispatch(getUserById(userData.id));
        const state = store.getState(); // Assuming you have access to the Redux store
        const userDetailsInfo = state.userDetails.userInfo;
        await saveData('userData', userDetailsInfo);
      } catch (error) {
        console.log("error :", error);
      }
      navigation.push('Bottom_Home',{screen:"Profile"})
    }
  };

  const handlePickupLocation = () => {
    Alert.alert('Info', 'Pick up location functionality not yet implemented');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../utilities/images/logo.png')} // Add your logo image here
            style={styles.logo}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor={"gray"}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          placeholderTextColor={"gray"}

          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={"gray"}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={handlePickupLocation}>
        <Text style={styles.pickupText}>Choose Pickup Locations</Text>
      </TouchableOpacity> */}

        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Current Address"
          value={currentAddress}
          placeholderTextColor={"gray"}
          onChangeText={setCurrentAddress}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
    width: 250,
    height: 94
  },
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    color:'#6c290f',
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Shadow for Android
  },
  pickupText: {
    justifyContent: 'flex-end',
    color: '#FF7F45',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default UserDetails;
