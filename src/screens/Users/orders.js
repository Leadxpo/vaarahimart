import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchOrders } from '../../Redux/Actions/orderAction';
import { createCarts, createReOrderedCarts, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';
import { Surface, Appbar, } from 'react-native-paper';
export default function Orders({ navigation }) {
    const [showOTP, setShowOTP] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const handleCloseModal = () => {
        setShowOTP(false);
    };

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cartItems.cartItems);

    const [userID, setUserID] = useState('');
    const { loading: loadingOrder, orders, error: orderError } = useSelector(state => state.orders);
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);

    const reorder = async (orderItems) => {
        const rrr = JSON.parse(orderItems);
        setShowOTP(true)
        setSelectedOrderItems(rrr);
        // rrr.map(async (productData) => {
        //     const sss=carts.find((item)=>productData.product_id===item.product_id);
        //     if(sss){
        //         try {
        //             await dispatch(addToCart(productData));
        //             await dispatch(createReOrderedCarts(productData));
        //         } catch (error) {
        //             console.error(`Error adding product to cart: ${error}`);
        //         }
        //     }
        // })
        // await dispatch(fetchCarts(userInfo.id));

        // navigation.push("Cart")

    }

    const renderOrderItem = ({ item }) => {
        const productCount = cartItems[item.product_id]?.quantity || 0;
        const isInCart = productCount > 0;
        const rrr = {
            brand: item.brand,
            product_id: item.variant_id,
            brand_id: item.brand_id,
            category: item.category,
            category_id: item.category_id,
            id: item.product_id,
            image: item.image,
            name: item.product_name,
            price: item.price,
            product_discount: item.product_discount,
            units: item.units,
            weight: item.weight,

        }
        const AddNewCart = async (product) => {
            await dispatch(addToCart(product));
            await dispatch(createCarts(userInfo.id, product));
            await dispatch(fetchCarts(userInfo.id));
        };

        // Handle Increment 
        const handleAdd = async (product) => {
            await dispatch(updateCartItem(product.id, productCount + 1));
            await dispatch(updateCartByProductID(userInfo.id, product, 1));
            await dispatch(fetchCarts(userInfo.id));

        };

        // Handle Decrement
        const handleRemove = async (product) => {
            if (productCount > 1) {
                await dispatch(updateCartItem(product.id, productCount - 1));
                await dispatch(updateCartByProductID(userInfo.id, product, -1));
                await dispatch(fetchCarts(userInfo.id));

            } else {
                await dispatch(removeFromCart(product.id));
                await dispatch(updateCartByProductID(userInfo.id, product, -1));
                await dispatch(fetchCarts(userInfo.id));

            }
        };

        return (
            <TouchableOpacity>
                <Surface style={styles.productItem}>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{item.product_name}</Text>
                        <Text style={styles.productUnit}>{item.units} {item.weight}</Text>
                        <Text style={{ color: '#6c290f' }}>Each Item Price   :  <  Text style={styles.productPrice}>{item.price} /-</Text></Text>
                    </View>
                    {isInCart ? (
                        <View style={styles.counterContainer}>
                            <TouchableOpacity onPress={() => handleRemove(rrr)} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{productCount}</Text>
                            <TouchableOpacity onPress={() => handleAdd(rrr)} style={styles.counterButton}>
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addButton} onPress={() => AddNewCart(rrr)}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    )}
                </Surface>
            </TouchableOpacity>
        )
    };


    const orderDetails = (orderedData) => {
        navigation.push("OrderDetails", {
            orderData: orderedData
        })
    }

    const renderOrder = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.detailRow}>
                <View style={{ flexDirection: 'row', flex: 3 }}>
                    <MaterialCommunityIcons name="card-account-details" size={22} color="#333" />
                    <Text style={[styles.detailText, { fontWeight: "500" }]}>OrderID</Text>
                </View>
                <Text style={[styles.detailText, { flex: 1 }]}>{item.id}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={{ flexDirection: 'row', flex: 3 }}>
                    <MaterialCommunityIcons name="calendar-range" size={22} color="#333" />
                    <Text style={[styles.detailText, { fontWeight: "500" }]}>DateTime</Text>
                </View>
                <Text style={[styles.detailText, { flex: 1 }]}>{item.date_time_slot}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={{ flexDirection: 'row', flex: 3 }}>
                    <MaterialCommunityIcons name="currency-rupee" size={22} color="#333" />
                    <Text style={[styles.detailText, { fontWeight: "500", }]}>Amount</Text>
                </View>
                <Text style={[styles.detailText, { flex: 1, fontWeight: "700" }]}>₹ {item.paid_amt}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={{ flexDirection: 'row', flex: 3 }}>
                    <MaterialCommunityIcons name="credit-card-outline" size={22} color="#333" />
                    <Text style={[styles.detailText, { fontWeight: "500" }]}>PaymentMode</Text>
                </View>
                <Text style={[styles.detailText, { flex: 1 }]}>{item.payment_mode}</Text>
            </View>
            <View style={styles.detailRow}>
                <View style={{ flexDirection: 'row', flex: 3 }}>
                    <MaterialCommunityIcons name="list-status" size={22} color="#333" />
                    <Text style={[styles.detailText, { fontWeight: "500" }]}>Status</Text>
                </View>
                <Text style={[styles.detailText, { flex: 1 }]}>{item.status}</Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => reorder(item.order_items)}>
                    <Text style={styles.buttonText}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => orderDetails(item)} >
                    <Text style={styles.removeButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );


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
    }, [dispatch]);


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action
                    icon="arrow-left"
                    onPress={() => navigation.goBack()} // Handle back navigation
                    style={{ backgroundColor: "#f3f3f3", borderColor: "#aaaaaa30", borderWidth: 2 }}
                    color="#6c290f"
                />
                <Appbar.Content
                    title="VaarahiMart Orders"
                    titleStyle={{ fontFamily: "Parkinsans-SemiBold" }}
                />
            </Appbar.Header>
            <View style={{ flex: 1, marginTop: 20 }}>
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<View><Text style={{ color: '#aaaaaa', fontWeight: '600', fontSize: 18 }}>Product Items Added for This Order</Text></View>}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showOTP}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.bottomSheet}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                            <TouchableOpacity style={styles.addButton} onPress={() => setShowOTP(false)}>
                                <Text style={styles.addButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("Cart")}>
                                <Text style={styles.addButtonText}>Cart</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={selectedOrderItems}
                            renderItem={renderOrderItem}
                            ListEmptyComponent={<View><Text style={{ color: '#aaaaaa', fontWeight: '600', fontSize: 18 }}>No Orders Done By This User </Text></View>}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.list}
                        />
                        <View style={styles.modalActions}>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        backgroundColor: "#f6f6f6",
        textAlign: 'center', borderBottomWidth: 3, borderColor: "#f1f1f130"
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#D35400',
        padding: 10,
        borderRadius: 5,
        width: 80
    },
    removeButton: {
        borderColor: '#D35400',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    removeButtonText: {
        color: '#D35400',
        fontWeight: 'bold',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c290f',
    },
    productUnit: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 14, fontWeight: '600',
        color: 'green',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    counterButton: {
        backgroundColor: '#f46f2e',
        padding: 6,
        borderRadius: 10,
        width: 30,
        alignItems: 'center',
    },
    counterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    counterText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#6c290f',
    },
    addButton: {
        backgroundColor: '#f46f2e',
        padding: 6,
        alignSelf: 'center', justifyContent: 'center',
        borderRadius: 20,
        width: 90,
        height: 48,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },

});
