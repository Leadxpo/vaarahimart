import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing, ScrollView, ImageBackground, Dimensions, PermissionsAndroid, Platform, Alert } from 'react-native';
import React, { useRef, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function Onboarding({ navigation }) {
  const handleLoginPress = () => {
    navigation.replace("login")
  };

  const handleShopNowPress = () => {
    navigation.replace("Bottom_Home", { screen: 'Home' });
  };

  // Animations
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(1)).current; // Start with scale 1 (300px as initial size)
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentMovement = useRef(new Animated.Value(0)).current;
  
  const requestPermissionsAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        (granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED)
      ) {
        Alert.alert('Permission Accepted', 'Camera, Gallery, or Location permissions denied');
      } else {
        Alert.alert('Permission Denied', 'Camera, Gallery, or Location permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // iOS-specific permissions handling
  const requestPermissionsIOS = async () => {
    try {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      const galleryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const locationPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (
        cameraPermission === RESULTS.GRANTED &&
        galleryPermission === RESULTS.GRANTED &&
        locationPermission === RESULTS.GRANTED
      ) {
        console.log('Permissions for Camera, Gallery, and Location are granted');
      } else {
        console.log('Permission Denied', 'Camera, Gallery, or Location permissions denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Request permissions on mount
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissionsAndroid();
    } else if (Platform.OS === 'ios') {
      requestPermissionsIOS();
    }
  }, []);

  useEffect(() => {
    // Step 1: Fade in the logo
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: true,
    }).start(() => {
      // Step 2: Animate logo movement and resize using scale transform
      Animated.parallel([
        Animated.timing(logoMovement, {
          toValue: -100, // Move up
          duration: 1500,
          easing: Easing.inOut(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.4, // Scale down to 0.3x (300 -> 90)
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(contentMovement, {
          toValue: -200, // Move content to its original position
          duration: 1800,
          easing: Easing.inOut(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();
      // });
    });
  }, []);


  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={{
          uri: 'https://media.istockphoto.com/id/1145430255/vector/fruits-and-vegetables-seamless-pattern.jpg?s=612x612&w=0&k=20&c=2ESF5mMwEhqIlYwtShzpOp3O_U_EncGZMpKMKR8_d7o=',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        {/* Animated logo resizing and moving */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../../utilities/images/logo.png')} // Add your logo image here
            style={[
              styles.logo,
              {
                opacity: logoFade, // Fade in
                transform: [
                  { translateY: logoMovement }, // Move up
                  { scale: logoScale }, // Scale down
                ],
              },
            ]}
          />
        </View>

        {/* The rest of the content that fades in */}
        <Animated.View style={[styles.contentContainer, { opacity: contentFade, transform: [{ translateY: contentMovement }] }]}>
          <Text style={styles.title}>Welcome to Vaarahi Mart!</Text>
          <Text style={styles.subtitle}>
            Best Place To Buying Groceries And Share Your Journey Experience
          </Text>

          {/* Login Button */}
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginPress}>
              <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or</Text>

          {/* Shop Now Button */}
          <TouchableOpacity style={styles.buttonShopNow} onPress={handleShopNowPress}>
            <Text style={styles.onboarderButtonText}>Shop Now</Text>
          </TouchableOpacity>

          {/* Add the background image with fruits and vegetables */}
          <Image
            source={require('../../utilities/images/food.png')} // Add your food image here
            style={styles.foodImage}
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust transparency and color
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black overlay
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 300, // Initial size
    height: 300,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,fontFamily:'Parkinsans-Bold',
    color: '#9C4A1A', // Higher contrast
    textAlign: 'center',
  },
  buttonLogin: {
    backgroundColor: '#D16A1F', // Adjusted for higher contrast 
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Parkinsans-SemiBold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
    buttonShopNow: {
    backgroundColor: '#fff',
    borderColor: '#B65D0A',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
    onboarderButtonText: {
    color: '#9C4A1A',
    fontSize: 16,fontFamily:'Parkinsans-SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#4A4A4A', // Adjusted for better contrast
    textAlign: 'center',
    marginVertical: 18,
    marginTop: 10,
  },
  orText: {
    fontSize: 16,
    color: '#5A5A5A', // Higher contrast
    marginVertical: 10,
  },
    foodImage: {
    width: 500,
    height: 280,
    resizeMode: 'stretch',
    marginTop: 20,
    borderRadius: 10,
    bottom: Platform.OS === 'android' ? -130 : 0
  },
});
