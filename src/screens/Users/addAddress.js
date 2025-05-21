import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { createAddress, fetchAddresses } from '../../Redux/Actions/addressAction';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {extractAddressDetails} from '../../components/getAddress';

const AddAddress = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [addressline_one, setAddressline_one] = useState('');
  const [addressline_two, setAddressline_two] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [userID, setUserID] = useState('');
  const [isAddressAdding, setIsAddressAdding] = useState(false);
  const dispatch = useDispatch();
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);

  const getCurrentLocation = async () => {
    try {
      // Fetch location using Google Geolocation API
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (data.location) {
        const { lat, lng } = data.location;

        // Fetch address details using Google Maps Geocoding API
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`
        );
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results && geocodeData.results.length > 0) {
          // Extract postal code from the address components
          // const addressComponents = geocodeData.results[0].address_components;
          const addressDetails = extractAddressDetails(geocodeData.results);

          setAddressline_one(addressDetails.addressline_one || "");
          setAddressline_two(addressDetails.addressline_two || "");
          setCity(addressDetails.city || "");
          setState(addressDetails.state || "");
          setPincode(addressDetails.pincode || "");
          // Helper function to get component by type
        // const getComponent = (type) =>
        //   addressComponents.find((component) => component.types.includes(type))?.long_name;

        // // Extract individual address fields
        // const addressLineOne = geocodeData.results[0].formatted_address.split(',')[0]; // First part of formatted address
        // const addressLineTwo = geocodeData.results[0].formatted_address.split(',').slice(1, -2).join(','); // Middle parts
        // const city = getComponent('locality');
        // const state = getComponent('administrative_area_level_1');
        // const postalCode = getComponent('postal_code');

        // Update state variables
        // setAddressline_one(addressLineOne || '');
        // setAddressline_two(addressLineTwo || '');
        // setCity(city || '');
        // setState(state || '');
        // setPincode(postalCode || '');
        } else {
          console.warn('No results found for geocoding');
        }
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
      setErrorMsg('Unable to get current location');
    }
  };

  const handleContinue = async () => {
    setIsAddressAdding(true)
    // Add form validation or API call here
    if (!name || !phoneNo || !addressline_one || !addressline_two || !city || !pincode) {
      Alert.alert('Error', 'Please fill all fields');
    } else {
      const addressData = { name: name, phone_no: phoneNo, user_id: userInfo.id, user_name: userInfo.name, address_line_one: addressline_one, address_line_two: addressline_two, city: city, state: state, pincode: pincode }
      try {
        await dispatch(createAddress(userInfo.id, addressData));
        await dispatch(fetchAddresses(userInfo.id))
      } catch (error) {
        console.log("Error :", error)
        Alert("Adding Address Faild ", "Sorry this address failsd to add in your addresses,please try again")
      } finally {
        setIsAddressAdding(false)
        navigation.goBack();
      }
    }
  };
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.setNativeProps({ autoFocus: true });
  };
  const handlePickupLocation = () => {
    Alert.alert('Info', 'Pick up location functionality not yet implemented');
  };

  useEffect(() => {
    const fetchData = async () => {
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}>
        <View style={styles.header}>
          <Text style={{ fontSize: 20, color: "#6c290f", fontWeight: '700' }}>Add Address</Text>
        </View>
        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center",margin:5 }}  onPress={getCurrentLocation}>
          <MaterialCommunityIcons
            name="google-maps"
            size={20}
            color='#f46f2e'
            style={{ alignSelf: 'flex-end',justifyContent:"center"}}
            onPress={() => handleRemoveProduct(item.variant_id, Variant)}
          />
          <Text style={{ fontFamily: "Parkinsans-Bold", fontSize: 14, margin: 5, }}>Get Current Location</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="Title"
          placeholderTextColor={"#aaaaaa"}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="Phone No"
          placeholderTextColor={"#aaaaaa"}
          value={phoneNo}
          maxLength={10}
          onChangeText={setPhoneNo}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="Address line 1"
          placeholderTextColor={"#aaaaaa"}
          value={addressline_one}
          onChangeText={setAddressline_one}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="Address line 2"
          placeholderTextColor={"#aaaaaa"}
          value={addressline_two}
          onChangeText={setAddressline_two}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="City / Dist"
          placeholderTextColor={"#aaaaaa"}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="State"
          placeholderTextColor={"#aaaaaa"}
          value={state}
          onChangeText={setState}
        />
        <TextInput
          ref={inputRef} onFocus={focusInput}
          style={styles.input}
          placeholder="Pincode"
          placeholderTextColor={"#aaaaaa"}
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          {isAddressAdding ? <ActivityIndicator size={'small'} /> : <Text style={styles.buttonText}>Continue</Text>}
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
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2, color: "#6c290f",
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

export default AddAddress;
