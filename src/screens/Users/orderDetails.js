import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StepIndicator from 'react-native-step-indicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, getOrderDetail } from '../../Redux/Actions/orderAction';
import { getUserById } from '../../Redux/Actions/userAction';
import EstimateTemplate from '../../components/estimateTemplate';

const orderSteps = ['pending', 'orderAccept', 'outForDelivery', 'packageReached', 'delivered'];
const labels = ['Pending', 'Order Accept', 'Out for Delivery', 'Package Reached', 'Delivered'];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#d32f2f',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#d32f2f',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#d32f2f',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#d32f2f',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#d32f2f',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ffffff',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#d32f2f'
};

const OrderDetails = ({ navigation, route }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [stepCount, setStepCount] = useState(0);
    const { orderData } = route.params;
    const dispatch = useDispatch();

    const { userInfo } = useSelector(state => state.userDetails);
    const { order } = useSelector(state => state.orderDetails);

    useEffect(() => {
        const fetchOrderData = async () => {
            if (userInfo?.id && orderData?.id) {
                try {
                    await dispatch(getUserById(userInfo.id));
                    await dispatch(getOrderDetail(userInfo.id, orderData.id));
                } catch (error) {
                    console.error('Error fetching order data:', error);
                }
            }
        };

        fetchOrderData();
    }, [dispatch, userInfo, orderData]);

    useEffect(() => {
        if (order) {
            setShippingAddress(order.shipping_address ? JSON.parse(order.shipping_address) : {});
            setOrderItems(order.order_items ? JSON.parse(order.order_items) : []);

            switch (order.status) {
                case 'orderAccept':
                    setStepCount(1);
                    break;
                case 'outForDelivery':
                    setStepCount(2);
                    break;
                case 'packageReached':
                    setStepCount(3);
                    break;
                case 'delivered':
                    setStepCount(4);
                    break;
                default:
                    setStepCount(0);
            }
        }
    }, [order]);

    const orderCancel = () => {
        if (userInfo?.id && order?.id) {
            Alert.alert(
                'Order Cancellation Request',
                `Do you want to cancel the order with ID: ${order.id}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        onPress: () => dispatch(deleteOrder(userInfo.id, order.id))
                    }
                ]
            );
        }
    };

    const renderOrderItem = ({ item }) => (
        <Surface style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.productDetails}>{`${item.weight} ${item.units} `}</Text>
                <Text style={styles.productDetails}>{`Qty: ${item.qty}`}</Text>
                <Text style={styles.productPrice}>Paid: ₹{item.price}</Text>
            </View>
        </Surface>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
                <View style={styles.stickyHeader}>
                    <Text style={styles.otpText}>Request OTP: {order?.otp}</Text>
                </View>
                <EstimateTemplate data={order}/>
                <View style={styles.contentContainer}>
                    {/* Step Indicator */}
                    <View style={styles.stepContainer}>
                        {order?.status !== 'cancel' ? (
                            <StepIndicator
                                customStyles={customStyles}
                                currentPosition={stepCount}
                                labels={labels}
                                stepCount={5}
                            />
                        ) : (
                            <View style={styles.cancelledOrderContainer}>
                                <Text style={styles.cancelledOrderText}>This Order was Canceled</Text>
                            </View>
                        )}
                    </View>

                    <Paragraph onPress={()=>{navigation.navigate("TicketRaise",{orderDetails:order})}} style={{color:"#000000", fontWeight:"600",fontSize:12,padding:8,elevation:1,backgroundColor:"#fff"}}>Have you faced Any problem with this order Click here..  <Text style={{color:'#f46f2e'}} >Raise Ticket</Text></Paragraph>

                    {/* Order Details */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <DetailRow icon="card-account-details" label="Order ID" value={order?.id} />
                            <DetailRow icon="calendar-range" label="DateTime" value={order?.date_time_slot} />
                            <DetailRow icon="currency-rupee" label="Amount" value={`₹${order?.paid_amt}`} />
                            <DetailRow icon="credit-card-outline" label="Payment Mode" value={order?.payment_mode} />
                        </Card.Content>
                    </Card>

                    {/* Shipping Address */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={{color:"#aaaaaa", fontWeight:"bold"}}>Shipping Address</Title>
                            <Paragraph style={{color:"#33333", fontWeight:"600"}}>{shippingAddress.name}</Paragraph>
                            <Paragraph>{shippingAddress.address_line_one}, {shippingAddress.address_line_two}</Paragraph>
                            <Paragraph>{`${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`}</Paragraph>
                            <Paragraph>{`Phone: ${shippingAddress.phone_no}`}</Paragraph>
                        </Card.Content>
                    </Card>

                    {/* Order Items */}
                    <Text style={styles.totalItemsText}>Total Ordered Items: {orderItems.length}</Text>
                    <FlatList
                        data={orderItems}
                        renderItem={renderOrderItem}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={<Text style={styles.emptyListText}>No items found for this order.</Text>}
                    />
                </View>

                {order?.status !== 'cancel' && (
                    <Button
                        mode="contained"
                        onPress={orderCancel}
                        style={styles.cancelButton}
                        labelStyle={styles.cancelButtonText}
                    >
                        Cancel Order
                    </Button>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <View style={styles.detailLabelContainer}>
            <MaterialCommunityIcons name={icon} size={22} color="#333" />
            <Text style={styles.detailLabel}>{label}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
)    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        width: '95%',
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5, alignSelf: 'center',
        elevation: 5, // For Android shadow
    },
    stickyHeader: {
        backgroundColor: '#f46f2e',
        padding: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    cancelButton: {
        backgroundColor: '#ddd', borderRadius: 0,
        textAlignVertical: 'center',
    },
    productItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        padding: 8,
        elevation: 3,
        margin: 8,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c290f',
    },
    productUnit: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    addressCard: {
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: "white"
    },
    itemImage: {
        fontSize: 40,
        marginRight: 16,
    },
    itemDetails: {
        flex: 2,
    },
    price: {
        fontWeight: 'bold',
        color: 'green',
    },
    itemTotal: {
        fontWeight: 'bold',
        color: 'red',
    },
    list: {
        paddingBottom: 16,
    },
    otpButton: {
        margin: 16, // Padding from the sides
        alignSelf: 'center', // Centers the button horizontally
        borderRadius: 25, // Optional, makes the button rounded
        color: '#f3f3f3',
        fontWeight: 'bold',
        fontSize: 18
    },
    otpText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    contentContainer: {
        padding: 20,
    },
    stepContainer: {
        marginBottom: 20,
    },
    cancelledOrderContainer: {
        alignItems: 'center',
        padding: 10,
    },
    cancelledOrderText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    detailRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#6c290f',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailLabel: {
        marginLeft: 10,
        fontSize: 14,color:"#666666",
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,fontWeight:"600",
        color: '#333334'
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c290f',
    },
    productDetails: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ddd',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'red',
    }
});

// const styles = StyleSheet.create({
    
//     productItem: {
//         flexDirection: 'row',
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 10,
//         marginVertical: 5,
//         elevation}
//     });

export default OrderDetails;
