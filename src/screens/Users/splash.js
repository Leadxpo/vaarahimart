import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import CircularProgressBar from '../../components/circularProgressBar'; // Import the progress bar component
import { useNavigation } from '@react-navigation/native';
import { loadData } from '../../Utils/appData'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../Redux/Actions/bannerAction';
import { fetchProductsByCategoryWithPagination } from '../../Redux/Actions/productAction';
import { fetchCategories, fetchLimitedCategories } from '../../Redux/Actions/categoryAction';
import { fetchBrands, fetchLimitedBrands } from '../../Redux/Actions/brandAction';
import { fetchCoupons } from '../../Redux/Actions/couponAction';
import { fetchCarts } from '../../Redux/Actions/cartAction';
import { fetchAssignedOrder, fetchOrders } from '../../Redux/Actions/orderAction';
import { fetchNotifications, fetchStaffNotifications } from '../../Redux/Actions/notificationAction';
import { fetchRecent_Orders } from '../../Redux/Actions/recentOrdersAction';
import { getUserById } from '../../Redux/Actions/userAction';
import { getStaffById } from '../../Redux/Actions/staffAction';
import { getDeliveryStaffById } from '../../Redux/Actions/deliveryStaffAction';
import { fetchPendingRequestsbyStaffID } from '../../Redux/Actions/requestAction';
import { fetchPromos } from '../../Redux/Actions/promoAction';
import store from '../../Redux/store';
import { setToCart } from '../../Redux/Actions/cartItemsAction';
import { Screen } from 'react-native-screens';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

