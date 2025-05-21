import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

const DeliveryOrders =({ navigation, route }) => {
  // Sample data
  const { loading: loadingAssignedOrder, assignedOrder, error: AssignedOrderError } = useSelector(state => state.assignedOrder);
  const { loading: loadingDeliveryPartnerData, deliveryInfo, error: DeliveryPartnerDataError } = useSelector(state => state.deliveryDetails);
  const [deliveryPartnerID, setDeliveryPartnerID] = useState('');
  const dispatch = useDispatch();

  // Define background colors for different statuses
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#E0C853'; // Light yellow background
      case 'Cancelled':
        return '#F44336'; // Red background
      case 'Delivered':
        return '#4CAF50'; // Green background
      default:
        return '#FFFFFF'; // Default white background
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (deliveryInfo?.id) {
        setDeliveryPartnerID(deliveryInfo.id);
        try {
          await dispatch(getDeliveryStaffById(deliveryInfo.staff_id));
          await dispatch(fetchAssignedOrder(deliveryInfo.staff_id));
        } catch (error) {
          console.log("error : ", error);
        }
      }
    };
    fetchData();
  }, [dispatch, deliveryPartnerID]);


  const OrderCard = ({ order }) => {
    return (
      <Card style={styles.card} onPress={NavigationContainer.naviagate("deliveryOrderDetails", { orderData: order })}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.orderId}>Order Id: {order.id}</Text>
            <Text style={styles.orderDate}>Order on: {order.createdAt}</Text>
          </View>
          <Text>Payment type: {order.payment_mode}</Text>
          <Text>Customer Details:</Text>
          <Text>{order.name}</Text>
          <Text>{order.shipping_address}</Text>
          <Text>{order.phone_no}</Text>
          <Text style={styles.slotBooking}>Slot Booking Timings: {order.date_time_slot}</Text>
          <Button
            mode="contained"
            style={[styles.statusButton, { backgroundColor: getStatusBackgroundColor(order.status) }]}
            labelStyle={styles.statusButtonText}
          >
            {order.status}
          </Button>
        </Card.Content>
      </Card>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>All Orders</Text>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D84315',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  slotBooking: {
    fontSize: 12,
    marginTop: 8,
  },
  statusButton: {
    marginTop: 10,
    borderRadius: 5,
  },
  statusButtonText: {
    color: '#FFF',
  },
});

export default DeliveryOrders;
