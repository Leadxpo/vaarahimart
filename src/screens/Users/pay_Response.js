import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { useRoute } from '@react-navigation/native';
import ApiClient from '../../Api/pay_ApiClient';

export default function Response({ navigation }) {
  const [responseText, setResponseText] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(0);
  const [orderStatus, setOrderStatus] = useState('');
  const route = useRoute();

  useEffect(() => {
    const { orderId, Amount } = route.params;
    setOrderId(orderId);
    setAmount(Amount);
    // block:start:sendGetRequest 
    ApiClient.sendGetRequest(
      `https://vaarahimart.com/handleJuspayResponse`, orderId,
      {
        onResponseReceived: (response) => {
          const orderStatus = JSON.parse(response).status;
          setOrderStatus(orderStatus);
          switch (orderStatus) {
            case 'NEW':
              setResponseText('Order Under Process');
              break;
            case 'PAID':
              setResponseText('Order Successful');
              break;
            case 'FAILED':
              setResponseText('Order UnSuccessful');
              break;
            case 'CANCELLED':
              setResponseText('Order Canceled');
              break;
            case 'EXPIRED':
              setResponseText('Order payment was expired');
              break;
            case 'CHARGED':
              setResponseText('Order Successful');
              break;
            case 'PENDING_VBV':
              setResponseText('Order is Pending...');
              break;
            default:
              setResponseText('Order has Failed');
              break;
          }
        },
        onFailure: (error) => {
          console.error('GET request failed:', error);
          setResponseText('Order Status API Failed');
        },
      }
    );
    // block:end:sendGetRequest

  }, [route.params]);

  return (
    <View
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color:
            orderStatus === 'CHARGED'
              ? 'green'
              : orderStatus === 'NEW'
                ? 'blue'
                : orderStatus === 'PAID'
                  ? 'green'
                  : orderStatus === 'FAILED'
                    ? 'red'
                    : orderStatus === 'CANCELLED'
                      ? 'red'
                      : orderStatus === 'EXPIRED'
                        ? 'red'
                        : orderStatus === 'PENDING_VBV'
                          ? 'orange'
                          : 'red',
          fontSize: 30,
        }}
      >
        {responseText}
      </Text>
      <Text style={{ color: 'black', fontSize: 16 }}>{orderStatus}</Text>
      <Text style={{ color: 'black', fontSize: 16 }}>{amount}</Text>
      <Text style={{ color: 'black', fontSize: 16 }}>{orderId}</Text>
    </View>
  );
};