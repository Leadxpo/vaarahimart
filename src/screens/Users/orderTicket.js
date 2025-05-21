import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { Divider, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchOrders } from '../../Redux/Actions/orderAction';

const OrderTickets = ({ navigation }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const { loading: loadingOrder, orders, error: orderError } = useSelector(state => state.orders);
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const dispatch = useDispatch();
  const [userID, setUserID] = useState('');

  const renderOrdertItem = ({ item }) => {
    const orderItems = item.order_items.length
    return (
      <Surface mode='elevated' style={[styles.productItem, { width: width / 1.2 }]} >
        <TouchableOpacity style={{ width: "100%" }} onPress={() => { navigation.navigate("TicketRaise", { orderDetails: item }) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.productName}>{item.id}</Text>
            <Text style={styles.productStatus}>{item.status}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.productUnit}>{item.date_time_slot}</Text>
            <Text style={styles.productUnit}>{orderItems}</Text>
            <Text style={styles.productPrice}>{item.paid_amt}</Text>
          </View>
        </TouchableOpacity>
      </Surface>
    )
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setUserID(userInfo.id);
        try {
          await dispatch(getUserById(userInfo.id));
          await dispatch(fetchOrders(userInfo.id));
        } catch (error) {
          console.log("error : ", error);
        }
      }
    };

    fetchData();
  }, [dispatch, userID]);


  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginVertical: 10, color: "#6c290f", fontWeight: '300' }}>Select Issued Order to raise ticket </Text>
      <Divider style={{ height: 1, width: width, marginVertical: 10, backgroundColor: '#f5f5f5' }}></Divider>
      <FlatList
        data={orders}
        renderItem={renderOrdertItem}
        ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>Tickets Not Yet Raised By This Users</Text></View>}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productList]}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  productList: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 3, marginVertical: 10,
    marginRight: 16,
  },
  personalItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, elevation: 3,
  },
  productName: {
    fontSize: 16,
    color: '#6c290f',
    marginBottom: 4,
    fontWeight: '700'
  },
  productStatus: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'red',
    marginBottom: 8,
  },
  productUnit: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
  },

});

export default OrderTickets;
