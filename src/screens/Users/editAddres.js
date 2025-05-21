import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { createAddress, updateAddressByID } from '../../Redux/Actions/addressAction';

const EditAddress = ({ navigation, route }) => {
  const [addressID, setAddressID] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [addressline_one, setAddressline_one] = useState('');
  const [addressline_two, setAddressline_two] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [userID, setUserID] = useState('');
  const dispatch = useDispatch();
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const addressData = route.params?.addressData || null; // Default to null if no coupon passed

  const handleContinue = () => {
    // Add form validation or API call here
    if (!name || !phoneNo || !addressline_one || !addressline_two || !city || !pincode) {
      Alert.alert('Error', 'Please fill all fields');
    } else {
      const addressData = { id: addressID, name: name, phone_no: phoneNo, user_id: userInfo.id, user_name: userInfo.name, address_line_one: addressline_one, address_line_two: addressline_two, city: city, state: state, pincode: pincode }
      dispatch(updateAddressByID(userInfo.id, addressData));
      navigation.goBack();
    }
  };

  const handlePickupLocation = () => {
    Alert.alert('Info', 'Pick up location functionality not yet implemented');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (addressData) {
        setAddressID(addressData.id)
        setName(addressData.name)
        setPhoneNo(addressData.phone_no)
        setAddressline_one(addressData.address_line_one)
        setAddressline_two(addressData.address_line_two)
        setCity(addressData.city)
        setState(addressData.state)
        setPincode(addressData.pincode)
      }

      if (userInfo?.id) {
        setUserID(userInfo.id);
        try {
          await dispatch(getUserById(userInfo.id));
        } catch (error) {
          console.log("error : ", error);
        }
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20, color: "#6c290f", fontWeight: '700' }}>Edit Address</Text>
          <Text style={{ fontSize: 20, color: "#999999", fontWeight: '700' }}>Address ID : {addressID}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={"#aaaaaa"}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone No"
          placeholderTextColor={"#aaaaaa"}
          value={phoneNo}
          onChangeText={setPhoneNo}
        />
        <TextInput
          style={styles.input}
          placeholder="Address line 1"
          placeholderTextColor={"#aaaaaa"}
          value={addressline_one}
          onChangeText={setAddressline_one}
        />
        <TextInput
          style={styles.input}
          placeholder="Address line 2"
          placeholderTextColor={"#aaaaaa"}
          value={addressline_two}
          onChangeText={setAddressline_two}
        />
        <TextInput
          style={styles.input}
          placeholder="City / Dist"
          placeholderTextColor={"#aaaaaa"}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor={"#aaaaaa"}
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          placeholderTextColor={"#aaaaaa"}
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
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
  input: {
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,color:"#6c290f",
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
});

export default EditAddress;
