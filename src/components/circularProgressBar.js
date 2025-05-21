import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CircularProgressBar = ({ progress }) => {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.progressContainer}>
      <Svg height="540" width="540" viewBox="0 0 240 240">
        <Circle
          stroke="#e0e0e0"
          cx="120"
          cy="120"
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          stroke="#f46f2e"
          cx="120"
          cy="120"
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin="120, 120"
        />
      </Svg>
      <View style={styles.logoContainer}>
        <Image source={require('../utilities/images/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width:200,
    height: 75,
  },
  progressText: {
    marginTop: 10,
    fontSize: 24,
    color: '#6c290f', // Higher contrast color
    fontWeight: 'bold', // Optional for emphasis
},
});

export default CircularProgressBar;
