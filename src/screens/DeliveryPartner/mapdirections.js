import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TrackDelivery = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [routeCoords, setRouteCoords] = useState([]);
  const { orderData } = route.params;
  const json_orderData = JSON.parse(orderData.shipping_address);
  const { address_line_one, address_line_two, city, state, pincode } = json_orderData;
  const destinationAddress = `${address_line_one}, ${address_line_two}, ${city}, ${state}, ${pincode}`;

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo';

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
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
        Alert.alert('Permission Denied', 'Location permission is required for live tracking.');
      }
    } else {
      getCurrentLocation();
    }
  };

  const fetchDestinationCoordinates = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationAddress)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setDestination({ latitude: lat, longitude: lng });
        fetchRoute(lat, lng);
      } else {
        Alert.alert('Error', 'Unable to fetch destination coordinates.');
      }
    } catch (error) {
      console.error('Geocoding Error:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }
      );
      const data = await response.json();
      if (data.location) {
        setLocation({
          latitude: data.location.lat,
          longitude: data.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Current Location Error:', error);
    }
  };

  const fetchRoute = async (destLat, destLng) => {
    if (!location) return;
    try {
      const routeUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=17.7340416,83.2667648&destination=17.71970884685025,83.29343820387481&key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`;
      const response = await fetch(routeUrl);
      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];
        const decodedPolyline = decodePolyline(route.overview_polyline.points);
        setRouteCoords(decodedPolyline);
        const stepsData = route.legs[0].steps.map(step => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Clean HTML tags
          start: step.start_location,
          end: step.end_location,
        }));
        setSteps(stepsData);
        setCurrentInstruction(stepsData[0]?.instruction || 'Follow the route');
      } else {
        Alert.alert('Error', 'Unable to fetch route data.');
      }
    } catch (error) {
      console.error('Route Fetch Error:', error);
    }
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;
    while (index < encoded.length) {
      let b, shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      getCurrentLocation();
    }
    fetchDestinationCoordinates();
  }, []);

  useEffect(() => {
    if (location && steps.length > 0) {
      const threshold = 0.01; // Approx. 10 meters
      const currentStep = steps[0];
      const distanceToNext = haversineDistance(location, {
        latitude: currentStep.end.lat,
        longitude: currentStep.end.lng,
      });

      if (distanceToNext < threshold) {
        steps.shift();
        setSteps(steps);
        setCurrentInstruction(steps[0]?.instruction || 'You have reached your destination.');
      }
    }
  }, [location]);

  const haversineDistance = (loc1, loc2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 17.385044,
          longitude: location?.longitude || 78.486671,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {destination && <Marker coordinate={destination} title="Destination" />}
        <Polyline coordinates={routeCoords} strokeColor="red" strokeWidth={3} />
      </MapView>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{currentInstruction}</Text>
      </View>
    </View>
  );
};

export default TrackDelivery;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  instructionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    color: 'black',
  },
});
// https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${destLat},${destLng}&key=${GOOGLE_MAPS_API_KEY}