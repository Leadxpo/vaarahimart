import { SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, Image, Dimensions, View,Alert} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { createCarts, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { fetchProducts } from '../../Redux/Actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import Header from '../../components/userHeader'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createWishlists, deleteWishlist } from '../../Redux/Actions/wishlistAction';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchProductsByCategoryWithPagination } from '../../Redux/Actions/productAction';
import store from '../../Redux/store';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';

export default function AllProducts({ navigation, route }) {
  const [userID, setUserID] = useState("");
  const [productQuery, setProductQuery] = useState(''); // Example caffinData
  const [userWishlist, setUserWishlist] = useState([]);
  const [productCounts, setProductCounts] = useState(0);
  const [isWish, setIsWish] = useState({});
  const { routeProducts, type } = route.params;

  const dispatch = useDispatch();
  const { productsByCategory, hasMoreByCategory, pagesByCategory, loading } = useSelector(state => state.productsPaginationByCategory);
  const PaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.[type]
  );

  const [products, setProducts] = useState(routeProducts || []);
  const [searchData, setSearchData] = useState(routeProducts || []);  // Initialize with routeProducts
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingCartData, cart, error: cartDataError } = useSelector(state => state.cartAdd);
  const isLoggedIn = Boolean(userInfo?.id);
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;

  const onSearchProductQuery = useCallback((query) => {
    setProductQuery(query);
  }, []);

  useEffect(() => {
    if (type === "recent ordered") {
      setSearchData(routeProducts);
    } else {
      dispatch(fetchProductsByCategoryWithPagination(type, 1, 3)); // Fetch next page
      const state = store.getState(); // Assuming you have access to the Redux store
      const categoryPaginatioData = state?.productsPaginationByCategory?.productsByCategory?.[type];
      setSearchData(categoryPaginatioData);
    }
  }, [])

  useEffect(() => {
    if (productQuery.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productQuery.toLowerCase())
      );
      setSearchData(filtered);
    } else {
      setSearchData(products);  // Reset to all products when query is empty
    }
  }, [productQuery, products, cart, carts]);  // Only runs when debounced query or products change

  useEffect(() => {
    if (PaginationData) {
      setSearchData(PaginationData);
    }
  }, [PaginationData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo && userInfo.id) {
          dispatch(getUserById(userInfo.id));
        }
        const fetchTasks = [];
        setUserID(userInfo.id);

        // Initialize the isWish state based on the user's wishlist
        const wishlistState = {};
        const wishlist = JSON.parse(userInfo?.wishList);
        setUserWishlist(wishlist);
        if (wishlist?.length > 0) {
          wishlist.forEach(item => {
            wishlistState[item] = true; // Mark item as wished
          });
        }
        setIsWish(wishlistState);

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
  }, [dispatch]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      // const totalItems = carts.reduce((count, cartItem) => count + cartItem.quantity, 0);
      const updatedCounts = {};
      carts.forEach(cartItem => {
        updatedCounts[cartItem.product_id] = cartItem.qty;
      });
      setProductCounts(updatedCounts); // Update product counts based on cart data
    } 
  }, [carts]); // Only depend on `carts` here, no infinite loop

  useEffect(() => {
    setProducts(routeProducts || []);
    setSearchData(routeProducts || []);  // Sync searchData with routeProducts on change
  }, [routeProducts]);

  const renderProductItem = useCallback(({ item }) => {
    const productCount = cartItems[item.id]?.quantity || 0;
    const isInCart = productCount > 0;
    const discountedPrice = item.product_discount ? Math.round(item.price - (item.price * (parseInt(item.product_discount) / 100))) : item.price;

    const AddNewCart = async (product) => {
      if (isLoggedIn) {
        await dispatch(addToCart(product));
        await dispatch(createCarts(userInfo.id, product));
        await dispatch(fetchCarts(userInfo.id));
      } else {
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
        <TouchableOpacity onPress={() => { navigation.navigate("ProductDetail", { productDetails: item }) }}>

          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity style={{ position: 'absolute', zIndex: 99, top: 10, right: 10 }} onPress={() => {
            // Check if item is in the wishlist

            if (isWish[item.id]) {
              // Item is already in wishlist, remove it
              dispatch(deleteWishlist(userID, item.id));  // Ensure you have userID in your component

            } else {
              // Item is not in wishlist, add it
              dispatch(createWishlists(userID, item.id));  // Passing item as productData
            }

            // Toggle the local wish state
            setIsWish((prevWish) => ({
              ...prevWish,
              [item.id]: !prevWish[item.id], // Toggle wish state
            }));
          }} >
            <MaterialCommunityIcons name={isWish[item.id] ? "heart" : "heart-outline"} size={30} color="red" />
          </TouchableOpacity>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productUnit}>{item.weight}  {item.units}</Text>
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
    )
  },[isWish, cartItems]);
  return (
    <SafeAreaView>

      <View>
        {/* Header Section */}
        <Header onSearchQuery={onSearchProductQuery} showCart={isLoggedIn} />

        <View style={{ marginBottom: 600, }}>
          <Text style={[styles.sectionSubTitle, { alignSelf: 'center', fontSize: 20, fontWeight: "500", textTransform: 'capitalize', margin: 10, color: "#6c290f" }]}>{type}</Text>
          <FlatList
            data={searchData}
            style={{ alignSelf: 'center' }}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ columnGap: 5 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}> Products Not Available</Text></View>}
            onEndReached={() => {
              // Fetch more products if available
              if (hasMoreByCategory[type]) {
                dispatch(fetchProductsByCategoryWithPagination(type, pagesByCategory[type] + 1, 3)); // Fetch next page
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 3,
    marginRight: 16,
    marginBottom: 10,
    alignItems: 'center', // Align the contents at the center
  },
  personalItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, elevation: 3,
  },
  imageContainer: {
    width: '100%', // Ensure image container fills the product item width
    height: 120, // Fixed height for consistent image sizes
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productList: {
    paddingLeft: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 150, // Image should scale to fit within container
    height: 150, // Maintain height within the fixed container
  },
  productName: {
    fontSize: 16,
    color: '#6c290f',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginBottom: 8,
    textAlign: 'center',
  },
  productUnit: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
    textAlign: 'center',
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
    alignSelf: 'center',
    borderRadius: 20,
    width: 80,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },

})