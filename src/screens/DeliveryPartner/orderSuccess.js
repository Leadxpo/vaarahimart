import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliverySuccess = ({ navigation }) => {
  const handleGoHome = () => {
    // Navigate to the home screen
    navigation.navigate('Home');
  };

  const handleViewOrders = () => {
    // Navigate to the orders screen
    navigation.navigate('Orders');
  };

  return (
    <View style={styles.container}>
      {/* Thank You Text */}
      <Text style={styles.title}>Thank You</Text>

      {/* Placeholder for the image */}
      <Image
        source={require('../../utilities/images/logo.png')} // Add your logo image here
        style={styles.image}
      />

      {/* Order Success Message */}
      <Text style={styles.successTitle}>Order Successfully Delivered</Text>
      <Text style={styles.successMessage}>
        <Text style={{fontSize:18}}>Great job  !</Text> {"\n"}You have successfully  delivered Order ID : 1111
      </Text>

      {/* Go To Home Button */}
      <Button
        mode="contained"
        onPress={handleGoHome}
        style={styles.homeButton}
        labelStyle={styles.homeButtonText}
      >
        Go To Home
      </Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 30,
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#f46a11',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersButton: {
    borderColor: '#fff',
    borderWidth: 2,
    width: '80%',
    borderRadius: 30,
  },
  ordersButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeliverySuccess;
