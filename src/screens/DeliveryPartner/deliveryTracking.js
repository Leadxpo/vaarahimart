import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, Appbar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TrackDelivery =({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null); // Destination coordinates from Geocoding API
  const [errorMsg, setErrorMsg] = useState(null);
  const { orderData } = route.params;
  const json_orderData=JSON.parse(orderData.shipping_address);
  // Destination address for geocoding 

  const { address_line_one, address_line_two, city,state, pincode } = json_orderData;
const destinationAddress = `${address_line_one}, ${address_line_two},${city}, ${state}, ${pincode}`;
  // Function to request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This app needs to access your location to track the delivery.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert("Permission Denied", "Location permission is required for live tracking.");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  // Function to fetch destination coordinates using Google Geocoding API
  const fetchDestinationCoordinates = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setDestination({
          latitude: lat,
          longitude: lng,
        });
      } else {
        Alert.alert("Geocoding Error", "Unable to fetch destination coordinates.");
      }
    } catch (error) {
      console.error('Error fetching destination coordinates:', error);
    }
  };

  // Use Google Geolocation API to get accurate current location
  const getCurrentLocation = async () => {
    try {
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
        setLocation({
          latitude: data.location.lat,
          longitude: data.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
      setErrorMsg('Unable to get current location');
    }
  };

  // Handle component mount and permissions
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
    fetchDestinationCoordinates(); // Fetch destination coordinates when component mounts
  }, []);

  // Function to open Google Maps navigation
  const handleNavigation = () => {
    if (location && destination) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
      Linking.openURL(url);
    } else {
      Alert.alert("Location Error", "Current location or destination is not available.");
    }
  };

  let region = {
    latitude: location ? location.latitude : 17.385044, // Default latitude if location not available
    longitude: location ? location.longitude : 78.486671, // Default longitude if location not available
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Appbar for the back button and screen title */}
      {/* <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Track Delivery" />
      </Appbar.Header> */}

      {/* Map View with Google Maps Provider */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Marker for the destination */}
        {destination && (
          <Marker coordinate={destination} title="Destination" />
        )}

        {/* Marker for the delivery person */}
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
            <Icon name="bike" size={40} color="black" />
          </Marker>
        )}
      </MapView>

      {/* Delivery Info and Navigation Button */}
      <View style={styles.infoContainer}>
        <Icon name="map-marker" size={20} color="red" />
        <Text style={styles.infoText}>
          {json_orderData.name}{'\n'}
          {json_orderData?.address_line_one},{json_orderData?.address_line_two}{'\n'}
          {json_orderData?.city}, {json_orderData?.state}
          {json_orderData?.pincode}, <Text style={{color:'#000000'}}>Ph.N0:</Text> {json_orderData?.phone_no}
        </Text>
        <Button
      icon="phone"
      labelStyle={{ color: "#f9f9f9" }}
      contentStyle={{ backgroundColor: '#FF7043' }}
      style={styles.navigateButton}
      mode="contained"
      onPress={() => {
        const phoneNumber = `tel:${json_orderData?.phone_no}`;
        Linking.openURL(phoneNumber).catch((err) => {
          console.error('Failed to make a call:', err);
        });
      }}
    >
      Call
    </Button>
        <Button icon="map-marker" labelStyle={{color:"#f9f9f9"}} contentStyle={{backgroundColor:'#FF7043'}} style={styles.navigateButton} mode="contained" onPress={() => console.log('Call Delivery')}>
          Destination Reached
        </Button>
        <Button icon="car" mode="contained" labelStyle={{color:"#f9f9f9"}} contentStyle={{backgroundColor:'#FF7043'}} onPress={handleNavigation} style={styles.navigateButton}>
          Start Navigation
        </Button>
      </View>
    </View>
  );
};

export default TrackDelivery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
  navigateButton: {
    margin:15,backgroundColor:'#FF7043'
  },
});
