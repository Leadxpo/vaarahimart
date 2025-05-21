import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Surface, ActivityIndicator } from 'react-native-paper';// Mock Data for Categories and Products
import Header from '../../components/userHeader'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createCarts, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { createWishlists, deleteWishlist } from '../../Redux/Actions/wishlistAction';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchProductsByCategoryWithPagination } from '../../Redux/Actions/productAction';
import store from '../../Redux/store';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';

const Products = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { routeProducts = [],type } = route.params || {};
  const width = Dimensions.get("screen").width;
  // const { productsByCategory, hasMoreByCategory, pagesByCategory, loading } = useSelector(state => state.productsPaginationByCategory);
  // const PaginationData = useSelector(
  //   (state) => state?.productsPaginationByCategory?.productsByCategory?.[type]
  // );
  const [searchData, setSearchData] = useState(routeProducts || []);
  const [productQuery, setProductQuery] = useState('');
  const [productCounts, setProductCounts] = useState({});
  const [isWish, setIsWish] = useState({});
  const [userID, setUserID] = useState('');

  // Redux Selectors
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const { loading: loadingCart, carts } = useSelector(state => state.carts);
  const { userInfo } = useSelector(state => state.userDetails);
  const isLoggedIn = Boolean(userInfo?.id);

  const getItemLayout = (data, index) => ({
    length: width / 2.8,  // Set item width
    offset: (width / 2.8) * index,
    index,
  });

  // Search products based on query
  const onSearchProductQuery = useCallback((query) => {
    setProductQuery(query);
    if (query.length > 0) {
      const filtered = routeProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchData(filtered);
    } else {
      setSearchData(routeProducts);
    }
  }, [routeProducts]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo && userInfo.id) {
          setUserID(userInfo.id);
          // Initialize the isWish state based on the user's wishlist
          const wishlistState = JSON.parse(userInfo.wishList).reduce((acc, itemId) => {
            acc[itemId] = true;
            return acc;
          }, {});
          setIsWish(wishlistState);

          // Fetch cart data
          await dispatch(fetchCarts(userInfo.id));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Update cart and product counts when `carts` changes
  useEffect(() => {
    if (carts && carts.length > 0) {
      const updatedCounts = carts.reduce((acc, cartItem) => {
        acc[cartItem.product_id] = cartItem.qty;
        return acc;
      }, {});
      setProductCounts(updatedCounts);
    }
  }, [carts]);

  // Render Product Item
  const renderProductItem = useCallback(({ item }) => {
    const productCount = cartItems[item.id]?.quantity || 0; 
    const isInCart = productCount > 0;
    const discountedPrice = item.product_discount ? Math.round(item.price - (item.price * (parseInt(item.product_discount) / 100))) : item.price;
    const AddNewCart = async (product) => {
      if (isLoggedIn) {
      await dispatch(addToCart(product));
      await dispatch(createCarts(userInfo.id, product));
      await dispatch(fetchCarts(userInfo.id));
      }else{
        Alert.alert("Login", "You need to log in to add products to the cart.", [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.push("login") }
        ]);
      }
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
      <Surface mode='elevated' style={[styles.productItem, { width: width / 2.3, height: 300 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("ProductDetail", { productDetails: item })}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity
            style={{ position: 'absolute', zIndex: 99, top: 10, right: 10 }}
            onPress={() => toggleWishlist(item.id)}
          >
            <MaterialCommunityIcons
              name={isWish[item.id] ? "heart" : "heart-outline"}
              size={30} color="red"
            />
          </TouchableOpacity>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productUnit}>{item.weight} {item.units}</Text>
          <Text style={styles.productPrice}>₹ {discountedPrice} {item.product_discount >= 1 && <Text style={{ color: 'gray', textDecorationLine: 'line-through', fontSize: 12 }}>₹ {item.price}</Text>}</Text>
          {isInCart ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity onPress={() => handleRemove(item)} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{productCount}</Text>
              <TouchableOpacity onPress={() => handleAdd(item)} style={styles.counterButton}>
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => AddNewCart(item)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Surface>
    );
  }, [isWish, cartItems]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (isWish[productId]) {
      dispatch(deleteWishlist(userID, productId));
    } else {
      dispatch(createWishlists(userID, productId));
    }

    // Toggle wish state locally
    setIsWish((prevWish) => ({
      ...prevWish,
      [productId]: !prevWish[productId],
    }));
  };
  useEffect(() => {
  }, [routeProducts, searchData]);
  
  return (
    <SafeAreaView>
      <View>
        <Header onSearchQuery={onSearchProductQuery} showCart={isLoggedIn} />
        <View style={{ marginBottom: 250 }}>
          <Text style={styles.header}>{type}</Text>
          {Array.isArray(searchData) && searchData.length > 0 ? (
            <FlatList
              data={searchData}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{ columnGap: 10 }}
              ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>No Products Added For this Brand</Text></View>}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              getItemLayout={getItemLayout}
            />
          ) : (
            <View>
              <Text>Sorry ... {'\n'}No data Found</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
    alignSelf: "center",
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  personalItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, elevation: 3,
  },
  productImage: {
    width: 100,
    height: 120,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    color: '#6c290f',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
  },
  productUnit: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
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
    width: 80, height: 40
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center'
  },

});

export default Products;
