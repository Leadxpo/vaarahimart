import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Surface } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchAddresses } from '../../Redux/Actions/addressAction';
import { updateRunningOrder } from '../../Redux/Actions/running_orderAction';

export default function AddressCheckout({ navigation }) {

    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const { loading: loadingRunningOrder, orderData, error: RunningOrderError } = useSelector(state => state.runningOrder);
    const { loading: loadingAddressesData, addresses, error: AddressesError } = useSelector(state => state.addresses);
    const [isLoading, setIsLoading] = useState(false);
    let isProcessing = false;
    const [userID, setUserID] = useState("");
    // const [shippingAddress, setShippingAddress] = useState(null); // Shipping Address state
    // const [billingAddress, setBillingAddress] = useState(null); // Billing Address state
    const dispatch = useDispatch();

    const handleAddressSelect = useCallback((addressType) => {
        navigation.navigate('Address', { addressType });
    }, [navigation]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchTasks = [];
                if (userInfo && userInfo.id) {
                    setUserID(userInfo.id);
                    fetchTasks.push(dispatch(getUserById(userInfo.id)));
                    fetchTasks.push(dispatch(fetchAddresses(userInfo.id)));
                }
                await Promise.all(fetchTasks);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, [dispatch, userID]);


    const shippingAddress = useMemo(() =>
        addresses.find((item) => String(item.id) === String(userInfo?.shiping_address)),
        [addresses, userInfo?.shiping_address]
    );

    const billingAddress = useMemo(() =>
        addresses.find((item) => String(item.id) === String(userInfo?.billing_address)),
        [addresses, userInfo?.billing_address]
    );

    const slotboooking = () => {
        if (shippingAddress) {
            setIsLoading(true);
            if (isProcessing) return;
            isProcessing = true;
            const orderData = { shipping_address: shippingAddress, billing_address: billingAddress }
            dispatch(updateRunningOrder(orderData))
            navigation.navigate("Checkout")
            setIsLoading(false);
            isProcessing = false;
        } else {
            Alert.alert("Sorry, Shipping Address is mandatory to deliver this order");
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginStart: 20 }}>
                        <MaterialCommunityIcons name="map" size={24} color="gray" />
                        <Text style={[styles.detailText, { fontWeight: "500", color: "#000000" }]}>Billing Amount</Text>
                    </View>
                    <Surface style={{ flexDirection: 'row', justifyContent: 'center', margin: 20, backgroundColor: 'white' }}>
                        <Text style={{ fontWeight: "500", verticalAlign: 'center', padding: 10, color: '#f46f2e' }}>You Pay Amount   : <Text style={{ fontWeight: "700" }}>Rs {orderData ? orderData.total_amt : 0}</Text></Text>
                    </Surface>
                    <Text style={[styles.subTitle, { margin: 20, color: "#6c290f" }]}>Billing Address</Text>
                    <View style={styles.addressDetails}>
                        {billingAddress ? (
                            <View>
                                <Text style={[styles.addressText, { fontWeight: '900' }]}>{billingAddress.name}</Text>
                                <Text style={styles.addressText}>{billingAddress.address_line_one}</Text>
                                <Text style={styles.addressText}>{billingAddress.address_line_two}</Text>
                                <Text style={styles.addressText}>{billingAddress.city}</Text>
                                <Text style={styles.addressText}>{billingAddress.state}</Text>
                                <Text style={styles.addressText}>{billingAddress.pincode}</Text>
                                <Text style={styles.addressText}>{billingAddress.phone_no}</Text>
                            </View>

                        ) : (
                            <View>
                                <Text style={styles.addressText}>No Billing Address</Text>
                            </View>
                        )
                        }
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.editButton, { paddingHorizontal: 20 }]} onPress={() => handleAddressSelect('billing')}>
                                <Text style={styles.buttonText}>{billingAddress ? "Change Billing Adderess" : "Add BIlling Address"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.removeButton, { paddingHorizontal: 20 }]}
                                onPress={() => {
                                    billingAddress ? navigation.navigate("EditAddress", { addressData: billingAddress }) : Alert.alert("Billing Address Not Found", "please add billing address before editing")
                                }}
                            >
                                <Text style={styles.removeButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.subTitle, { margin: 20, color: "#6c290f" }]}>Shipping Address</Text>
                    <View style={styles.addressDetails}>
                        {shippingAddress ? (
                            <View>
                                <Text style={[styles.addressText, { fontWeight: 900 }]}>{shippingAddress.name}</Text>
                                <Text style={styles.addressText}>{shippingAddress.address_line_one}</Text>
                                <Text style={styles.addressText}>{shippingAddress.address_line_two}</Text>
                                <Text style={styles.addressText}>{shippingAddress.city}</Text>
                                <Text style={styles.addressText}>{shippingAddress.state}</Text>
                                <Text style={styles.addressText}>{shippingAddress.pincode}</Text>
                                <Text style={styles.addressText}>{shippingAddress.phone_no}</Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.addressText}>No Shipping Address</Text>
                            </View>
                        )
                        }
                        < View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.editButton, { paddingHorizontal: 20 }]} onPress={() => handleAddressSelect('shipping')}>
                                <Text style={styles.buttonText}>{shippingAddress ? "Change Shipping Adderess" : "Add Shipping Address"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.removeButton, { paddingHorizontal: 20 }]}
                                onPress={() => {
                                    shippingAddress ? navigation.navigate("EditAddress", { addressData: shippingAddress }) : Alert.alert("Shipping Address Not Found", "please add shippig address before editing")
                                }}
                            >
                                <Text style={styles.removeButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.proceedButton} onPress={slotboooking}>
                        {isLoading && <ActivityIndicator size="large" color="#f46f2e" />}
                        <Text style={styles.buttonText}>Set Delivery Slot</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    addressContainer: {
        marginVertical: 20,
    },
    detailText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: '600'
    },
    addressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#f46f2e"
    },
    addressDetails: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        width: "90%",
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 3,
    },
    addressText: {
        fontSize: 16, color: "#6c290f",
        marginBottom: 5,
    },
    billDetails: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 3,
    },
    detailRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 15,
        fontWeight: '700'
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#D35400',
        padding: 8, height: 35,
        borderRadius: 5,
    },
    proceedButton: {
        backgroundColor: '#D35400',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 60,
        alignSelf: 'center',
        borderRadius: 5,
    },
    removeButton: {
        borderColor: '#D35400',
        borderWidth: 1,
        padding: 8, height: 35,
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

})