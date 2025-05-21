import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { Card, Divider, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchOrders } from '../../Redux/Actions/orderAction';
import { fetchTickets } from '../../Redux/Actions/ticketAction';

const Tickets = ({ navigation }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const { loading: loadingOrder, orders, error: orderError } = useSelector(state => state.orders);
  const { loading: loadingTicket, tickets, error: ticketError } = useSelector(state => state.tickets);
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const dispatch = useDispatch();
  const [userID, setUserID] = useState('');

  const renderOrdertItem = ({ item }) => {
    var isrepaly = null;
if (item.reply) {
    isrepaly=true
} else {
    isrepaly=false
}
    return (
      <Surface mode='elevated' style={[styles.productItem, { width: width / 1.2 }]} >
        <TouchableOpacity style={{ width: "100%" }} onPress={() => { navigation.navigate("TicketRaise", { orderDetails: item }) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.productStatus}>{item.order_id}</Text>
            <Text style={styles.productStatus}>{item.status}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[styles.productUnit,{color:isrepaly ? "green" : "red",fontWeight:'600'}]}>Reply</Text>
            <Text style={styles.productPrice}>{item.createdAt}</Text>
          </View>
        </TouchableOpacity>
      </Surface>
    )
  };

  const renderTicketItem = ({ item }) => (
    <View style={styles.card} key={item.id} >
      <View style={styles.cardContent}>
        {/* Avatar Image */}
        <Avatar.Image size={50} source={{ uri: item.image }} />
        <View style={styles.textContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      {/* 'Show Details' Button */}
      <TouchableOpacity style={styles.showDetailsButton} onPress={() => { navigation.navigate("ticketDetails", { TicketDetails: item }) }}>
        <Text style={styles.showDetailsText}>Show Details</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#D35400" />
      </TouchableOpacity>
    </View>
  );


  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setUserID(userInfo.id);
        try {
          await dispatch(getUserById(userInfo.id));
          await dispatch(fetchOrders(userInfo.id));
          await dispatch(fetchTickets(userInfo.id));
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
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productList]}
      />
      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
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
    marginBottom: 8,
  },

});

export default Tickets;
