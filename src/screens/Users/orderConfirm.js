import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, NativeEventEmitter, NativeModules, ScrollView } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import ApiClient from '../../Api/pay_ApiClient';
import { ActivityIndicator, Surface } from 'react-native-paper';
import HyperSdkReact from "hyper-sdk-react";
import { createOrders, updateOrder } from "../../Redux/Actions/orderAction";
import { deleteCart } from "../../Redux/Actions/cartAction";
import { clearCart } from "../../Redux/Actions/cartItemsAction";


const OrderConfirm = ({ route, navigation }) => {
  const { orderedData,orderdetails } = route.params;
  const dispatch = useDispatch();
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [totalItemCharged, setTotalItemCharged] = useState(0);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [orderItems,setOrderItems]=useState([])


  const getRandomNumber = () => {
    return Math.floor(Math.random() * 90000000) + 10000000;
  };

  const successOrderBooking = async (paymentData) => {
        try {
          navigation.navigate("OrderSuccess", { order_id: paymentData.orderId,orderDetails:orderdetails });
    } catch (error) {
      console.log("error : ", error)
    }
  }

  const unsuccessOrderBooking = async (paymentData, orderInfo) => {
    // const payment_mode=paymentData.paymentMethod;
    try {
          navigation.navigate("OrderAdorded", {order_id: paymentData.order_id,orderDetails:orderdetails });
    } catch (error) {
      console.log("error : ", error)
    }
  }

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact);
    const hyperEventListener = eventEmitter.addListener("HyperEvent", (resp) => {
      const data = JSON.parse(resp);
      const orderId = data.orderId;
      const event = data.event || "";

      switch (event) {
        case "initiate_result":
        case "hide_loader":
          setPaymentLoading(false);
          break;
        case "process_result":
          const status = data.payload?.status || "";
          switch (status) {
            case "backpressed":
            case "user_aborted":
              setPaymentLoading(false)
              unsuccessOrderBooking(data);
              break;
            default:
              setPaymentLoading(false)
              successOrderBooking(data);
          }
          break;
        default:
          console.log(data);
      }
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed()
    );

    return () => {
      hyperEventListener.remove();
      backHandler.remove();
    };
  }, []);



  const startPayment = (orderdetails) => {
    setPaymentLoading(true)
    const payload = {
      order_id: orderdetails.order_id,
    };

    ApiClient.sendPostRequest(
      'https://vaarahimart.com/initiateJuspayPayment',
      payload,
      {
        onResponseReceived: (response) => {
          console.log("valueis" + JSON.stringify(JSON.parse(response).sdk_payload));
          HyperSdkReact.openPaymentPage(JSON.stringify(JSON.parse(response).sdk_payload));
        },
        onFailure: (error) => {
          console.error('POST request failed:', error);
        },
      }
    );

  };

  useEffect(() => {
    const totalQty = orderedData.orderItems.reduce((acc, item) => acc + (item.qty*item.price), 0);
    setTotalItemCharged(totalQty);

    const rrr=orderedData?.total_amt-(orderedData?.discount+0)
    setCheckoutAmount(rrr);
  }, [orderItems]);

  useEffect(()=>{
    setOrderItems(orderedData.orderItems)
    console.log("orderitems:",orderedData.orderItems);
  },[])

  return (
    <View style={styles.container}>
      <ScrollView style={{ alignSelf: "center", width: "80%", backgroundColor: "#F5F5F5", padding: 15, borderLeftWidth: 2, borderRightWidth: 2, borderColor: "#f9f9f9" }}>
        {/* User Name */}
        <Text style={styles.title}>{userInfo?.name}</Text>

        {/* Phone Number */}
        <Text style={styles.info}>{userInfo?.phone_no}</Text>

        {/* Date and Time Slot */}
        <Text style={styles.info}>{orderedData?.date_time_slot}</Text>

        {/* Shipping Address */}
        <Text style={styles.info}>
          {orderedData?.shipping_address?.address_line_one}, {orderedData?.shipping_address?.address_line_two},{"\n"}
          {orderedData?.shipping_address?.city}, {orderedData?.shipping_address?.state}{"\n"} 
          {orderedData?.shipping_address?.pincode}
        </Text>

        {/* Order Items */}
        <View style={styles.itemsContainer}>
          { orderItems.length > 0 ? (
            orderItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemText}>{item.product_name}</Text>
                <Text style={styles.itemText}>x {item.qty}</Text>
                <Text style={styles.itemPrice}>{item.price * item.qty}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItems}>No items found </Text>
          )}
        </View>

        {/* Total Amount */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>AmountCharges</Text>
          <Text style={styles.summaryValue}>{totalItemCharged}</Text>
        </View>

        {/* Discount */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Discount on Items</Text>
          <Text style={styles.summaryValue}>
            {totalItemCharged-orderedData?.total_amt}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Coupon Discount  {orderedData?.coupon_applied}</Text>
          <Text style={styles.summaryValue}>
            {orderedData?.discount}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>GST</Text>
          <Text style={styles.summaryValue}>
            0
          </Text>
        </View>

        {/* Paid Amount */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Paid Amount</Text>
          <Text style={styles.summaryValue}>{checkoutAmount}</Text>
        </View>
      </ScrollView>

      {/* Pay Now Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => startPayment(orderdetails)}
      >
        {paymentLoading ? <ActivityIndicator /> : <Text style={styles.payButtonText}>Pay Now</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "#ffffff",
    alignSelf: "center", justifyContent: "center",
    padding: 16, width: "100%",
  },
  title: {
    fontFamily: "Parkinsans-SemiBold",
    fontSize: 20, color: "#6c290f",
    marginBottom: 10,
  },
  info: {
    fontFamily: "Parkinsans-Regular",
    fontSize: 14, color: "#6c290f",
    marginBottom: 10,
  },
  itemsContainer: {
    marginVertical: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  itemText: {
    fontFamily: "Roboto-Thin",
    flex: 1, color: "black",
  },
  itemPrice: {
    fontFamily: "Roboto-Black",
    flex: 1, color: "#6c290f",
    textAlign: "right",
  },
  noItems: {
    fontFamily: "Roboto-Regular",
    color: "gray", color: "#6c290f",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryText: {
    fontFamily: "Roboto-Thin",
    flex: 1, color: "#6c290f",
  },
  summaryValue: {
    fontFamily: "Roboto-Black",
    flex: 1, color: "#6c290f",
    textAlign: "right",
  },
  payButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  payButtonText: {
    color: "#fff",
    fontFamily: "Roboto-Black",
    fontSize: 16,
  },
});

export default OrderConfirm;
