import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useRef, useEffect } from 'react';

export default function ProfileWithoutLogin({ navigation }) {
  const handleLoginPress = () => {
    navigation.replace("login")
  };

  const handleShopNowPress = () => {
    navigation.replace("Bottom_Home",{screen:'Home'});
  };

  // Animations
  

  return (
    <View style={styles.wrapper}>
      <ScrollView>
          {/* Animated logo resizing and moving */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../utilities/images/logo.png')} // Add your logo image here
              style={[
                styles.logo,
               
              ]}
            />
          </View>

          {/* The rest of the content that fades in */}
          <View style={[styles.contentContainer,]}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
            You Don't Have An Account
            Please Signup Before Buying Orders
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

          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 200, // Initial size
    height: 200,
    resizeMode: 'contain',
  },
  contentContainer: {
    flex:1,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6a2911',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,width:"70%",
    color: '#777',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonLogin: {
    backgroundColor: '#F07825',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginVertical: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonShopNow: {
    backgroundColor: '#fff',
    borderColor: '#F07825',
    borderWidth: 2,
    paddingVertical: 20,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  onboarderButtonText: {
    color: '#6a2911',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orText: {
    fontSize: 16,
    color: '#6c290f',
    marginVertical: 10,
  },
  foodImage: {
    width: 500,
    height: 280,
    resizeMode: 'stretch',
    marginTop: 20,
    borderRadius: 10,
  },
});
