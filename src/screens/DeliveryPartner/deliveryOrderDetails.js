import React,{ useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Linking,Modal } from 'react-native';
import { Card, Text, Button, Menu, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

const DeliveryOrderDetails = ({ navigation, route }) => {
  const { loading: loadingorder, order, error: orderError } = useSelector(state => state.orderDetails);

  // Sample items data
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const { orderData } = route.params;
  const handleCloseModal = () => {
    setShowOTP(false);
  };
  const handleOk = () => {
    setShowOTP(false);
  };
   
  
  // Function to initiate the phone call
  // const makePhoneCall = (phoneNumber) => {
  //   const args = {
  //     number: phoneNumber, // String value with the number to call
  //     prompt: true, // Boolean to show the prompt before the call
  //   };
  //   call(args).catch(console.error); // Handling errors
  // };
  
  // Render each item in FlatList
  const renderItem = ({ item }) => {
    const price=((item.price * item.qty)-((item.price * item.qty)*((item.product_discount /100))))
    return(
    <Card style={styles.itemCard}>
      <Card.Content style={styles.itemContent}>
        {/* Display item image (placeholder icons used) */}
        <Icon name={item.image === 'pomegranate' ? 'fruit-pomegranate' : 'fruit-banana'} size={40} color="#E65100" />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemWeight}>{item.weight} {item.units}</Text>
          <Text style={styles.itemPrice}>{price}</Text>
        </View>
        <Text style={styles.itemQuantity}>Quantity: {item.qty}</Text>
      </Card.Content>
    </Card>
  )};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-left" size={28} color="#fff" onPress={() => { }} />
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      {/* Order Info */}
      <Card style={styles.orderCard}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order Id: { orderData.id}</Text>
            <Text style={styles.orderDate}>Order on: { orderData.createdAt}</Text>
          </View>
          <Text>Payment type: {orderData.payment_mode}</Text>
          <Text>Total Amount: ₹{orderData.paid_amt}</Text>
          <Text>Customer Shipping Details:</Text>
          <Text>{orderData.name}</Text>
          <Text>{orderData.shipping_address.address_line_one}</Text>
          <Text>{orderData.shipping_address.address_line_two}</Text>
          <Text>{orderData.shipping_address.city}, {orderData.shipping_address.state}</Text>
          <Text>{orderData.shipping_address.pincode}</Text>
          <Text>{orderData.shipping_address.phone_no}</Text>

          {/* Call Button */}
          <Button
            icon={() => <Icon name="phone" size={20} color="#D84315" />}
            onPress={() => makePhoneCall('9874563424')}
            mode="text"
            labelStyle={{ color: '#D84315' }}
          >
            Call To Customer
          </Button>
        </Card.Content>
      </Card>

      {/* Slot Timings */}
      <Text style={styles.slotText}>Slot Timings: {orderData.date_time_slot}</Text>

      {/* Items Section */}
      <Text style={styles.itemsTitle}>No of Items:{orderData.order_items.length}</Text>
      <FlatList
        data={orderData.order_items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>Itemsnot Available For This Order</Text></View>}
        style={styles.itemsList}
      />

      {/* Total Amount */}
      <Text style={styles.totalAmount}>Total Amount: ₹{orderData.paid_amt}</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          style={styles.directionButton}
          onPress={() => navigation.navigate("deliveryTracker")}
        >
          Get Direction
        </Button>

        <Menu
          visible={false}
          onDismiss={() => { }}
          anchor={
            <Button mode="outlined" icon="truck-delivery" onPress={()=>setShowOTP(true)}>
              Shipped
            </Button>
          }
        >
          {/* Additional status options */}
        </Menu>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOTP}
        onRequestClose={handleOk}
      >
        <View style={styles.modalBackground}>
          <View style={styles.bottomSheet}>
            <Text style={styles.deliverySlotTitle}>Delivery Order OTP</Text>
            <TextInput
              label="Enter Delivery OTP"
              style={styles.gstInput}
              mode='outlined'
              outlineColor='#f46f2e'
              value={OTP}
              onChangeText={setOTP}
              outlineStyle={{ backgroundColor: "white" }}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addButton} onPress={handleLoginAlert}>
                <Text style={styles.addButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7043',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  orderCard: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  slotText: {
    fontSize: 16,
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemsList: {
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemWeight: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    color: '#388E3C',
  },
  itemQuantity: {
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionButton: {
    backgroundColor: '#FF7043',
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignSelf: 'center',
  },
  modalInfo: {
    alignItems: 'center'
    , padding: 10,
    marginTop: 16,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white"
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c290f',
  },
  modalProductUnit: {
    fontSize: 14,
    color: 'gray',
  },
  modalProductPrice: {
    fontSize: 14,
    color: 'green',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  moveCartButton: {
    backgroundColor: '#f46f2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: '#fff',
    borderColor: '#f46f2e',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#f46f2e',
    fontWeight: 'bold',
  },
  buttonCartText: {
    color: '#f3f3f3',
    fontWeight: 'bold',
  },

});

export default DeliveryOrderDetails;
