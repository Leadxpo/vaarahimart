import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/userHeader'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions, SafeAreaView, Alert } from 'react-native';
import { ActivityIndicator, Avatar, Card, Divider, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper'
import StepIndicator from 'react-native-step-indicator';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../Redux/store';
import { fetchBanners } from '../../Redux/Actions/bannerAction';
import { fetchProducts, fetchProductsByCategoryWithPagination } from '../../Redux/Actions/productAction';
import { fetchCategories } from '../../Redux/Actions/categoryAction';
import { fetchBrands } from '../../Redux/Actions/brandAction';
import { fetchCoupons } from '../../Redux/Actions/couponAction';
import { fetchPromos } from '../../Redux/Actions/promoAction';
import { fetchRecent_Orders } from '../../Redux/Actions/recentOrdersAction';
import { createCarts, fetchCartProducts, fetchCarts, updateCartByProductID } from '../../Redux/Actions/cartAction';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchAddresses } from '../../Redux/Actions/addressAction';
import { deleteRunningOrder } from '../../Redux/Actions/running_orderAction';
import { useFocusEffect } from '@react-navigation/native';
import { fetchNotifications } from '../../Redux/Actions/notificationAction';
import { addToCart, removeFromCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';
import EstimateTemplate from '../../components/estimateTemplate';
import { fetchOrders } from '../../Redux/Actions/orderAction';

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;


const labels = ["pending", "packing", "ontheway", "delivered"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#ffffff',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}

export default function Home({ navigation }) {

  const [isorder, setIsOrder] = useState("none")
  const [recentOrdersData, setRecentOrdersData] = useState([]); // Example MostPurchasedData
  const [delightItemData, setDelightItemData] = useState([]); // Example MostPurchasedData
  const [bakkingItemData, setBakingItemData] = useState([]); // Example bakkingItemData
  const [caffinData, setCaffinData] = useState([]); // Example caffinData
  const [breakfastData, setBreakfastData] = useState([]); // Example caffinData
  const [groceryData, setGroceryData] = useState([]); // Example caffinData
  const [babyCare, setBabyCare] = useState([]); // Example BabyCare
  const [riceItem, setRiceItem] = useState([]); // Example BabyCare
  const [healthData, setHealthData] = useState([]); // Example caffinData
  const [productQuery, setProductQuery] = useState(''); // Example caffinData
  const [searchData, setSearchData] = useState([]); // Example caffinData
  const [userOrder, setUserOrder] = useState([]); // Example caffinData
  const [userID, setUserID] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [imageLoad, setImageLoad] = useState(false);
  const [localProductCounts, setLocalProductCounts] = useState({});
  const [productCounts, setProductCounts] = useState({});
  const dispatch = useDispatch();

  const { productsByCategory, hasMoreByCategory, pagesByCategory, loading } = useSelector(state => state.productsPaginationByCategory);
  const { loading: loadingbanners, banners, error: bannersError } = useSelector(state => state.banners);
  const { loading: loadinglimitedCategories, limitedCategories, error: limitedCategoriesError } = useSelector(state => state.categorysLimited);
  const { loading: loadingBrandsLimited, limitedbrands, error: brandsLimitedError } = useSelector(state => state.brandsLimited);
  const { loading: loadingCart, carts, error: cartError } = useSelector(state => state.carts);
  const { loading: loadingOrder, orders, error: orderError } = useSelector(state => state.orders);
  const { loading: loadingPromos, promos, error: promosError } = useSelector(state => state.promos);
  const { loading: loadingCoupons, coupons, error: couponsError } = useSelector(state => state.coupons);
  const { loading: loadingRecentOrders, recent_orders, error: recentOrdersError } = useSelector(state => state.recentOrders);
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const { loading: loadingcategories, categories, error: categoriesError } = useSelector(state => state.categorys);
  const { loading: loadingBrands, brands, error: brandError } = useSelector(state => state.brands);
  const { loading: loadingProducts, products, error: productsError } = useSelector(state => state.products);

  const delightPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Bakery, Cake & Dairy']
  );
  const bakingPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Chips, Biscuits & Namkeens']
  );
  const caffinPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Hot & Cool Beverages']
  );
  const breakfastPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Breakfast, Dips, & Spreads']
  );
  const healthPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Health & Hygienic']
  );
  const groceryPaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Grocery, Oil & Masala']
  );
  const badyCarePaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Baby Care']
  );
  const ricePaginationData = useSelector(
    (state) => state?.productsPaginationByCategory?.productsByCategory?.['Rice, Atta, Dal & Sugar']
  );
  const isLoggedIn = Boolean(userInfo?.id);
  const getItemLayout = (data, index) => ({
    length: width / 2.8,  // Set item width
    offset: (width / 2.8) * index,
    index,
  });

  const renderCategoryItem = ({ item }) => {
    return (
      <TouchableOpacity key={item.category_id} style={styles.categoryItem} onPress={() => { navigation.navigate("Products", { routeProducts: item.productDetails, type: item.name }) }}>
        <Avatar.Image size={60} source={{ uri: item.image }} style={styles.avatarImage} />
        <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.categoryName, { fontSize: 12 }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setImageLoad(true)
    }, 3000);
  }, []);

  const renderProductItem = useCallback(({ item }) => {
    const productCount = cartItems[item.id]?.quantity || 0;
    const isInCart = productCount > 0;
    // const isInCart = (localProductCounts[item.id] ) > 0;
    // const productCount = localProductCounts[item.id];
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
      await dispatch(fetchCartProducts(userInfo.id));

    };

    // Handle Decrement
    const handleRemove = async (product) => {
      if (productCount > 1) {
        await dispatch(updateCartItem(product.id, productCount - 1));
        await dispatch(updateCartByProductID(userInfo.id, product, -1));
        await dispatch(fetchCarts(userInfo.id));
        await dispatch(fetchCartProducts(userInfo.id));

      } else {
        await dispatch(removeFromCart(product.id));
        await dispatch(updateCartByProductID(userInfo.id, product, -1));
        await dispatch(fetchCarts(userInfo.id));
        await dispatch(fetchCartProducts(userInfo.id));

      }
    };

    return (
      <Surface mode='elevated' style={styles.productItem}>
        {item.stockStatus == "outOfStock" && <View style={{ width: "100%", height: "110%", position: 'absolute', zIndex: 99, backgroundColor: 'rgba(255, 255, 255, 0.7)', justifyContent: 'center' }}>
          <Text style={{ fontWeight: "bold", color: "red", borderColor: "red", padding: 5, borderWidth: 3, fontSize: 16, textTransform: 'uppercase', textAlign: 'center' }}>
            Out Of Stock
          </Text>
        </View>
        }

        <TouchableOpacity onPress={() => { navigation.navigate("ProductDetail", { productDetails: item }) }}>
          <View style={styles.imageContainer}>
            <FastImage
              source={{ uri: item.image, priority: FastImage.priority.normal }}
              defaultSource={require('../../utilities/images/logo.png')}
              style={[styles.productImage, { width: width / 2.8, height: width / 2.8 }]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.productName, { letterSpacing: 1, marginTop: 24, width: width / 3, textAlign: 'center', alignSelf: 'center' }]}>{item.name}</Text>
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
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Surface>
    )
  }, [productCounts, cartItems]);

  const renderBrandItem = ({ item, index }) => {
    return (
      <TouchableOpacity key={index} onPress={() => { navigation.navigate("Products", { routeProducts: item.productDetails, type: item.name }) }}>
        <Surface mode='elevated' style={[styles.personalItem, { width: width / 3.5, height: width / 3.5, margin: 5 }]}>
          <Image source={{ uri: item.image }} style={[styles.productImage, { flex: 1, borderRadius: 10, }]} />
          <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.categoryName, { alignSelf: 'center', fontSize: 14 }]}>{item.name}</Text>
        </Surface>
      </TouchableOpacity>
    )
  };
  const renderBabyItem = ({ item, index }) => (
    <TouchableOpacity key={index} onPress={() => { navigation.navigate("ProductDetail", { productDetails: item }) }}>
      <Surface mode='elevated' style={[styles.personalItem, { width: width / 3.5, height: width / 3.5, margin: 5 }]}>
        <Image source={{ uri: item.image }} style={[styles.productImage, { flex: 1, borderRadius: 10, }]} />
        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.categoryName, { alignSelf: 'center', fontSize: 14 }]}>{item.name}</Text>
      </Surface>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (carts && carts.length > 0) {
      // const totalItems = carts.reduce((count, cartItem) => count + cartItem.quantity, 0);
      const updatedCounts = carts.reduce((acc, cartItem) => {
        acc[cartItem.product_id] = cartItem.qty;
        return acc;
      }, {});
      setProductCounts(updatedCounts);
    } else {
      setProductCounts({});
    }
    // Update cart count
  }, [carts]); // Only depend on `carts` here, no infinite loop

  useEffect(() => {
    if (orders && orders.length > 0) {
      const pendindOrders = orders.filter((item) => (item.status !== "delivered" && item.status !== "cancel"));
      setUserOrder(pendindOrders);
    } else {
      setProductCounts({});
    }

  }, [orders]); // Only depend on `carts` here, no infinite loop



  useEffect(() => {
    if (delightPaginationData) {
      setDelightItemData(delightPaginationData);
    }
  }, [delightPaginationData]);

  useEffect(() => {
    if (bakingPaginationData) {
      setBakingItemData(bakingPaginationData);
    }
  }, [bakingPaginationData]);

  useEffect(() => {
    if (caffinPaginationData) {
      setCaffinData(caffinPaginationData);
    }
  }, [caffinPaginationData]);

  useEffect(() => {
    if (breakfastPaginationData) {
      setBreakfastData(breakfastPaginationData);
    }
  }, [breakfastPaginationData]);

  useEffect(() => {
    if (healthPaginationData) {
      setHealthData(healthPaginationData);
    }
  }, [healthPaginationData]);

  useEffect(() => {
    if (groceryPaginationData) {
      setGroceryData(groceryPaginationData);
    }
  }, [groceryPaginationData]);

  useEffect(() => {
    if (badyCarePaginationData) {
      setBabyCare(badyCarePaginationData);
    }
  }, [badyCarePaginationData]);

  useEffect(() => {
    if (ricePaginationData) {
      setRiceItem(ricePaginationData);
    }
  }, [ricePaginationData]);

  const onSearchProductQuery = useCallback((query) => {
    setProductQuery(query);
  }, []);


  useEffect(() => {
    if (productQuery.length > 0) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(productQuery.toLowerCase())
      );
      setSearchData(filtered);
    } else {
      setSearchData(products);  // Reset to all products when query is empty
    }
  }, [productQuery, products]);  // Only runs when debounced query or products change

  useEffect(() => {
    const variantIdSet = new Set(recent_orders.map(recent_orderItem => recent_orderItem.product_id));
    const variantIdArray = Array.from(variantIdSet);  // Convert Set to Array
    const uniqueProductsMap = new Map();

    products.forEach(product => {
      if (variantIdArray.includes(product.id.toString())) {
        uniqueProductsMap.set(product.product_id, {
          id: product.id,
          product_id: product.product_id,
          name: product.name,
          image: product.image,

          category_id: product.category_id,

          category: product.category,

          brand_id: product.brand_id,

          brand: product.brand,

          purchase: product.purchase,

          price: product.price,

          description: product.description,

          stock: product.stock,

          units: product.units,

          weight: product.weight,

          product_discount: product.product_discount,

          totalsales: product.totalsales,

          total_revenue: product.total_revenue,

          views: product.views,

          stockStatus: product.stockStatus,

          status: product.status,

          createdAt: product.createdAt,

          updatedAt: product.updatedAt,
        })
      }
    })

    // Convert the Map back to an array
    const formattedRecentOrdersData = Array.from(uniqueProductsMap.values());
    // Update the cartData state
    setRecentOrdersData(formattedRecentOrdersData);

  }, [productQuery, products]);  // Only runs when debounced query or products change


  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        try {
          const fetchTasks = [
            dispatch(fetchProducts()),
            dispatch(fetchBanners()),
            dispatch(fetchCategories()),
            dispatch(fetchBrands()),
            dispatch(fetchCoupons()),
            dispatch(fetchPromos()),
            dispatch(deleteRunningOrder()),
          ];

          if (isLoggedIn) {
            fetchTasks.push(
              dispatch(getUserById(userInfo.id)),
              dispatch(fetchCarts(userInfo.id)),
              dispatch(fetchOrders(userInfo.id)),
              dispatch(fetchRecent_Orders(userInfo.id)),
              dispatch(fetchAddresses(userInfo.id)),
              dispatch(fetchNotifications(userInfo.id))
            );
          } else {
            setProductCounts({})
          }

          await Promise.all(fetchTasks);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }

      fetchData(); // Call the async function
    }, [dispatch, isLoggedIn])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>

        {/* Header Section */}
        <Header onSearchQuery={onSearchProductQuery} showCart={isLoggedIn} />
      </View>
      {
        productQuery === "" ? (
          
          
          <ScrollView style={styles.container}>
            {/* Promo Banner swippers */}
            {
              !imageLoad ? (
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size={40} color="#f46f2e" />
                  <View>
                    <Surface style={{ width: width / 1.1, height: 150, borderRadius: 10, backgroundColor: "#ffffff", margin: 16 }}></Surface>
                  </View>
                  <View style={{ width: width, flexDirection: "row", justifyContent: 'space-evenly', marginVertical: 5 }}>
                    <Surface style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "#ffffff", margin: 5 }}></Surface>
                    <Surface style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "#ffffff", margin: 5 }}></Surface>
                    <Surface style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "#ffffff", margin: 5 }}></Surface>
                    <Surface style={{ width: 60, height: 60, borderRadius: 35, backgroundColor: "#ffffff", margin: 5 }}></Surface>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: 'space-between', marginVertical: 5 }}>
                    <Surface style={{ width: width / 2.5, height: 250, borderRadius: 10, backgroundColor: "#ffffff", marginVertical: 10, marginHorizontal: 10 }}></Surface>
                    <Surface style={{ width: width / 2.5, height: 250, borderRadius: 10, backgroundColor: "#ffffff", marginVertical: 10, marginHorizontal: 10 }}></Surface>
                  </View>
                </SafeAreaView>
              ) : (
                <View>
                  <View style={{ width: '100%', height: 180 }}>
                    <Swiper
                      showsButtons={false}
                      dotColor="green"
                      activeDotStyle={{ top: -15 }}
                      dotStyle={{ width: 10, height: 5, top: -15 }}
                      loop={true}
                      autoplay={true}  // Autoplay enabled for automatic swiping
                      autoplayTimeout={6}  // Set autoplay delay
                      removeClippedSubviews={false}  // Help with rendering when swiping
                    >
                      {banners.map((item, index) => (
                        <TouchableOpacity key={item.id.toString()} style={styles.slide1} onPress={() => { navigation.navigate('AllProducts', { routeProducts: products, type: "All Products" }) }}>
                          <Card.Cover
                            source={
                              !item.image
                                ? require('../../utilities/images/food.png') // Local image
                                : { uri: item.image } // Remote image
                            } resizeMode='stretch'
                            style={styles.promoBanner}
                          />
                        </TouchableOpacity>
                      ))}

                    </Swiper>

                  </View>
                  {/* Categories */}
                  <View style={styles.sectionHeader}>
                    <View style={styles.subtitleContent}>
                      <Text style={styles.sectionTitle}>Categories</Text>
                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate("Category", { routeParent: categories, type: "Categories" }) }}>
                      <Text style={styles.moreText}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={limitedCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item.category_id}
                    numColumns={4}
                    columnWrapperStyle={{ alignSelf: 'center' }}
                    showsVerticalScrollIndicator={false}
                    extraData={{ localProductCounts, productCounts }}
                  />
                  {/* pending Order */}
                  {
                    orders.length > 0 && (
                      <View style={{ width: '100%', height: 120 }}>
                        <Swiper
                          showsButtons={false}
                          loop={false}
                          autoplay={true}
                          autoplayTimeout={6} 
                          removeClippedSubviews={false}
                          dot={<View style={{ backgroundColor: 'gray', width: 8, height: 8, borderRadius: 4, marginHorizontal: 3 }} />}
                          activeDot={<View style={{ backgroundColor: 'blue', width: 10, height: 10, borderRadius: 5, marginHorizontal: 3 }} />}
                          paginationStyle={{ bottom: 10 }}
                          renderPagination={(index, total) => {
                            const maxDots = 5; // Limit the number of dots
                            const visibleDots = Math.min(maxDots, total);
                            const dots = [];

                            for (let i = 0; i < visibleDots; i++) {
                              dots.push(
                                <View
                                  key={i}
                                  style={{
                                    backgroundColor: i === index ? 'blue' : 'gray',
                                    width: i === index ? 10 : 8,
                                    height: i === index ? 10 : 8,
                                    borderRadius: 5,
                                    marginHorizontal: 3,
                                  }}
                                />
                              );
                            }

                            return <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{dots}</View>;
                          }}
                        >
                          {userOrder.map((item, index) => (
                            <Surface mode='elevated' elevation={2} key={index.toString()} style={{ backgroundColor: '#d32f2f', margin: 10, padding: 20,borderRadius:10 }} >
                              <StepIndicator
                                customStyles={customStyles}
                                currentPosition={item.status}
                                stepCount={4} direction='horizontal'
                                labels={labels} onPress={() => {
                                  navigation.navigate("Bottom_Home", {
                                    screen: 'Orders',
                                    params: { orderData: item },
                                  });
                                }}
                              />
                            </Surface>
                          ))}
                        </Swiper>
                      </View>
                    )
                  }

                  {/* recent ordered products */}

                  {
                    recent_orders.length > 0 && (
                      <View style={{ marginVertical: 20 }}>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionSubTitle}>Your Recent Orders</Text>
                          <TouchableOpacity>
                            <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: recent_orders, type: "recent ordered" }) }}>More</Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={recentOrdersData}
                          renderItem={renderProductItem}
                          keyExtractor={(item) => item.id.toString()}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.productList}
                          getItemLayout={getItemLayout}
                        />
                      </View>

                    )
                  }

                  {/*  Delight products */}

                  {
                    delightItemData.length > 0 && (
                      <View style={{ marginVertical: 20 }}>
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionSubTitle}>Delight</Text>
                          <TouchableOpacity>
                            <Text style={styles.moreText} onPress={() => { navigation.navigate("AllProducts", { routeProducts: delightItemData, type: "Bakery, Cake & Dairy" }) }}>More</Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={delightItemData}
                          renderItem={renderProductItem}
                          keyExtractor={(item) => item.id.toString()}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.productList}
                          getItemLayout={getItemLayout}
                          onEndReached={() => {
                            // Fetch more products if available
                            if (hasMoreByCategory['Bakery, Cake & Dairy']) {
                              dispatch(fetchProductsByCategoryWithPagination("Bakery, Cake & Dairy", pagesByCategory['Bakery, Cake & Dairy'] + 1, 3)); // Fetch next page
                            }
                          }}
                          onEndReachedThreshold={0.5}
                          ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                        />
                      </View>

                    )
                  }

                  {/* Brands */}
                  {
                    brands.length > 0 && (

                      <View style={{ marginVertical: 20 }}>

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionSubTitle}>Brands</Text>
                          <TouchableOpacity>
                            <Text style={styles.moreText} onPress={() => { navigation.push("Category", { routeParent: brands, type: "Brands" }) }}>More</Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={limitedbrands} // Reusing mock data; replace with actual products for this category
                          renderItem={renderBrandItem}
                          keyExtractor={(item) => item.brand_id.toString()}
                          numColumns={3}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={styles.productList}
                        />
                      </View>
                    )
                  }

                  {/* Promo Banner */}
                  {
                    promos.length > 0 && promos[0]?.image && (
                      <View >
                        <Card.Cover
                          source={{ uri: promos[0].image }}
                          style={styles.promoBanner} resizeMode='stretch'
                        />
                      </View>


                    )
                  }


                  {/* Chips, Biscuits & Namkeens */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}>Chips, Biscuits & Namkeens</Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: bakkingItemData, type: "Chips, Biscuits & Namkeens" }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={bakkingItemData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Chips, Biscuits & Namkeens']) {
                        dispatch(fetchProductsByCategoryWithPagination('Chips, Biscuits & Namkeens', pagesByCategory['Chips, Biscuits & Namkeens'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}

                  />
                  {/* coupons */}
                  <View style={{ width: '100%', height: 150 }}>
                    <Swiper
                      showsButtons={false}
                      dotColor="green"
                      activeDotStyle={{ top: 15 }}
                      dotStyle={{ width: 10, height: 5, top: 15 }}
                      loop={true}
                      autoplay={true}  // Autoplay enabled for automatic swiping
                      autoplayTimeout={4}  // Set autoplay delay
                      removeClippedSubviews={false}  // Help with rendering when swiping
                    >
                      {coupons.map((item, index) =>
                        <TouchableOpacity key={index.toString} style={styles.slide1} onPress={() => { navigation.navigate('Coupons', { CouponData: item }) }}>
                          <Card.Cover
                            source={
                              !item.image
                                ? require('../../utilities/images/food.png') // Local image
                                : { uri: item.image } // Remote image
                            } resizeMode='stretch'
                            style={styles.promoBanner}
                          />
                        </TouchableOpacity>
                      )}
                    </Swiper>

                  </View>
                  {/* Health Essencials */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}>Health & Hygienic</Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: healthData, type: 'Health & Hygienic' }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <Divider style={{ height: 140, width: width, backgroundColor: '#d9c2c2' }}></Divider>
                  <FlatList
                    data={healthData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    style={{ marginTop: -120, zIndex: 99, }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.productList]}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Health & Hygienic']) {
                        dispatch(fetchProductsByCategoryWithPagination('Health & Hygienic', pagesByCategory['Health & Hygienic'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                  />
                  {/* beauty & skin Hydrations */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}> Breakfast  Dips & Spreads</Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: breakfastData, type: 'Breakfast, Dips, & Spreads' }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <Divider style={{ height: 140, width: width, backgroundColor: '#b8d1c0' }}></Divider>
                  <FlatList
                    data={breakfastData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    style={{ marginTop: -120, zIndex: 99, }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.productList]}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Breakfast, Dips, & Spreads']) {
                        dispatch(fetchProductsByCategoryWithPagination('Breakfast, Dips, & Spreads', pagesByCategory['Breakfast, Dips, & Spreads'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                  />
                  {/* best of caffinss */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}> Best Of Hot & Cool Beverages</Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: caffinData, type: 'Hot & Cool Beverages' }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <Divider style={{ height: 140, width: width, backgroundColor: '#bec6d3' }}></Divider>
                  <FlatList
                    data={caffinData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    style={{ marginTop: -120, zIndex: 99, }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.productList]}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Hot & Cool Beverages']) {
                        dispatch(fetchProductsByCategoryWithPagination('Hot & Cool Beverages', pagesByCategory['Hot & Cool Beverages'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                  />
                  {/* Promo Banner */}
                  {
                    promos.length > 1 && promos[1]?.image && (
                      <Card.Cover
                        source={{ uri: promos[1].image }}
                        style={styles.promoBanner} resizeMode='stretch'
                      />
                    )
                  }

                  {/* BadyCare */}
                  {
                    babyCare.length > 0 && (

                      <View style={{ marginVertical: 20 }}>

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionSubTitle}>BadyCare</Text>
                          <TouchableOpacity>
                            <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: babyCare, type: 'Baby Care' }) }}>More</Text>
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={babyCare} // Reusing mock data; replace with actual products for this category
                          renderItem={renderBabyItem}
                          keyExtractor={(item) => item.id.toString()}
                          numColumns={3}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={styles.productList}
                          onEndReached={() => {
                            // Fetch more products if available
                            if (hasMoreByCategory['Baby Care']) {
                              dispatch(fetchProductsByCategoryWithPagination('Baby Care', pagesByCategory['Baby Care'] + 1, 3)); // Fetch next page
                            }
                          }}
                          onEndReachedThreshold={0.5}
                          ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                        />
                      </View>
                    )
                  }

                  {/* Make Aneasy way */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}> Rice, Atta, Dal & Sugar </Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: riceItem, type: 'Rice, Atta, Dal & Sugar' }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <Divider style={{ height: 140, width: width, backgroundColor: '#dec1dd' }}></Divider>
                  <FlatList
                    data={riceItem}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    style={{ marginTop: -120, zIndex: 99, }}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.productList]}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Rice, Atta, Dal & Sugar']) {
                        dispatch(fetchProductsByCategoryWithPagination('Rice, Atta, Dal & Sugar', pagesByCategory['Rice, Atta, Dal & Sugar'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                  />
                  {/* Products */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionSubTitle}>Grocery, Oil & Masala</Text>
                    <TouchableOpacity>
                      <Text style={styles.moreText} onPress={() => { navigation.navigate('AllProducts', { routeProducts: groceryData, type: 'Grocery, Oil & Masala' }) }}>More</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={groceryData}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    getItemLayout={getItemLayout}
                    onEndReached={() => {
                      // Fetch more products if available
                      if (hasMoreByCategory['Grocery, Oil & Masala']) {
                        dispatch(fetchProductsByCategoryWithPagination('Grocery, Oil & Masala', pagesByCategory['Grocery, Oil & Masala'] + 1, 3)); // Fetch next page
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" style={{ justifyContent: 'center', alignSelf: 'center' }} />}
                  />
                  {/* Promo Banner */}
                  <View style={{ width: '100%', height: 120 }}>
                    <Swiper
                      showsButtons={false}
                      dotColor="green"
                      activeDotStyle={{ top: 20 }}
                      dotStyle={{ width: 10, height: 5, top: 20 }}
                      loop={true}
                      autoplay={true}  // Autoplay enabled for automatic swiping
                      autoplayTimeout={4}  // Set autoplay delay
                      removeClippedSubviews={false}  // Help with rendering when swiping
                    >
                      {categories.map((item, index) =>
                        <View key={index.toString} style={styles.slide1}>
                          <Card.Cover
                            source={
                              index % 2 === 0
                                ? require('../../utilities/images/food.png') // Local image
                                : { uri: "https://media.istockphoto.com/id/1145430255/vector/fruits-and-vegetables-seamless-pattern.jpg?s=612x612&w=0&k=20&c=2ESF5mMwEhqIlYwtShzpOp3O_U_EncGZMpKMKR8_d7o=" } // Remote image
                            } resizeMode='stretch'
                            style={styles.promoBanner}
                          />
                        </View>
                      )}
                    </Swiper>

                  </View>
                  {/* Promo Banner */}
                  <Card.Cover
                    source={require('../../utilities/images/food.png')}
                    style={styles.promoBanner}
                  />


                  {/* Footer */}
                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Happy Shopping!</Text>
                  </View>
                </View>
              )}

          </ScrollView>
        ) : (
          <View style={{ marginBottom: 250 }}>
            <View>
              <Text style={[styles.sectionSubTitle, { alignSelf: 'center', fontSize: 24, margin: 10 }]}>Products</Text>
              <FlatList
                data={searchData}
                style={{ alignSelf: 'center' }}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ columnGap: 5 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productList}
                getItemLayout={getItemLayout}
              />
            </View>
          </View>
        )
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  slide: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center', // Center the content
    alignItems: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    margin: 10,
  },
  avatarImage: {
    backgroundColor: '#e0e0e0', // You can change the background color if needed
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 3 }, // Offset for iOS
    shadowOpacity: 0.3, // Opacity for iOS
    shadowRadius: 5, // Shadow blur for iOS
    elevation: 6, // Elevation for Android

  },
  categoryName: {
    marginTop: 5,
    textAlign: 'center', fontFamily: "Roboto-Bold",
    width: 80,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f46f2e',
  },
  cartIcon: {
    width: 24,
    height: 24,
  },
  promoBanner: {
    width: '95%',
    height: 150,
    alignSelf: 'center',
    marginVertical: 16,

  },
  orderTrack: {
    width: '95%',
    height: 150,
    alignSelf: 'center',
    marginVertical: 16,

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 5
  },
  subtitleContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Parkinsans-SemiBold",
    color: 'green', marginLeft: 8
  },
  sectionSubTitle: {
    fontSize: 18, fontFamily: "Parkinsans-SemiBold",
    color: 'green',
  },
  moreText: {
    color: '#F07825',
    fontWeight: 'bold',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#6c290f', fontFamily: 'Roboto-Bold'
  },
  productList: {
    paddingLeft: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 3,
    marginRight: 16,
    marginBottom: 10,
    width: 160,
    alignItems: 'center', // Align the contents at the center
  },
  personalItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8, elevation: 3,
  },
  imageContainer: {
    width: '100%', // Ensure image container fills the product item width
    height: 140, // Fixed height for consistent image sizes
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    backgroundColor: "#ffffff",
  },
  productName: {
    fontSize: 16,
    color: '#6c290f', fontFamily: "Parkinsans-SemiBold",
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
    marginBottom: 8, fontFamily: "Roboto-Bold",
    marginBottom: 8,
    textAlign: 'center',
  },
  productUnit: {
    fontSize: 12,
    color: 'gray', fontFamily: "Roboto-Regular",
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
    alignSelf: 'center', justifyContent: 'center',
    borderRadius: 20,
    width: 80,
    height: 35,
  },
  addButtonText: {
    color: '#fff',
    fontFamily: "Roboto-Bold",
    alignSelf: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6c290f',
  },
});
