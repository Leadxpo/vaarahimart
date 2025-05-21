import 'react-native-gesture-handler';
import React,{useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomUserDrawerContent from './src/components/userDrawer';
import CustomDelivertDrawerContent from './src/components/deliveryPartnerDrawer';
import { loadData } from './src/Utils/appData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HyperSdkReact from 'hyper-sdk-react';
import SplashScreen from 'react-native-splash-screen';
//block:end:import-hyper-sdk
import uuid from 'react-native-uuid';
import {NativeEventEmitter, NativeModules} from 'react-native';

import Pay_Home from './src/screens/Users/pay_Homescreen';
import Pay_Checkout from './src/screens/Users/pay_checkout';
import Pay_Response from './src/screens/Users/pay_Response';
import Pay_ApiClient from './src/Api/pay_ApiClient';

import Splash from './src/screens/Users/splash';
import Onboarding from './src/screens/Users/onboarding';
import Login from './src/screens/Users/login';
import Otp from './src/screens/Users/OTP';
import Home from './src/screens/Users/Home';
import UserDetails from './src/screens/Users/userDetail';
import Profile from './src/screens/Users/profile';
import ProfileWithoutLogin from './src/screens/Users/profileWithoutLogin';
import AddAddress from './src/screens/Users/addAddress';
import About from './src/screens/Users/about';
import Notification from './src/screens/Users/notification';
import NotificationDetails from './src/screens/Users/notificationDetails';
import Ticket from './src/screens/Users/ticket';
import TicketRaise from './src/screens/Users/ticketRaise';
import Address from './src/screens/Users/address';
import ShopByCategoryScreen from './src/screens/Users/ShopByCategoryScreen';
import AllProducts from './src/screens/Users/allProducts';
import Products from './src/screens/Users/products';
import Category from './src/screens/Users/category';
import ProductDetail from './src/screens/Users/productDetails';
import Cart from './src/screens/Users/cart';
import Coupons from './src/screens/Users/coupons';
import AddressCheckout from './src/screens/Users/addressCheckout';
import EditAddress from './src/screens/Users/editAddres';
import Checkout from './src/screens/Users/checkout';
import OrderConfirm from './src/screens/Users/orderConfirm';
import OrderTickets from './src/screens/Users/orderTicket';
import OrderSuccess from './src/screens/Users/orderSuccess';
import OrderDetails from './src/screens/Users/orderDetails';
import Orders from './src/screens/Users/orders';
import Wishlist from './src/screens/Users/wishList';
import Feedback from './src/screens/Users/feedback';
import UserBankInfo from './src/screens/Users/bankInfo';
import UserBankDetail from './src/screens/Users/bankDetail';
import Policies from './src/screens/Users/Policies';

import DeliveryLogin from './src/screens/DeliveryPartner/deliveryLogin';
import DeliveryHome from './src/screens/DeliveryPartner/deliveryHome';
import DeliveryProfile from './src/screens/DeliveryPartner/deliveryProfile';
import EditDeliveryProfile from './src/screens/DeliveryPartner/editDeliveryProfile';
import DeliveryOrderDetails from './src/screens/DeliveryPartner/deliveryOrderDetails';
import DeliveryOrders from './src/screens/DeliveryPartner/deliveryOrders';
import DeliveryNotificationDetails from './src/screens/DeliveryPartner/deliveryNotificationDetails';
import DeliveryNotification from './src/screens/DeliveryPartner/deliveryNotification';
import WithdrawRequest from './src/screens/DeliveryPartner/deliveryRequest';
import DeliveryPartnerBankDetails from './src/screens/DeliveryPartner/bankDetail';
import BankInfo from './src/screens/DeliveryPartner/bankInfo';
import DeliveryResetPassword from './src/screens/DeliveryPartner/deliveryResetPassword';
import DeliveryVerification from './src/screens/DeliveryPartner/deliveryVerification';
import DeliverySuccess from './src/screens/DeliveryPartner/orderSuccess';
// import TrackDelivery from './src/screens/DeliveryPartner/deliveryTracking';
import TrackDelivery from './src/screens/DeliveryPartner/mapdirections';

// Initialize Stack and Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();// Create a Drawer Navigator component


// Create a Stack Navigator component
const UserStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Pay_Home" component={Pay_Home} options={{ headerShown: false }} />
      <Stack.Screen name="Pay_Checkout" component={Pay_Checkout} options={{ headerShown: false }} />
      <Stack.Screen name="Pay_Response" component={Pay_Response} options={{ headerShown: false }} />
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" component={Onboarding} options={{ headerShown: false }} />
      <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="OTP" component={Otp} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Bottom_Home" component={UserBottomNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileWithoutLogin" component={ProfileWithoutLogin} options={{ headerShown: false }} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
      <Stack.Screen name="About" component={About} options={{ headerShown: true }} />
      <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{ headerShown: true }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: true }} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: true }} />
      <Stack.Screen name="OrderTickets" component={OrderTickets} options={{ headerShown: true }} />
      <Stack.Screen name="Tickets" component={Ticket} options={{ headerShown: true }} />
      <Stack.Screen name="TicketRaise" component={TicketRaise} options={{ headerShown: true }} />
      <Stack.Screen name="AddAddress" component={AddAddress} options={{ headerShown: true }} />
      <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: true }} />
      <Stack.Screen name="Address" component={Address} options={{ headerShown: true }} />
      <Stack.Screen name="AddressCheckout" component={AddressCheckout} options={{ headerShown: true }} />
      <Stack.Screen name="Category" component={Category} options={{ headerShown: false }} />
      <Stack.Screen name="AllProducts" component={AllProducts} options={{ headerShown: false }} />
      <Stack.Screen name="Products" component={Products} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: true }} />
      <Stack.Screen name="Coupons" component={Coupons} options={{ headerShown: true }} />
      <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: true }} />
      <Stack.Screen name="orderConfirm" component={OrderConfirm} options={{ headerShown: true }} />
      <Stack.Screen name="Wishlist" component={Wishlist} options={{ headerShown: true }} />
      <Stack.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
      <Stack.Screen name="UserBankInfo" component={UserBankInfo} options={{ headerShown: false }} />
      <Stack.Screen name=" UserBankDetail" component={UserBankDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Policies" component={Policies} options={{ headerShown: false }} />
    </Stack.Navigator>
  )

}

const DeliveryPartnerStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="DeliveryLogin">
      <Stack.Screen name="DeliveryLogin" component={DeliveryLogin} options={{ headerShown: false }} />
      <Stack.Screen name="DeliveryHome" component={DeliveryHome} options={{ headerShown: false }} />
      <Stack.Screen name="DeliveryOrderDetails" component={DeliveryOrderDetails} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryOrders" component={DeliveryOrders} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryNotification" component={DeliveryNotification} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryNotificationDetails" component={DeliveryNotificationDetails} options={{ headerShown: true }} />
      <Stack.Screen name="TrackDelivery" component={TrackDelivery} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryProfile" component={DeliveryProfile} options={{ headerShown: true }} />
      <Stack.Screen name="EditDeliveryProfile" component={EditDeliveryProfile} options={{ headerShown: true }} />
      <Stack.Screen name="WithdrawRequest" component={WithdrawRequest} options={{ headerShown: true }} />
      <Stack.Screen name="BankInfo" component={BankInfo} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryPartnerBankDetails" component={DeliveryPartnerBankDetails} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryResetPassword" component={DeliveryResetPassword} options={{ headerShown: true }} />
      <Stack.Screen name="DeliveryVerification" component={DeliveryVerification} options={{ headerShown: true }} />
      <Stack.Screen name="DeliverySuccess" component={DeliverySuccess} options={{ headerShown: true }} />
    </Stack.Navigator>
  )
}

const UserDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomUserDrawerContent {...props} />}>
      <Drawer.Screen name="UserStack" component={UserStackNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="ShopByCategory" component={ShopByCategoryScreen} />
      <Drawer.Screen name="DeliveryDrawer" component={DeliveryDrawerNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}

const UserBottomNavigator = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const loginStatus = await loadData("isLogin");
      const userRole = await loadData("role");
      setIsUserLogin(loginStatus);
      setRole(userRole);
    };
    fetchUserData();
  }, []);

  return (
<BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true, // Show labels under icons
        tabBarActiveTintColor: '#f46f2e', // Active icon color
        tabBarInactiveTintColor: '#808080', // Inactive icon color
        tabBarStyle: { backgroundColor: '#FFFFFF', height: 60 }, // Tab bar styling
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={isUserLogin ? Profile : ProfileWithoutLogin}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Orders"
        component={Orders}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>  );
};
const DeliveryDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDelivertDrawerContent {...props} />}>
      <Drawer.Screen name="DeliveryStack" component={DeliveryPartnerStackNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="UserDrawer" component={UserDrawerNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}

// Wrap everything inside a single NavigationContainer
export default function App() {
//   useEffect(() => {
//   // Hide splash screen once React Native is ready
//   SplashScreen.hide();
// }, []);

  return (
    <NavigationContainer>
      <UserDrawerNavigator />
    </NavigationContainer>
  );
};