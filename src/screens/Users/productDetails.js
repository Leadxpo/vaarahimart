import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Animated, Dimensions, ScrollView, Alert } from 'react-native';
import { Button, Surface,MD3Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { productById } from '../../Redux/Actions/productAction';
import { createCarts, updateCart, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { productsByCategoryId } from '../../Redux/Actions/categoryAction';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';

const { height, width } = Dimensions.get('screen');

const ProductDetail = ({ navigation, route }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [expandedItem, setExpandedItem] = useState(false);
  const [productData, setProductData] = useState({});
  const [productVariants, setProductVariants] = useState([]);
  const [userID, setUserID] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const { productDetails } = route.params;
  const [productCounts, setProductCounts] = useState({});

  const dispatch = useDispatch();
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingProductData, productInfo, error: productDataError } = useSelector(state => state.productInfo);
  const { loading: loadingcatProducts, catProducts, error: catProductsError } = useSelector(state => state.categoryProducts);
  const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const productCount = cartItems[productData.id]?.quantity || 0;
  const isInCart = productCount > 0;

  const isLoggedIn = Boolean(userInfo?.id);

  const toggleVariants = () => {
    if (expandedItem) {
      // Collapse
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedItem(false));
    } else {
      // Expand
      setExpandedItem(true);
      Animated.timing(animatedHeight, {
        toValue: 100, // Adjust height as per content
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const AddNewCart = async (productData) => {
    if (isLoggedIn) {
      try {
        await dispatch(addToCart(productData));
        await dispatch(createCarts(userInfo.id, productData));
        await dispatch(fetchCarts(userInfo.id));
        } catch (error) {
        console.error(`Error adding product to cart: ${error}`);
      }
    } else {
      Alert.alert("Login", "You need to log in to add products to the cart.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.push("login") }
      ]);
    }
  };

  const handleAdd = async (productData) => {
    try {
      await dispatch(updateCartItem(productData.id, productCount + 1));
      await dispatch(updateCartByProductID(userInfo.id, productData, 1));
      await dispatch(fetchCarts(userInfo.id));
      // setProductCounts((prevCounts) => ({
      //   ...prevCounts,
      //   [id]: prevCounts[id] + 1,
      // }));
    } catch (error) {
      console.error("Error in increasing  cart:", error);
    }
  };

  const handleRemove = async (productData, id) => {
    if (productCount > 1) {
      await dispatch(updateCartItem(productData.id, productCount - 1));
      await dispatch(updateCartByProductID(userInfo.id, productData, -1));
      await dispatch(fetchCarts(userInfo.id));

    } else {
      await dispatch(removeFromCart(productData.id));
      await dispatch(updateCartByProductID(userInfo.id, productData, -1));
      await dispatch(fetchCarts(userInfo.id));
    }
  };

  const renderRelatedProduct = ({ item }) => (
    <Surface key={item.id} style={styles.relatedProductItem}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => { navigation.replace("ProductDetail", { productDetails: item }) }}>
        <Image  source={item.image ? { uri: item.image } : require('../../utilities/images/logo.png')} style={styles.relatedProductImage} defaultSource={require('../../utilities/images/logo.png')} />
        <Text style={styles.relatedProductName}>{item.name}</Text>
        <Text style={styles.relatedProductPrice}>₹ {item.price}</Text>
      </TouchableOpacity>
    </Surface>
  );
  useEffect(() => {
    setProductData(productDetails || []);
    setDiscountPrice(productDetails.product_discount ? parseInt(productDetails.price) - (parseInt(productDetails.price) * (parseInt(productDetails.product_discount) / 100)) : parseInt(productDetails.price));  // Sync searchData with productDetails on change
  }, [productDetails]);

  useEffect(() => {
    setUserID(userInfo.id)
    const fetchData = async () => {
      try {
        const fetchTasks = [
          dispatch(productsByCategoryId(productDetails.category_id)),
          dispatch(productById(productDetails.id)),
        ];
        // Fetch recent orders only if user is logged in (i.e., userID exists)
        if (userID) {
          fetchTasks.push(dispatch(fetchCarts(userID)));
        }

        await Promise.all(fetchTasks);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [dispatch, userID]);

  useEffect(() => {
    if (productInfo && productInfo.product) {

      setProductData(productInfo.product || []);
      setSelectedVariant(
        productInfo.product.units && productInfo.product.weight
          ? productInfo.product.units + productInfo.product.weight
          : ''
      );

      const price = parseInt(productInfo.product.price);
      const discount = parseInt(productInfo.product.product_discount);

      setDiscountPrice(
        price && discount
          ? price - (price * (discount / 100))
          : price
      );  // Sync searchData with productDetails on change

      setProductVariants(productInfo.productVariants || []);
    }
  }, [productInfo]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      // const totalItems = carts.reduce((count, cartItem) => count + cartItem.quantity, 0);
      const updatedCounts = carts.reduce((acc, cartItem) => {
        acc[cartItem.product_id] = cartItem.qty;
        return acc;
      }, {});
      setProductCounts(updatedCounts);
    }

  }, [carts]); // Only depend on `carts` here, no infinite loop

  return (
    <View style={styles.container}>
      {/* Product Image Section */}
      <ScrollView style={styles.contentContainer}>
        <Surface style={[styles.imageContainer,]}>
          <Image source={productData.image ? { uri: productData.image } : require('../../utilities/images/logo.png')} resizeMode='stretch' style={styles.productImage} defaultSource={require('../../utilities/images/logo.png')} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
        </Surface>
        <View style={{ flex: 1, padding: 16 }}>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{productData.name}</Text>
            <Text style={styles.productWeight}>{productData.weight + " " + productData.units}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.productPrice}>₹{discountPrice}</Text>
              {productData.product_discount && <Text style={styles.strikethrough}>₹{productData.price}</Text>}
            </View>

            {/* Variant Selection */}
            <View style={styles.variantContainer}>
              <Button mode="outlined" onPress={toggleVariants}>
                {selectedVariant || productData.weight + productData.units}
                <MaterialCommunityIcons name={expandedItem ? 'chevron-up' : 'chevron-down'} size={24} />
              </Button>

              {expandedItem && (
                <Animated.View style={[styles.variantsSection, { height: animatedHeight }]}>
                  {productVariants.map((variant, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const pack = variant.weight + variant.units
                        setSelectedVariant(pack);
                        setProductData(variant)
                        setDiscountPrice(variant.product_discount ? parseInt(variant.price) - (parseInt(variant.price) * (parseInt(variant.product_discount) / 100)) : variant.price);  // Sync searchData with productDetails on change
                        toggleVariants();
                      }}
                      style={styles.variantItem}
                    >
                      <Text style={{color:MD3Colors.neutral30}}>{variant.weight + " " + variant.units}</Text>
                      <Text style={{color:MD3Colors.neutral30,fontWeight:600}}>₹ {variant.price}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>

            {/* Product Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.productDescription}>{productData.description}</Text>

            {/* Related Products */}
            <Text style={styles.sectionTitle}>Related Products</Text>
            <FlatList
              horizontal
              data={catProducts}
              renderItem={renderRelatedProduct}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedProductsList}
            />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Sticky Section */}
      <View style={styles.bottomContainer}>
        {
          productCount > 0 ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => handleRemove(productData)} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{productCount}</Text>
              <TouchableOpacity onPress={() => handleAdd(productData)} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => AddNewCart(productData)} style={[styles.counterButton, { height: 40, paddingHorizontal: 30, alignSelf: 'center' }]}>
              <Text style={styles.counterButtonText}>Add</Text>
            </TouchableOpacity>
          )
        }

        <Button mode="contained" disabled={productCounts[productData.id] > 0 ? false : true} style={styles.addToCartButton}>
          Amount - ₹{(discountPrice * (productCounts[productData.id] ? productCounts[productData.id] : 0)).toFixed(2)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: height * 0.4,
    width: width, elevation: 5
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 8,
    borderRadius: 50,
  },
  contentContainer: {
    flex: 1,
  },
  productInfo: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6c290f',
  },
  productWeight: {
    fontSize: 16,
    color: '#888',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  strikethrough: {
    marginLeft: 8,
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  variantContainer: {
    marginVertical: 16,
  },
  variantsSection: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  relatedProductsList: {
    paddingVertical: 8,
  },
  relatedProductItem: {
    width: 140,
    marginRight: 16,
    padding: 8,
    backgroundColor: '#ffffff',
    elevation: 3,
    borderRadius: 8,
    alignItems: 'center',
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c290f',
  },
  relatedProductPrice: {
    fontSize: 14,
    color: '#28a745',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    padding: 10,
    backgroundColor: '#f46f2e',
    borderRadius: 5,
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  counterText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',color:"#6c290f"
  },
  addToCartButton: {
    backgroundColor: '#f46f2e',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default ProductDetail;
