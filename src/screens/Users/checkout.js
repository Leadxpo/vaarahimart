import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { RadioButton, Surface, Modal } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { updateRunningOrder } from '../../Redux/Actions/running_orderAction';
import store from '../../Redux/store';
import { createOrders } from '../../Redux/Actions/orderAction';

const Checkout = ({ navigation, route }) => {
  const [selectedSlot, setSelectedSlot] = useState('Today');
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [todayOpen, setTodayOpen] = useState(false);
  const [tomorrowOpen, setTomorrowOpen] = useState(false);
  const [userID, setUserID] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [orderItems, setOrderItems] = useState([])
  const [orderDiscount, setOrderDiscount] = useState(0)
  const [convenienceFee, setConvenienceFee] = useState(10);
  const [totalAmt, setTotalAmt] = useState(0);
  const [totalItemsAmt, setTotalItemsAmt] = useState(0);
  const [todaySlot, setTodaySlot] = useState(null);  // Time options for dropdown
  const [tomorrowSlot, setTomorrowSlot] = useState(null);  // Time options for dropdown
  const [dateSlot, setDateSlot] = useState(null);  // Time options for dropdown
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderedData, setOrderedData] = useState([]);

  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingRunningOrder, orderData, error: RunningOrderError } = useSelector(state => state.runningOrder);
  const dispatch = useDispatch();
  const [items, setItems] = useState([
    { label: '10:00 AM', value: '10:00 AM' },
    { label: '12:00 PM', value: '12:00 PM' },
    { label: '2:00 PM', value: '2:00 PM' },
    { label: '4:00 PM', value: '4:00 PM' },
    { label: '6:00 PM', value: '6:00 PM' },
  ]);

  // Show or hide calendar
  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
    setSelectedSlot("date");
  };

  const placeOrder = async () => {
    let date = null;
    let time = null;

    if (selectedSlot === "Today") {
      date = new Date();  // Current date
      time = todaySlot;
    } else if (selectedSlot === "Tomorrow") {
      date = new Date();
      date.setDate(date.getDate() + 1);  // Increment date by 1 for tomorrow
      time = tomorrowSlot;
    } else if (selectedSlot === "date") {
      date = new Date(selectedDate); // Ensure selectedDate is parsed as a Date object
      time = dateSlot;
    } else {
      date = '00-00-00';
      time = '00:00';
    }

    // Helper function to format date as yyyy-mm-dd
    const formatDate = (date) => {
      if (!(date instanceof Date)) return date;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure month is 2 digits
      const day = String(date.getDate()).padStart(2, '0'); // Ensure day is 2 digits
      return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(date);
    const formattedTime = time || '00:00';

    const updatedOrderData = {
      billing_address: deliveryAddress,
      date_time_slot: `${formattedDate}_${formattedTime}`
    };

    if (
      deliveryAddress &&
      formattedDate &&
      formattedDate !== "Invalid Date" &&
      formattedDate !== "NaN-NaN-NaN" &&
      formattedTime !== "00:00"
    ) {
      try {
        await dispatch(updateRunningOrder(updatedOrderData));
        const state = store.getState(); // Assuming you have access to the Redux store
        const orderInfo = state.runningOrder.orderData;
        if (orderInfo.date_time_slot) {
          await dispatch(createOrders(userInfo.id, userInfo.name, userInfo.phone_no, orderInfo));
          const state = store.getState(); // Assuming you have access to the Redux store
        const orderedData = state.orderAdd.order;
          navigation.navigate("orderConfirm",{orderedData:orderInfo,orderdetails:orderedData});
        }

      } catch (error) {
        console.log("error :", error)
      }finally{

      }
    } else {
      Alert.alert("sorry,You didn't set the Order Slot time")
    }
  };

  // Handle date selection from calendar
  const handleDateChange = (day) => {
    setSelectedDate(day.dateString);
    toggleCalendar();
  };

  useEffect(() => {
    const fetchData = async () => {

      if (orderData) {
        setDeliveryAddress(orderData.shipping_address);
        setOrderItems(orderData.orderItems)
        setOrderDiscount(orderData.discount)
        setConvenienceFee(orderData.discount)
        setTotalItemsAmt(orderData.totalItemPrice)
        setTotalAmt(orderData.total_amt)
      }
      try {
        const fetchTasks = [];
        if (userInfo && userInfo.id) {
          setUserID(userInfo.id);
          fetchTasks.push(dispatch(getUserById(userInfo.id)));
        }
        await Promise.all(fetchTasks);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [dispatch, userID]);



  return (
    <ScrollView style={styles.container}>
      {/* Delivery Address */}
      <View style={styles.addressContainer}>
        <View style={styles.addressDetails}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.addressTitle}>Delivery: <Text style={{ fontWeight: '600', fontSize: 18, color: "#f46f2e" }}>{deliveryAddress?.name}</Text></Text>
            <Icon name="pencil" size={24} color='#f46f2e' style={{ alignSelf: 'flex-end' }} />
          </View>
          <View>
            <Text style={styles.addressText}>{deliveryAddress?.address_line_one}</Text>
            <Text style={styles.addressText}>{deliveryAddress?.address_line_two}</Text>
            <Text style={styles.addressText}>{deliveryAddress?.city}</Text>
            <Text style={styles.addressText}>{deliveryAddress?.state}</Text>
            <Text style={styles.addressText}>{deliveryAddress?.pincode}</Text>
            <Text style={styles.addressText}>{deliveryAddress?.phone_no}</Text>
          </View>
        </View>
      </View>

      {/* Bill Details */}
      <View style={styles.billDetails}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Price</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f", fontWeight: "700" }}>₹{totalItemsAmt}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Items</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f", fontWeight: "700" }}>{orderItems?.length}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Discount</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f", fontWeight: "700" }}>₹{orderDiscount}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Convenience Fees</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#6c290f", fontWeight: "700" }}>₹{convenienceFee}</Text>
        </View>
        <Surface mode='elevated' style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, borderColor: "#f46f2e", borderWidth: 1, marginVertical: 10, elevation: 3, backgroundColor: 'white' }}>
          <Text style={{ flex: 3, verticalAlign: 'center', fontSize: 18, marginLeft: 10, fontWeight: "700", color: '#f46f2e' }}>Total Amount</Text>
          <Text style={{ flex: 1, verticalAlign: 'center', fontSize: 18, fontWeight: "700", color: '#f46f2e' }}>₹{totalAmt}</Text>
        </Surface>
      </View>


      {/* Select Delivery Slot */}
      <Text style={styles.deliverySlotTitle}>Select Delivery Slot</Text>

      <View style={styles.deliveryOptions}>
        <RadioButton.Group onValueChange={newValue => { setSelectedSlot(newValue) }} value={selectedSlot}>
          <Pressable style={styles.radioOption} onPress={() => setSelectedSlot("Today")}>
            <Text style={{ flex: 1, color: '#000000', }}>Today</Text>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
              }}>
              <DropDownPicker
                open={todayOpen}
                value={todaySlot}
                items={items}
                dropDownDirection='TOP'
                setOpen={setTodayOpen}
                onPress={() => setSelectedSlot("Today")}
                setValue={setTodaySlot}
                setItems={setItems}
                placeholder={'Time Slot'}
                style={{
                  borderColor: '#f46f2e',  // Sets the border color for the dropdown
                }}
                dropDownContainerStyle={{
                  borderColor: '#f46f2e',  // Sets the border color for the opened dropdown
                }}
              />
            </View>
            <RadioButton.Item mode='android' color='#f46f2e' value="Today" style={{ flex: 1 }} />
          </Pressable>

          <Pressable style={styles.radioOption} onPress={() => setSelectedSlot("Tomorrow")}>
            <Text style={{ flex: 1, color: '#000000', }}>Tomorrow</Text>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 15,
              }}>
              <DropDownPicker
                open={tomorrowOpen}
                value={tomorrowSlot}
                items={items}
                dropDownDirection='TOP'
                onPress={() => setSelectedSlot("Tomorrow")}
                setOpen={setTomorrowOpen}
                setValue={setTomorrowSlot}
                setItems={setItems}
                placeholder={'Time Slot'}
                style={{
                  borderColor: '#f46f2e',  // Sets the border color for the dropdown
                }}
                dropDownContainerStyle={{
                  borderColor: '#f46f2e',  // Sets the border color for the opened dropdown
                }}
              />
            </View>
            <RadioButton.Item mode='android' color='#f46f2e' value="Tomorrow" style={{ flex: 1 }} />

          </Pressable>

          <Pressable style={styles.otherDate} onPress={() => setSelectedSlot("date")}>
            <Text style={styles.deliverySlotTitle}>Select Other Date</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity onPress={toggleCalendar} style={styles.dateButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Select Date"
                  value={selectedDate}
                  placeholderTextColor={"#aaaaaa"}
                  editable={false}
                  onPress={() => setSelectedSlot("date")}
                  pointerEvents="none"
                />
                <Icon name="calendar" size={24} color="gray" />
              </TouchableOpacity>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 15,
                }}>
                <DropDownPicker
                  open={open}
                  value={dateSlot}
                  dropDownDirection='TOP'
                  items={items}
                  onPress={() => setSelectedSlot("date")}
                  setOpen={setOpen}
                  setValue={setDateSlot}
                  setItems={setItems}
                  placeholder={'Time Slot'}
                  style={{
                    borderColor: '#f46f2e', width: "100%" // Sets the border color for the dropdown
                  }}
                  textStyle={{ fontSize: 13 }}
                  dropDownContainerStyle={{
                    borderColor: '#f46f2e',  // Sets the border color for the opened dropdown
                  }}
                />
              </View>
              <RadioButton.Item mode='android' color='#f46f2e' value="date" style={{ flex: 1 }} />

            </View>
          </Pressable>
        </RadioButton.Group>
      </View>

      {/* Select Other Date */}

      {/* Custom Calendar */}
      {isCalendarVisible && (
        <Calendar
          style={styles.calendar}
          onDayPress={handleDateChange}
          markedDates={{
            [selectedDate]: {
              selected: true,
              marked: true,
              selectedColor: '#f46f2e'
            },
          }}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#FF6F00',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF6F00',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#FF6F00',
            selectedDotColor: '#ffffff',
            arrowColor: '#FF6F00',
            monthTextColor: '#2d4150',
          }}
        />
      )}

      {/* Proceed To Pay Button */}
      <TouchableOpacity style={styles.proceedButton} onPress={placeOrder}>
        <Text style={styles.proceedButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  addressContainer: {
    marginVertical: 20,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#f46f2e"
  },
  addressDetails: {
    borderColor: '#ddd',
    padding: 15, 
    backgroundColor:"#ffffff",
    borderRadius:6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    elevation: 3,
  },
  addressText: {
    fontSize: 16,
    color: "#6c290f",
    marginBottom: 5,
  },
  billDetails: {
    marginBottom: 20,
    borderColor: '#ddd',
    padding: 15, color: "#6c290f",
    shadowColor: '#000',backgroundColor:"#ffffff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0.5,borderRadius:6,
    elevation: 3,
  },
  billText: {
    fontSize: 16,
    marginBottom: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  deliverySlotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f46f2e',
    marginBottom: 10,
  },
  deliveryOptions: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, flex: 1
  },
  picker: {
    width: '50%',
    height: 40,
  },
  otherDate: {
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '38%',
    justifyContent: 'space-between',
  },
  input: {
    width: '80%', color: "#6c290f"
  },
  calendar: {
    borderRadius: 10,
    padding: 10,
    color: "#6c290f",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  proceedButton: {
    backgroundColor: '#f46f2e',
    padding: 15,
    borderRadius: 5,
    marginBottom: 100,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1, height: 500,
    justifyContent: 'flex-end',
    backgroundColor: 'red',
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

});

export default Checkout;