const Splash = () => {
    const [progress, setProgress] = useState(0);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [delightItemData, setDelightItemData] = useState(0); // Example MostPurchasedData
    const [bakkingItemData, setBakingItemData] = useState(0); // Example bakkingItemData
    const [caffinData, setCaffinData] = useState(0); // Example caffinData
    const [breakfastData, setBreakfastData] = useState(0); // Example caffinData
    const [groceryData, setGroceryData] = useState(0); // Example caffinData
    const [babyCare, setBabyCare] = useState(0); // Example BabyCare
    const [riceItem, setRiceItem] = useState(0); // Example BabyCare
    const [healthData, setHealthData] = useState(0); // Example caffinData

    
    const checkNetwork = () => {
        NetInfo.fetch().then((state) => {
            if (!state.isConnected) {
                Alert.alert(
                    'No Internet Connection',
                    'Please check your network connection and try again.',
                    [{ text: 'OK' }]
                );
            }
        });
    };

    useEffect(() => {
        // Check network connectivity on component mount
        checkNetwork();

        // Subscribe to network status changes
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (!state.isConnected) {
                Alert.alert(
                    'No Internet Connection',
                    'Please check your network connection and try again.',
                    [{ text: 'OK' }]
                );
            }
        });

        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    const productsByCategory = useSelector(
        (state) => state?.productsPaginationByCategory?.productsByCategory
    );
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

    const babyCarePaginationData = useSelector(
        (state) => state?.productsPaginationByCategory?.productsByCategory?.['Baby Care']
    );

    const ricePaginationData = useSelector(
        (state) => state?.productsPaginationByCategory?.productsByCategory?.['Rice, Atta, Dal & Sugar']
    );
    
    useEffect(() => {
        if (Array.isArray(delightPaginationData)) setDelightItemData(delightPaginationData.length);
        if (Array.isArray(bakingPaginationData)) setBakingItemData(bakingPaginationData.length);
        if (Array.isArray(caffinPaginationData)) setCaffinData(caffinPaginationData.length);
        if (Array.isArray(breakfastPaginationData)) setBreakfastData(breakfastPaginationData.length);
        if (Array.isArray(healthPaginationData)) setHealthData(healthPaginationData.length);
        if (Array.isArray(groceryPaginationData)) setGroceryData(groceryPaginationData.length);
        if (Array.isArray(babyCarePaginationData)) setBabyCare(babyCarePaginationData.length);
        if (Array.isArray(ricePaginationData)) setRiceItem(ricePaginationData.length);
    }, [
        delightPaginationData, bakingPaginationData, caffinPaginationData, breakfastPaginationData, healthPaginationData, groceryPaginationData, babyCarePaginationData, ricePaginationData,
    ]);
    const imageCount = delightItemData + breakfastData + caffinData + bakkingItemData + groceryData + riceItem + babyCare + healthData;

    useEffect(() => {
        // Utility function to filter products by category
        const filterByCategory = (category) => {
            dispatch(fetchProductsByCategoryWithPagination(category, 1, 3));
        };
        // Update category data only if products change
        filterByCategory('Bakery, Cake & Dairy');
        filterByCategory('Chips, Biscuits & Namkeens');
        filterByCategory('Hot & Cool Beverages');
        filterByCategory('Breakfast, Dips, & Spreads');
        filterByCategory('Health & Hygienic');
        filterByCategory('Grocery, Oil & Masala');
        filterByCategory('Baby Care');
        filterByCategory('Rice, Atta, Dal & Sugar');

    }, []);  // Dependencies on `products` and `carts`

    

    useEffect(() => {
        const fetchHomeData = async () => {
            await dispatch(fetchBanners());
            await dispatch(fetchLimitedCategories());
            await dispatch(fetchLimitedBrands());
            await dispatch(fetchBrands());
            await dispatch(fetchCategories());
            await dispatch(fetchPromos());
            await dispatch(fetchCoupons());
        }
        fetchHomeData()
    }, [dispatch,delightItemData, breakfastData, caffinData, bakkingItemData, groceryData, riceItem, babyCare, healthData,])

    const fetchUserData = async (userId) => {
        try {
            await Promise.all([
                dispatch(getUserById(userId)),
                dispatch(fetchCarts(userId)),
                dispatch(fetchOrders(userId)),
                dispatch(fetchNotifications(userId)),
                dispatch(fetchRecent_Orders(userId)),
            ]);

            const state = store.getState(); // Assuming you have access to the Redux store
            const cartData = state.carts.carts;
            if (cartData.length>0) {
                cartData.map((item)=>{
                const productDatas = {
                    brand: item.brand,
                    product_id: item.variant_id,
                    brand_id: item.brand_id,
                    category: item.category,
                    category_id: item.category_id,
                    id:item.product_id,
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    product_discount: item.product_discount,
                    units:item.units,
                    weight: item.weight,
                    quantity:item.qty
                }
                dispatch(setToCart(productDatas));
            }) 
            } else {
                
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchStaffData = async (StaffId) => {
        try {
            await Promise.all([
                dispatch(getDeliveryStaffById(StaffId)),
                dispatch(fetchPendingRequestsbyStaffID(StaffId)),
                dispatch(fetchAssignedOrder(StaffId)),
                dispatch(fetchStaffNotifications(StaffId)),
            ]);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };


    const checkLoginStatus = async () => {
        const role = await loadData("role");
        try {
            if (role === 'user') {
                const login = await loadData("isLogin");
                const userData = await loadData("userData");
                if (login) {
                    // If logged in, navigate to home screen
                    await fetchUserData(userData?.id);
                    navigation.replace('Bottom_Home',{screen:'Home'});

                } else {
                    navigation.replace('onboarding');
                }
            } else if (role === 'staff') {
                const stafflogin = await loadData("isStaffLogin");
                const staffData = await loadData("delivryStaffData");
                if (stafflogin) {
                    // If logged in, navigate to home screen
                    fetchStaffData(staffData?.staff_id)
                    navigation.navigate('DeliveryDrawer', {
                        screen: "DeliveryStack",
                        params: { screen: "DeliveryHome" }
                    });
                    
                } else {
                    navigation.replace('DeliveryLogin');

                }
            } else {
                // If not logged in, navigate to onboarding screen
                navigation.replace('onboarding');
            }
        } catch (e) {
            console.error('Failed to retrieve login status', e);
        }
    };
    useEffect(() => {
        const circularProgress = async () => {
            const totalTasks = 5; // Number of dispatch actions
            let completedTasks = 0;

            const updateProgress = () => {
                completedTasks++;
                setProgress((completedTasks / totalTasks) * 100);
            };

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            try {
                await delay(500); // Delay before starting dispatch
                updateProgress();

                await delay(500);
                updateProgress();

                await delay(500);
                updateProgress();

                await delay(500);
                updateProgress();

                await delay(500);
                updateProgress();

                await delay(500);
                checkLoginStatus(); // Once all dispatches are done, check login status
            } catch (error) {
                console.log("Error: ", error);
                console.error('Failed to fetch data', error);
            }
        };

        circularProgress();
    }, [dispatch]);


    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <CircularProgressBar progress={progress} />
            {progress === 100 && (
                <ActivityIndicator size="large" color="#fa9521" style={styles.loader} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loader: {
        marginTop: 20,
    },
});

export default Splash;
