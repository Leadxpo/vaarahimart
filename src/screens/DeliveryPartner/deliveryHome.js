
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequestsbyStaffID } from '../../Redux/Actions/requestAction';
import { fetchAssignedOrder } from '../../Redux/Actions/orderAction';
import { Card, Button, SegmentedButtons } from 'react-native-paper';
import { getDeliveryStaffById } from '../../Redux/Actions/deliveryStaffAction';
import { loadData } from '../../Utils/appData';
import DeliveryHeader from '../../components/deliveryPartnerHeader';
import { fetchNotifications, fetchStaffNotifications } from '../../Redux/Actions/notificationAction';
import Color from '../../utilities/Color';

const DeliveryHome = ({ navigation }) => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState('assignedOrders');
  const { deliveryStaffInfo } = useSelector(state => state.deliveryStaffDetails);
  const { pendingRequests } = useSelector(state => state.pendingRequest);
  const { assignedOrders } = useSelector(state => state.assignedOrders);
  const { staffNotifications } = useSelector(state => state.staffNotifications);
  const [deliveryPartnerID, setDeliveryPartnerID] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const staffData = await loadData("delivryStaffData");
      if (staffData?.id && staffData.staff_id) {
        setDeliveryPartnerID(staffData.staff_id);
        try {
          await dispatch(getDeliveryStaffById(staffData.staff_id));
          await dispatch(fetchPendingRequestsbyStaffID(staffData.staff_id));
          await dispatch(fetchAssignedOrder(staffData.staff_id));
          await dispatch(fetchStaffNotifications(staffData.staff_id));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, deliveryStaffInfo?.id, deliveryStaffInfo?.staff_id]);

  const RenderScene = ({ value }) => {
    switch (value) {
      case 'assignedOrders':
        return (
          assignedOrders.length > 0 ? (
            <FlatList
              data={assignedOrders}
              renderItem={(item) => renderTransaction({ item, type: 'order' })}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<View><Text style={{ color: '#aaaaaa', fontWeight: '600', fontSize: 18 }}>No Assigned Order For Now</Text></View>}
              style={styles.transactionList}
            />
          ) : (
            <View>
              <Text style={{ fontSize: 24, color: '#6c290f', fontWeight: 'bold' }}>No Assigned Orders Data</Text>
            </View>
          )

        );
      case 'pendingRequests':
        return (
          pendingRequests.length ? (
            <FlatList
              data={pendingRequests}
              renderItem={(item) => renderTransaction({ item, type: 'request' })}
              ListEmptyComponent={<View><Text style={{ color: '#aaaaaa', fontWeight: '600', fontSize: 18 }}>No Requests Are Pending As of Now</Text></View>}
              keyExtractor={(item) => item.id.toString()}
              style={styles.transactionList}
            />
          ) : (
            <View>
              <Text style={{ fontSize: 24, color: '#6c290f', fontWeight: 'bold' }}>No Pending Request Data</Text>
            </View>
          )

        );
      default:
        return null;
    }
  };

  const renderTransaction = ({ item, type }) => {
    const isCreditRequest = item.requestType === 'creditAmountRequest';
    const textColor = isCreditRequest ? "green" : "red";
    const shipingAddress = JSON.parse(item.item.shipping_address);
    return (
      <Card style={styles.transactionCard} elevation={4} onPress={() => {
        if (type === 'order') {
          navigation.navigate("TrackDelivery", { orderData: item.item })
        } else {
          navigation.navigate("TrackDelivery", { orderData: item.item })
        }
      }}>
        <Card.Content style={styles.transactionContent}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionNumber}>
              {type === 'order' ? 'ORDER NO:' : 'TRANSACTION NO:'} {type === 'order' ? item.item.order_id : item.item.id}{ }
            </Text>
            <Text style={styles.transactionAmount}>Amount: ₹{type === 'order' ? item.item.total_amt : item.item.requestAmt}</Text>
            {type === 'order' ? (
              <>
                <Text style={{ color: '#6c290f', fontSize: 16, fontWeight: '800' }}>Assigned Date and Time: <Text style={{ color: '#999999' }}>{item.item.Delivery_assign_date}</Text></Text>
                <Text style={{ color: '#6c290f', fontSize: 16, fontWeight: '800' }}>Shipping Address:</Text>
                <View>
                  <Text style={{ color: '#FF7043', fontWeight: '600', textTransform: 'uppercase' }}>
                    {shipingAddress.name}
                  </Text>
                  <Text style={{ color: '#999999', fontWeight: '600' }}>
                    {shipingAddress.address_line_one}
                  </Text>
                  <Text style={{ color: '#999999', fontWeight: '600' }}>
                    {shipingAddress.address_line_two}
                  </Text>
                  <Text style={{ color: '#999999', fontWeight: '600' }}>
                    {shipingAddress.city}, {shipingAddress.state}
                  </Text>
                  <Text style={{ color: '#999999', fontWeight: '600' }}>
                    <Text style={{ color: '#000000' }}>Pincode: </Text>
                    {shipingAddress.pincode},
                    <Text style={{ color: '#000000' }}> Ph.No: </Text>
                    {shipingAddress.phone_no}
                  </Text>
                </View>

              </>
            ) : (
              <>
                <Text>Balance debited against withdrawal request.</Text>
                <Text>Date and Time: {item.item.date_time}</Text>
              </>
            )}
          </View>
          <Text style={[styles.transactionStatus, item.item.status === 'Success' ? styles.success : styles.failed]}>
            {item.item.status}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Header Section */}
      <DeliveryHeader notificationItemCount={0} showNotification={true} title='Vaarahi Mart Staff' ></DeliveryHeader>

      {/* Wallet Balance Section */}
      <Card style={styles.balanceCard}>
        <Text style={styles.headerTitle}>{deliveryStaffInfo?.name}</Text>
        <Text style={styles.caption}>{deliveryStaffInfo?.staff_id}</Text>
        <Card.Content style={styles.balanceContent}>
          <Icon name="wallet" size={40} color="#FF7043" />
          <View>
            <Text style={styles.balanceTitle}>Your Balance</Text>
            <Text style={styles.balanceAmount}>₹{deliveryStaffInfo?.earnedAmount || 0}</Text>
          </View>
        </Card.Content>
        <Button
          mode="contained"
          style={styles.withdrawButton} labelStyle={{ color: '#f9f9f9', fontWeight: '700' }}
          onPress={() => navigation.navigate("WithdrawRequest")}
        >
          WITHDRAW REQUEST
        </Button>
      </Card>
      <SegmentedButtons multiSelect={false} density='regular'
        value={value} style={{ margin: 16, }}
        onValueChange={setValue}
        buttons={[
          {
            value: 'assignedOrders',
            label: 'Assigned Orders',
            checkedColor: '#f9f9f9',
            uncheckedColor: '#6c290f',
            style: [
              styles.button,
              value === 'assignedOrders' ? styles.selectedButton : styles.unselectedButton
            ]
          },
          {
            value: 'pendingRequests',
            label: 'Pending Requests',
            checkedColor: '#f9f9f9',
            uncheckedColor: '#6c290f',
            style: [
              styles.button,
              value === 'pendingRequests' ? styles.selectedButton : styles.unselectedButton
            ]
          }
        ]}
      />
      <View style={{ margin: 20 }}>

        <RenderScene value={value} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7043',
    padding: 16,
    height: 100
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold', textAlign: 'center',
    color: '#6c290f', textTransform: 'capitalize',
    width: "100%", marginStart: -20
  },
  caption: {
    fontSize: 14,
    fontWeight: 'bold', textAlign: 'center',
    color: '#999999',
    width: "100%", marginStart: -20
  },
  balanceCard: {
    margin: 16,
    borderRadius: 10,
    padding: 16, backgroundColor: '#FFF5EE'
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 16,
    marginLeft: 16,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  sectionSubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'green',
  },
  withdrawButton: {
    backgroundColor: '#795548',
    marginTop: 16,
  },
  transactionList: {
    marginBottom: 16,
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionNumber: {
    fontSize: 14,
    fontWeight: 'bold', color: 'red',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 14,
    color: '#388E3C',
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  success: {
    color: '#388E3C',
  },
  failed: {
    color: '#D32F2F',
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#FF7043',

  },
  unselectedButton: {
    backgroundColor: '#FFF5EE',
  },
});

export default DeliveryHome;
