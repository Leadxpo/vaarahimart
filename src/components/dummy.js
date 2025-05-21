import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, Animated, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Button, Card, Checkbox, Surface, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons } from '../../Redux/Actions/couponAction';
import { fetchProducts } from '../../Redux/Actions/productAction';
import { createCarts, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';

const Cart = () => {
    // Sample data for items
    const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);
    const { loading: loadingProducts, products, error: productsError } = useSelector(state => state.products);
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);

    const dispatch = useDispatch();
    // State to manage expanded variants
    const [expandedItem, setExpandedItem] = useState(null);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [islogin, setIislogin] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleCancelOrder = () => {
        setIsModalVisible(false);
    };
    const handleLoginAlert = () => {
        setIislogin(false);
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsModalVisible(true);
    };

    // Expand/Collapse variants section
    const toggleVariants = (itemId) => {
        if (expandedItem === itemId) {
            // Collapse
            Animated.timing(animatedHeight, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setExpandedItem(null));
        } else {
            // Expand
            setExpandedItem(itemId);
            Animated.timing(animatedHeight, {
                toValue: contentHeight, // Adjust height as per your need
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    // Handling quantity add/remove logic for variants
    const handleAdd = (itemId, variantPack) => {
        const updatedCart = cartData.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    variants: item.variants.map((variant) =>
                        variant.pack === variantPack
                            ? { ...variant, count: variant.count + 1 }
                            : variant
                    ),
                };
            }
            return item;
        });
        setCartData(updatedCart);
    };

    const handleRemove = (itemId, variant) => {
        const updatedCart = carts.map((item) => {
            if (item.id === itemId) {
                return {
                    ...item,
                    variants: item.variants.map((variant) =>
                        variant.pack === variantPack && variant.count > 0
                            ? { ...variant, count: variant.count - 1 }
                            : variant
                    ),
                };
            }
            return item;
        });
        setCartData(updatedCart);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchTasks = [
                    dispatch(fetchProducts()),
                    dispatch(fetchCoupons()),
                ];
                if (userInfo && userInfo.id) {
                    setUserID(userInfo.id);
                    fetchTasks.push(dispatch(getUserById(userInfo.id)));
                    fetchTasks.push(dispatch(fetchCarts(userInfo.id)));
                }
                await Promise.all(fetchTasks);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, [dispatch, userInfo]);


    // Rendering each cart item
    const renderItem = ({ item }) => {
        const isExpanded = item.id === expandedItem;
        const Variant = products
            .filter((variantItem) => variantItem.product_id === item.variant_id)
            .map((filteredItem) => {
                return {
                    ...filteredItem,      // Copy existing properties of the item
                    count: 0,   // Add your new key-value pair here
                };
            });
            const varientItemcounts = Variant.length
            setContentHeight(varientItemcounts * 80);
            return (
            <Surface key={item.id} mode="elevated" style={styles.productItem}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.productName}>{item.name}</Text>

                        <Text style={styles.productPrice}>₹{item.price}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color='#f46f2e' style={{ alignSelf: 'flex-end' }} onPress={() => handleSelectItem(item)} />
                        {
                            Variant.map((item) => (
                                <Text style={styles.productUnit}>{item.count} * {item.weight}{item.units}</Text>
                            ))
                        }
                    </View>
                </View>

                {/* Variants Button */}
                <Button
                    mode="text"
                    onPress={() => toggleVariants(item.id)}
                    icon={() => <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} />}
                >
                    Variants
                </Button>

                {/* Collapsible Variants */}
                {isExpanded && (
                    <Animated.View style={[styles.variantsSection, { height: animatedHeight }]} >
                        {Variant.map((variant, index) => (
                            <View key={index} style={[styles.variantItem, { flex: 1 }]}>
                                <Text style={{ flex: 1 }}>{variant.weight} {variant.units}</Text>
                                <Text style={{ flex: 1 }}>₹{variant.price}</Text>
                                <View style={[styles.variantActions, { flex: 1 }]}>
                                    {variant.count > 0 ? (
                                        <View style={styles.counterContainer}>
                                            <TouchableOpacity
                                                onPress={() => handleRemove(item.id, variant)}
                                                style={styles.counterButton}
                                            >
                                                <Text style={styles.counterButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.counterText}>{variant.count}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleAdd(item.id, variant.units)}
                                                style={styles.counterButton}
                                            >
                                                <Text style={styles.counterButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAdd(item.id, variant.pack)}
                                        >
                                            <Text style={styles.addButtonText}>Add</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                )}
            </Surface>
        );
    };

    return (
        <SafeAreaView>
            <FlatList
                data={carts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListFooterComponent={
                    <View>
                        <Text style={styles.deliverySlotTitle}>Add Coupon</Text>
                        {/* Coupon Section */}

                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                label="Enter Coupon Code"
                                style={styles.couponInput}
                                mode='outlined'
                                outlineColor='#f0f0f0'
                                outlineStyle={{ backgroundColor: "white" }}

                            />
                            <Button mode="text" textColor='#f46f2e' style={{ alignSelf: 'center', marginStart: 15, marginVertical: 16, borderColor: "#f46f2e", borderWidth: 1, borderRadius: 5, height: 38, width: 80 }}>
                                Apply
                            </Button>
                        </View>
                        {/* GST Section */}
                        <Text style={styles.deliverySlotTitle}>Add GST IN</Text>
                        <TextInput
                            label="Enter GST IN"
                            style={styles.gstInput}
                            mode='outlined'
                            outlineColor='#f46f2e'
                            outlineStyle={{ backgroundColor: "white" }}

                        />
                        {/* Bill Details */}
                        <Text style={styles.deliverySlotTitle}>Bill Details</Text>

                        <View style={styles.billDetails}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16 }}>Price</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>₹210</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16 }}>Items</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>3</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16 }}>Discount</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>₹20</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16 }}>Convenience Fees</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16 }}>₹10</Text>
                            </View>
                            <Surface mode='elevated' style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, borderColor: "#f46f2e", borderWidth: 1, marginVertical: 10, elevation: 3, backgroundColor: 'white' }}>
                                <Text style={{ flex: 3, verticalAlign: 'center', fontSize: 18, marginLeft: 10, fontWeight: "700" }}>Total Amount</Text>
                                <Text style={{ flex: 1, verticalAlign: 'center', fontSize: 18, fontWeight: "700" }}>₹200</Text>
                            </Surface>
                        </View>

                        {/* Select Address */}
                        <Button mode="contained" buttonColor='#f46f2e' textColor='white' style={{ width: 200, alignSelf: 'center' }} labelStyle={{ fontWeight: '600' }}>
                            Select Address
                        </Button>
                    </View>
                }
            />
            {selectedItem && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.bottomSheet}>
                            <Text style={{ fontSize: 16, textAlign: 'center', margin: 5, color: 'gray' }}>
                                Are You Sure you want to delete from wishlist
                            </Text>
                            <Surface style={[styles.productItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <Image source={{ uri: selectedItem.image }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{selectedItem.name}</Text>
                                    <Text style={styles.productUnit}>{selectedItem.pack}</Text>
                                </View>
                                <Text style={[styles.productPrice, { fontWeight: '600' }]}>{selectedItem.price}</Text>
                            </Surface>
                            <View style={styles.modalActions}>

                                <TouchableOpacity style={styles.moveCartButton} onPress={handleCancelOrder}>
                                    <Text style={styles.addButtonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.removeButton} onPress={handleCancelOrder}>
                                    <Text style={styles.buttonText}>cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={islogin}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.bottomSheet}>
                        <Text style={{ fontSize: 16, textAlign: 'center', margin: 5, color: 'gray' }}>
                            You have not login in yet please login to process yor Order
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.addButton} onPress={handleLoginAlert}>
                                <Text style={styles.addButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    deliverySlotTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c290f',
        marginVertical: 10,
    },
    productItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        elevation: 3,
    },
    productImage: {
        width: 100,
        height: 90,
        marginRight: 16,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: 'green',
    },
    productUnit: {
        fontSize: 12,
        color: 'gray',
        paddingHorizontal: 5,
        margin: 8,
    },
    variantsSection: {
        overflow: 'hidden',
        marginTop: 8,
        padding: 8,
        backgroundColor: '#f9f9f9',
    },
    variantItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    variantActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#333',
    },
    addButton: {
        backgroundColor: '#f46f2e',
        width: 100,
        height: 35,
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 16,
    },
    addButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    couponInput: {
        marginVertical: 16,
        width: "70%",
        height: 40,
    },
    gstInput: {
        marginVertical: 16,
        width: "100%",
        height: 40,
    },
    gstInput: {
        marginBottom: 16,
    },
    billDetails: {
        marginVertical: 16,
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
        color: '#333',
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

export default Cart;
