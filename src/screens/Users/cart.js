import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, Image, FlatList, Animated, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { Button, Card, Checkbox, Surface, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons } from '../../Redux/Actions/couponAction';
import { fetchProducts } from '../../Redux/Actions/productAction';
import { createCarts, fetchCartProducts, fetchCarts, removeCartByVarients, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { getUserById } from '../../Redux/Actions/userAction';
import { createRunningOrders } from '../../Redux/Actions/running_orderAction';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';
import { pincodeCheck } from '../../Redux/Actions/pincodeCheck';
import Message from '../../components/message';
import store from '../../Redux/store';

const Cart = ({ navigation, route }) => {
    // Sample data for items
    const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);
    const { loading: loadingcartProducts, cartProducts, error: cartProductsError } = useSelector(state => state.cartProduct);
    const { loading: loadingProducts, products, error: productsError } = useSelector(state => state.products);
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const { loading: loadingPincode, isPincodeExist, error: pincodeError } = useSelector(state => state.pincodeCheck);
    const cartItems = useSelector((state) => state.cartItems.cartItems);
    const [isLoading, setIsLoading] = useState(false);
    let isProcessing = false;
    const [userID, setUserID] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    // State to manage expanded variants
    const [convenienceFee, setConvenienceFee] = useState(0);
    const [expandedItem, setExpandedItem] = useState(null);
    // const animatedHeight = useRef(new Animated.Value(0)).current;
    const [contentHeight, setContentHeight] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCurrentPincode, setIsCurrentPincode] = useState(false);
    const [islogin, setIislogin] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productCounts, setProductCounts] = useState({});
    const [cartData, setCartData] = useState([]);
    const [pincode, setPincode] = useState("");
    const [totalAmt, setTotalAmt] = useState(0)
    const [cartCount, setcartCount] = useState(0)
    const [couponDiscount, setCouponDiscount] = useState(0)
    // Get the passed params, or use defaults if not present
    const applyCoupon = route.params?.CouponData || null; // Default to null if no coupon passed
    const animatedHeights = useRef({}).current;
    const [couponApplied, setCouponApplied] = useState(null);

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

    const getCurrentLocation = async () => {
        setIsCurrentPincode(true)
        try {
            // Fetch location using Google Geolocation API
            const response = await fetch(
                `https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                }
            );

            const data = await response.json();

            if (data.location) {
                const { lat, lng } = data.location;
                // Fetch address details using Google Maps Geocoding API
                const geocodeResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBiBti8gGaR3eZ8ghJA_NExqpbeJUvMfBo`
                );
                const geocodeData = await geocodeResponse.json();

                if (geocodeData.results && geocodeData.results.length > 0) {
                    // Extract postal code from the address components
                    // const addressComponents = geocodeData.results[4].address_components;
                    const addressComponents = geocodeData.results;
                    const postalCode = geocodeData.results.flatMap(result => result.address_components)
                        .find(({ types }) => types.includes('postal_code'))
                        ?.long_name;
                    // const postalCode = addressComponents.find((component) =>
                    //     component.types.includes('postal_code')
                    // )?.long_name;

                    if (postalCode) {
                        setPincode(postalCode)
                    } else {
                        console.warn('Postal code not found');
                    }
                } else {
                    console.warn('No results found for geocoding');
                }
            }
        } catch (error) {
            console.error('Error fetching current location:', error);
            setErrorMsg('Unable to get current location');
        } finally {
            setIsCurrentPincode(false)
        }
    };

    const toggleVariants = (itemId, itemCount) => {
        if (!animatedHeights[itemId]) {
            // Initialize Animated.Value for this item if not already present
            animatedHeights[itemId] = new Animated.Value(0);
        }

        if (expandedItem === itemId) {
            // Collapse the current item
            Animated.timing(animatedHeights[itemId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setExpandedItem(null));
        } else {
            // Expand the clicked item and collapse any previously expanded one
            if (expandedItem && animatedHeights[expandedItem]) {
                Animated.timing(animatedHeights[expandedItem], {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }

            setExpandedItem(itemId);
            Animated.timing(animatedHeights[itemId], {
                toValue: itemCount * 75, // Dynamic height based on the number of variants
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    // Function to remove the entire product from the cart
    const handleRemoveProduct = async (variantID, varients) => {
        console.log("Removing product:", variantID, varients);
        varients.map(async (item) => {
            await dispatch(removeFromCart(item.id));
        })
        await dispatch(removeCartByVarients(userInfo.id, variantID));
        await dispatch(fetchCarts(userInfo.id));
    };

    useEffect(() => {
        // Handle the coupon application logic if coupon data exists
        if (applyCoupon) {
            // Apply the coupon logic here, e.g., setting state, calculating discount, etc.
            setCouponApplied(applyCoupon);

            if (totalAmt > applyCoupon.minAmt) {
                const discount = totalAmt * (parseFloat(applyCoupon.couponDiscount) / 100)
                if (discount > 300) {
                    setCouponDiscount(300);
                } else {
                    setCouponDiscount(discount);
                }
            } else {
                setCouponDiscount(0);
            }
        }
    }, [applyCoupon, couponDiscount, totalAmt]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchTasks = [
                    dispatch(getUserById(userInfo.id))
                ];
                if (userInfo && userInfo.id) {
                    setUserID(userInfo.id);

                    fetchTasks.push(dispatch(fetchCarts(userInfo.id)));
                    fetchTasks.push(dispatch(fetchCartProducts(userInfo.id)));
                } else {
                    islogin(true)
                }
                // await Promise.all(fetchTasks);
                // const cartArray = Object.values(cartItems);

                // if (cartArray && cartArray.length > 0) {
                //     const variantIdSet = new Set(cartArray.map(cartItem => cartItem.product_id));
                //     const uniqueProductsMap = new Map();

                //     products.forEach(product => {
                //         if (variantIdSet.has(product.product_id)) {
                //             // If the product_id is not already in the Map, add it with its variants
                //             if (!uniqueProductsMap.has(product.product_id)) {
                //                 uniqueProductsMap.set(product.product_id, {
                //                     variant_id: product.product_id,
                //                     name: product.name,
                //                     image: product.image,
                //                     brand: product.brand,
                //                     brand_id: product.brand_id,
                //                     category: product.category,
                //                     category_id: product.category_id,
                //                     product_discount: product.product_discount,
                //                     allPrice: 0, // Assuming originalPrice if available
                //                     variants: []  // Initialize an empty array for variants
                //                 });
                //             }

                //             // Add the variant for this product
                //             uniqueProductsMap.get(product.product_id).variants.push({
                //                 id: product.id,
                //                 weight: product.weight,
                //                 units: product.units,
                //                 pack: `${product.weight}${product.units}`,
                //                 price: product.price,
                //                 count: 0,  // Initial count for each variant
                //             });
                //         }
                //     });

                //     // Convert the Map back to an array
                //     const formattedCartData = Array.from(uniqueProductsMap.values());

                // Update the cartData state
                setCartData(cartProducts);
                setcartCount(carts.length)
                // }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }

        };

        fetchData();
    }, [dispatch, carts]);

    useEffect(() => {
        const calculateTotal = () => {
            let total = 0;
            carts.forEach(cartItem => {
                const cartDiscountedPrice = cartItem.product_discount ? Math.round(cartItem.price - (cartItem.price * (parseInt(cartItem.product_discount) / 100))) : cartItem.price;
                total = total + parseInt(cartDiscountedPrice * cartItem.qty);
            });
            setTotalAmt(total); // Update total amount state
        };

        calculateTotal(); // Call the calculation function
    }, [carts]); // Dependency on carts and cartData

    useEffect(() => {
        if (isPincodeExist) {
            console.log("isPincodeExist :", isPincodeExist);
            setMessage("Happy Shopping ---> This Pincode is in our range")
        } else {
            console.log("isPincodeExist :", isPincodeExist);
            setMessage("Sorry ---> This Pincode is not in our range")
        }
    }, [isPincodeExist]);

    const selectDiliveryAddress = () => {
        if (carts.length > 0) {
            setIsLoading(true);
            if (isProcessing) return;
            isProcessing = true;
            const orderData = { orderItems: carts, totalItemPrice: totalAmt, coupon_applied: couponApplied?.code, discount: couponDiscount, total_amt: (totalAmt - couponDiscount + convenienceFee) }
            navigation.navigate("AddressCheckout");
            dispatch(createRunningOrders(orderData));
            setIsLoading(false);
            isProcessing = false;
        } else {
            Alert.alert("Sorry,Can't Proccess this order as No Items Are Added TO The Cart ")
        }
    };
    // useEffect(() => {
    //     getCurrentLocation();
    //     dispatch(pincodeCheck(pincode));
    //     const state = store.getState(); // Assuming you have access to the Redux store
    //     const { isPincodeExist: initialPincodeCheck } = state.pincodeCheck;
    //     if (!initialPincodeCheck) {
    //         Alert.alert("Pincode Denied", "This Pincode was not in out delivery points please try another Pincode")
    //     }
    // }, [isPincodeExist])

    // Rendering each cart item

    const RenderItem = React.memo(({ item }) => {
        const isExpanded = item.product_id === expandedItem;
        // Extract variants from cartData, since cartData already contains variants
        const calculateTotalItemPrice = (item) => {
            let totalPrice = 0;
            item.variants.forEach((variant) => {
                const varientDiscountedPrice = variant.product_discount
                    ? Math.round(variant.price - (variant.price * (parseInt(variant.product_discount) / 100)))
                    : variant.price;
                const matchingCartItem = Array.isArray(carts)
                    ? carts.find(cartItem => String(cartItem.product_id) === String(variant.id))
                    : null;
                const count = matchingCartItem ? matchingCartItem.qty : 0;
                totalPrice += count * varientDiscountedPrice;
            });
            return totalPrice;
        };
        
        const totalItemPrice = useMemo(() => calculateTotalItemPrice(item), [carts]); 
        useEffect(() => {
            setTotalAmt(totalItemPrice);
        }, [totalItemPrice,item.variants]);
        
        const computedHeight = useMemo(() => item.variants.length * 150, [carts]);
        
        useEffect(() => {
            setContentHeight(computedHeight);
        }, [computedHeight]);
        
        // Function to add a new variant to the cart
        return (
            <Surface key={item.product_id} mode="elevated" style={styles.productItem}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: item.image }} style={styles.productImage} resizeMode='contain' />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>₹{totalItemPrice}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <MaterialCommunityIcons
                            name="delete-outline"
                            size={24}
                            color='#f46f2e'
                            style={{ alignSelf: 'flex-end' }}
                            onPress={() => handleRemoveProduct(item.product_id, Variant)}
                        />
                        {item.variants.map((variant, index) => (
                            <Text key={index} style={styles.productUnit}>
                                {variant.count} * {variant.pack}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Variants Button */}
                <TouchableOpacity
                    style={{ width: "100%", height: 40, alignItems: "center", borderColor: "#aaaaaa", borderWidth: 1, borderRadius: 10 }}
                    onPress={() => toggleVariants(item.product_id, item.variants.length)}

                >
                    <View style={{ flexDirection: "row", justifyContent: "center", alignSelf: "center", paddingTop: 10 }}>
                        <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} color={"#333333"} size={22} />
                        <Text style={{ color: "#f46f2e", fontFamily: "Roboto-Bold" }}>
                            Variants
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Collapsible Variants */}
                {isExpanded && (
                    <Animated.View style={[styles.variantsSection, { height: animatedHeights[item.product_id] }]}>
                        {item.variants.map((variant, index) => {
                                    
                            const productCount = cartItems[variant.id]?.quantity || 0;
                            const isInCart = productCount > 0;

                            const AddNewCart = useCallback(async (productData, variant) => {
                                console.log("rrr")
                                const productDatas = {
                                    brand: productData.brand,
                                    product_id: productData.product_id,
                                    brand_id: productData.brand_id,
                                    category: productData.category,
                                    category_id: productData.category_id,
                                    id: variant.id,
                                    image: productData.image,
                                    name: productData.name,
                                    price: variant.price,
                                    product_discount: productData.product_discount,
                                    units: variant.units,
                                    weight: variant.weight,
                                }
                                try {
                                    await dispatch(addToCart(productDatas));
                                    await dispatch(createCarts(userInfo.id, productDatas));
                                    await dispatch(fetchCarts(userInfo.id));
                                } catch (error) {
                                    console.error("Error in increasing  cart:", error);
                                }

                            }, [dispatch,productCount]);
                            // Function to increase the count of an existing variant in the cart
                            const handleAdd = useCallback(async (productData, variant) => {
                                console.log("productData : ",productData);
                                const productDatas = {
                                    brand: productData.brand,
                                    product_id: productData.product_id,
                                    brand_id: productData.brand_id,
                                    category: productData.category,
                                    category_id: productData.category_id,
                                    id: variant.id,
                                    image: productData.image,
                                    name: productData.name,
                                    price: variant.price,
                                    product_discount: productData.product_discount,
                                    units: variant.units,
                                    weight: variant.weight,
                                }
                                try {
                                    await dispatch(updateCartItem(productDatas.id, productCount + 1));
                                    await dispatch(updateCartByProductID(userInfo.id, productDatas, 1));
                                    await dispatch(fetchCarts(userInfo.id));
                                    // setProductCounts((prevCounts) => ({
                                    //   ...prevCounts,
                                    //   [id]: prevCounts[id] + 1,
                                    // }));
                                } catch (error) {
                                    console.error("Error in increasing  cart:", error);
                                }
                            }, [dispatch,productCount]);

                            // Function to decrease the count of an existing variant in the cart
                            const handleRemove = useCallback(async (productData, variant) => {
                                const productDatas = {
                                    brand: productData.brand,
                                    product_id: productData.product_id,
                                    brand_id: productData.brand_id,
                                    category: productData.category,
                                    category_id: productData.category_id,
                                    id: variant.id,
                                    image: productData.image,
                                    name: productData.name,
                                    price: variant.price,
                                    product_discount: productData.product_discount,
                                    units: variant.units,
                                    weight: variant.weight,
                                }
                                try {
                                    if (productCount > 1) {

                                        await dispatch(updateCartItem(productDatas.id, productCount - 1));
                                        await dispatch(updateCartByProductID(userInfo.id, productDatas, -1));
                                        await dispatch(fetchCarts(userInfo.id));
                                    } else {
                                        await dispatch(removeFromCart(productDatas.id));
                                        await dispatch(updateCartByProductID(userInfo.id, productDatas, -1));
                                        await dispatch(fetchCarts(userInfo.id));
                                    }
                                } catch (error) {
                                    console.error("Error in increasing  cart:", error);
                                }
                            }, [dispatch,productCount]);
                            const discountedPrice = item.product_discount ? Math.round(variant.price - (variant.price * (parseInt(item.product_discount) / 100))) : variant.price;


                            return (
                                <View key={index} style={[styles.variantItem, { flex: 1 }]}>
                                    <Text style={{ flex: 1, color: '#6c290f' }}>{variant.pack}</Text>
                                    <Text style={{ flex: 1, color: '#6c290f' }}>₹ {discountedPrice} {item.product_discount >= 1 && <Text style={{ color: 'gray', textDecorationLine: 'line-through', fontSize: 12 }}>₹ {variant.price}</Text>}</Text>

                                    <View style={[styles.variantActions, { flex: 1 }]}>
                                        {cartItems[variant.id]?.quantity > 0 ? (
                                            <View style={styles.counterContainer}>
                                                <TouchableOpacity
                                                    onPress={() => handleRemove(item, variant)}
                                                    style={styles.counterButton}
                                                >
                                                    <Text style={styles.counterButtonText}>-</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.counterText}>{cartItems[variant.id]?.quantity}</Text>
                                                <TouchableOpacity
                                                    onPress={() => handleAdd(item, variant)}
                                                    style={styles.counterButton}
                                                >
                                                    <Text style={styles.counterButtonText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.addButton}
                                                onPress={() => AddNewCart(item, variant)}
                                            >
                                                <Text style={styles.addButtonText}>Add</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </Animated.View>
                )}
            </Surface>
        );
    },[dispatch]);

    return (
        <SafeAreaView>
            <FlatList
                data={cartData}
                renderItem={({ item }) => <RenderItem item={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.product_id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<View><Text style={{ color: '#aaaaaa', fontWeight: '600', fontSize: 18 }}>No Cart Items Added Till Now</Text></View>}
                ListFooterComponent={
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.deliverySlotTitle, { color: '#6c290f', fontFamily: "Parkinsans-SemiBold" }]}>
                                Add Coupon
                            </Text>
                            <Text
                                style={[styles.deliverySlotTitle, { color: 'green' }]}
                                onPress={() => navigation.navigate("Coupons")}
                            >
                                Coupons
                            </Text>
                        </View>

                        {/* Coupon Section */}

                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                label="Enter Coupon Code"
                                style={[
                                    styles.couponInput,
                                    { backgroundColor: "#ffffff" }  // Set background here
                                ]}
                                textColor='#6c290f'
                                mode='outlined'
                                placeholderTextColor={'aaaaaa'}
                                value={couponApplied ? couponApplied.code : ""}
                                outlineColor='#aaaaaa'
                                disabled
                                placeholder='CouponCode'
                            />
                            <Button mode="text" textColor='#f46f2e' style={{ alignSelf: 'center', marginStart: 15, marginVertical: 16, borderColor: "#f46f2e", borderWidth: 1, borderRadius: 5, height: 38, width: 80 }} onPress={() => navigation.navigate("Coupons")}>
                                Apply
                            </Button>
                        </View>

                        <Text onPress={getCurrentLocation} style={{ paddingHorizontal: 30, paddingVertical: 5, fontSize: 12, alignSelf: 'center', color: !isCurrentPincode ? "#f3f3f3" : "#f46f2e", backgroundColor: !isCurrentPincode ? "#f46f2e" : "#f3f3f3", fontWeight: "600", borderColor: "#f46f2e", borderWidth: 1, borderRadius: 10 }}>{!isCurrentPincode ? "Get Current Pincode" : "Searching Pincode ..."}</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                label="Pincode"
                                mode='outlined'
                                value={pincode ? pincode : ""}
                                onChangeText={setPincode}
                                style={[
                                    styles.couponInput,
                                    { backgroundColor: "#ffffff" }  // Set background here
                                ]}
                                placeholder="Pincode please"
                                textColor='#6c290f'
                                placeholderTextColor='#6c290f'
                                outlineColor='#aaaaaa'
                                activeOutlineColor='#6c290f'
                            />
                            <Button mode="text" loading={loadingPincode} textColor='#f46f2e' style={{ alignSelf: 'center', marginStart: 15, marginVertical: 16, borderColor: "#f46f2e", borderWidth: 1, borderRadius: 5, height: 38, width: 80 }} onPress={() => {
                                dispatch(pincodeCheck(pincode));
                                setTimeout(() => {
                                    setShowMessage(true)
                                }, 3000);
                            }}>
                                Check
                            </Button>
                        </View>
                        {showMessage && <Message message={message} type={isPincodeExist ? "normal" : "Error"} />}
                        {/* GST Section */}
                        <Text style={[styles.deliverySlotTitle, { color: '#6c290f', fontFamily: "Parkinsans-SemiBold" }]}>Add GST IN</Text>
                        <TextInput
                            style={styles.gstInput}
                            textColor='#6c290f'
                            mode='outlined'
                            outlineColor='#f46f2e'
                            outlineStyle={{ backgroundColor: "white" }}

                        />
                        {/* Bill Details */}
                        <Text style={[styles.deliverySlotTitle, { color: '#6c290f', fontFamily: "Parkinsans-SemiBold" }]}>Bill Details</Text>

                        <View style={styles.billDetails}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Price</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>₹{totalAmt}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Items</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>{cartCount}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Discount</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>₹ {couponDiscount}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ flex: 2, fontSize: 16, color: "#6c290f" }}>Convenience Fees</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>:</Text>
                                <Text style={{ flex: 1, fontSize: 16, color: "#6c290f" }}>₹ {convenienceFee}</Text>
                            </View>
                            <Surface mode='elevated' style={{ flex: 1, flexDirection: 'row', paddingVertical: 10, borderColor: "#aaaaaa", borderWidth: 2, marginVertical: 10, elevation: 3, backgroundColor: 'white' }}>
                                <Text style={{ color: '#f46f2e', flex: 3, verticalAlign: 'center', fontSize: 18, marginLeft: 10, fontWeight: "700" }}>Total Amount</Text>
                                <Text style={{ color: '#f46f2e', flex: 1, verticalAlign: 'center', fontSize: 18, fontWeight: "700" }}>₹{(totalAmt - couponDiscount + convenienceFee)}</Text>
                            </Surface>
                        </View>

                        {/* Select Address */}
                        <Button mode="contained" loading={isLoading} buttonColor='#f46f2e' textColor='white' style={{ width: 200, alignSelf: 'center' }} labelStyle={{ fontWeight: '600' }} onPress={selectDiliveryAddress}>
                            Set Delivery Address
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
        marginTop: 20,
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
        fontSize: 16, color: "#f46f2e",
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
        marginTop: 8,
        padding: 8,
        backgroundColor: '#f9f9f9',
    },
    variantItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 75, // Set fixed height for each variant item
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    variantActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterContainer: {
        height: 60,
        marginVertical: 20,
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
        color: '#6c290f',
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
        color: "#6c290f",
        width: "70%",
        height: 40,
    },
    gstInput: {
        marginVertical: 16,
        color: "#6c290f",
        width: "100%",
        height: 45,
        marginBottom: 16,
    },
    billDetails: {
        marginVertical: 16,
        color: "#6c290f"
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

export default Cart;
