import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, NativeModules, } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { updateOrder } from '../../Redux/Actions/orderAction';
import { CommonActions } from '@react-navigation/native';
import ApiClient from '../../Api/pay_ApiClient';

const OrderSuccess = ({ navigation, route }) => {
  const [userID, setUserID] = useState("");
  const { orderID, orderDetails } = route.params;
  const [order_amount, setOrder_amount] = useState('');
  const [responseText, setResponseText] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState("");

  const handleGoHome = () => {
    // Navigate to the home screen

    // Inside your event handler for the Home button:
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Bottom_Home', params: { screen: 'Home' } },
        ],
      })
    )

  };
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingRunningOrder, orderData, error: RunningOrderError } = useSelector(state => state.runningOrder);
  const dispatch = useDispatch();

  const handleViewOrders = () => {
    // Navigate to the orders screen
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Bottom_Home', params: { screen: 'Orders' } },
        ],
      })
    )
  };

 const successOrderBooking = async (paymentData, orderInfo) => {
    const payment_mode=paymentData.paymentMethod;
    // const paymentInstrument = paymentData.payload.paymentInstrument;
    const Transaction_id = paymentData.id;
    const payment_status = paymentData.payload.status;
        try {
          await dispatch(updateOrder(userInfo.id, orderInfo, Transaction_id, payment_mode, payment_status));
    } catch (error) {
      console.log("error : ", error)
    }finally{
        navigation.navigate("OrderSuccess", { orderID: paymentData.order_id});
    }
  }
  useEffect(() => {
    setOrderId(orderID);
    // block:start:sendGetRequest 
    ApiClient.sendGetRequest(
      `https://vaarahimart.com/handleJuspayResponse`, orderID,
      {
        onResponseReceived: (response) => {
          const rrr = JSON.parse(response)
          const orderStatuses = rrr.status;
          const orderAmount = rrr.amount;
          setOrderStatus(orderStatuses);
          setOrder_amount(orderAmount);
          switch (orderStatuses) {
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
              successOrderBooking(rrr,orderDetails)
              setResponseText('Order Successful');
              break;
            case 'PENDING_VBV':
              setResponseText('Order is Pending...');
              break;
            default:
              setResponseText(orderStatuses);
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

  useEffect(() => {
  }, [responseText]);

  return (
    <View style={styles.container}>
      {/* Thank You Text */}
      <Text style={styles.title}>Thank You</Text>

      {/* Placeholder for the image */}
      <View style={styles.viewImage}>
        <Image
          source={require('../../utilities/images/logo.png')} // Add your logo image here
          style={styles.image}
        />
      </View>

      {/* Order Success Message */}
      <View
        style={{
          alignItems: 'center', marginVertical: 18,
          justifyContent: 'center'
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
            fontSize: 20, fontFamily: "Parkinsans-Bold", backgroundColor: "#ffffff", paddingVertical: 8, paddingHorizontal: 35, borderRadius: 25, borderColor: "#f46a1190", borderWidth: 3
          }}
        >
          {responseText ? responseText : "Loading..."}
        </Text>
        <Text style={{ color: '#f3f3f3', fontFamily: "Roboto-Regular", fontSize: 16, fontFamily: "Parkinsans-Regular" }}>  {orderStatus}</Text>
        <Text style={{ color: '#f3f3f3', fontSize: 14, fontFamily: "Roboto-Regular" }}>{order_amount}</Text>
        <Text style={{ color: '#f3f3f3', fontSize: 11, fontFamily: "Roboto-Bold" }}> OrderID : {orderID} payment successfull with Payment Transaction ID : {orderID}</Text>
      </View>

      {/* Go To Home Button */}
      <Button
        mode="contained"
        onPress={handleGoHome}
        style={styles.homeButton}
        labelStyle={styles.homeButtonText}
      >
        Go To Home
      </Button>

      {/* View All Orders Button */}
      <Button
        mode="outlined"
        onPress={handleViewOrders}
        style={styles.ordersButton}
        labelStyle={styles.ordersButtonText}
      >
        View All Orders
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f46a11',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 94,
    marginBottom: 20
  },
  viewImage: {
    width: 300,
    height: 130, justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff', alignSelf: 'center',
    elevation: 3, borderRadius: 10, borderWidth: 2, borderColor: '#f9f9f9'
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

export default OrderSuccess;
