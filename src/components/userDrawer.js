import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUerDetails } from '../Redux/Actions/userAction';
import { deleteRecentOrders } from '../Redux/Actions/recentOrdersAction';
import { deleteUserCarts } from '../Redux/Actions/cartAction';
import { deleteUserAddress } from '../Redux/Actions/addressAction';
import { loadData, removeData } from '../Utils/appData'

const DrawerItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#D35400" />
        <Text style={styles.drawerItemText}>{label}</Text>
    </TouchableOpacity>
);


export default function CustomUserDrawerContent(props) {
    const dispatch = useDispatch();
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const isLoggedIn = Boolean(userInfo?.id);

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{}}>
            <View style={styles.drawerHeader}>
                <Text style={styles.userName}>Hi,{userInfo.name ? userInfo.name : "User"}</Text>
                <Text style={styles.userEmail}>{userInfo.phone_no ? userInfo.phone_no : "XXXXXXXXXX"}</Text>
            </View>

            <View style={styles.drawerItems}>
                <DrawerItem
                    icon="home"
                    label="Home"
                    onPress={() => props.navigation.navigate('Bottom_Home')}
                />
                <DrawerItem
                    icon="heart"
                    label="Wishlist"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Wishlist')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />
                <DrawerItem
                    icon="bank"
                    label="Bank Acount"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('UserBankInfo')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />
                <DrawerItem
                    icon="bell"
                    label="Notification"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Notification')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                    
                />
                <DrawerItem
                    icon="clipboard-list"
                    label="My Orders"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Orders')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />
                <DrawerItem
                    icon="account"
                    label="Profile"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Profile')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />
                <DrawerItem
                    icon="ticket"
                    label="Ticket"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Tickets')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />

                <DrawerItem
                    icon="message"
                    label="Feedback & Support"
                    onPress={() => {
                        if (isLoggedIn) {

                            props.navigation.navigate('Feedback')
                        } else {
                            props.navigation.navigate('ProfileWithoutLogin')
                        }
                    }}
                />

                <DrawerItem
                    icon="headset"
                    label="Contact Us"
                    onPress={() => props.navigation.navigate('About')}
                />

                <DrawerItem
                    icon="file-document-outline"
                    label="Terms and Conditions"
                    onPress={() => props.navigation.navigate('Policies')}
                />
            </View>
            {/* Sign out button */}
            <View style={styles.signOutSection}>
                {isLoggedIn ? (<TouchableOpacity style={styles.signOutButton} onPress={() => {
                    Alert.alert(
                        "Logout",
                        "Are you sure ,You want to logout?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Logout",
                                onPress: async () => {
                                    try {
                                        const fetchTasks = [];

                                        if (isLoggedIn) {

                                            fetchTasks.push(
                                                dispatch(deleteRecentOrders()),
                                                dispatch(deleteUerDetails()),
                                                dispatch(deleteUserCarts()),
                                                dispatch(deleteUserAddress()),
                                            );
                                        }
                                        await Promise.all(fetchTasks);
                                        await removeData("role");
                                        await removeData("isLogin");
                                        await removeData("userData");
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }], // Reset stack to the Home screen
                                        });
                                    } catch (error) {
                                        console.error('Failed to fetch data:', error);
                                    }


                                }// Navigate to your login screen
                            }
                        ],
                        { cancelable: false }  // Prevent dismissing by clicking outside the alert
                    );

                }}>
                    <MaterialCommunityIcons name="logout" size={22} color="#fff" />
                    <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.signOutButton} onPress={() => {
                        Alert.alert(
                            "Login",
                            "Are you sure ,You want to login?",
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel"
                                },
                                {
                                    text: "Login",
                                    onPress: async () => {
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'login' }], // Reset stack to the Home screen
                                        });
                                    }// Navigate to your login screen
                                }
                            ],
                            { cancelable: false }  // Prevent dismissing by clicking outside the alert
                        );

                    }}>
                        <MaterialCommunityIcons name="logout" size={22} color="#fff" />
                        <Text style={styles.signOutText}>Sign In</Text>
                    </TouchableOpacity>

                )}
                <TouchableOpacity style={styles.deliveryPartnerButton} onPress={async () => {
                    const isUserLogin = await loadData("isLogin");
                    const role = await loadData("role");
                    if (isUserLogin && role === "user") {
                        Alert.alert("USER", "You logged in as USER so you can't login as delivery partner.", [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "User Logout", onPress: async () => {
                                    try {
                                        const fetchTasks = [];
                                        fetchTasks.push(
                                            dispatch(deleteRecentOrders()),
                                            dispatch(deleteUerDetails()),
                                            dispatch(deleteUserCarts()),
                                            dispatch(deleteUserAddress()),
                                        );
                                        await Promise.all(fetchTasks);
                                        await removeData("role");
                                        await removeData("isLogin");
                                        await removeData("userData");
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }], // Reset stack to the Home screen
                                        });
                                    } catch (error) {
                                        console.error('Failed to fetch data:', error);
                                    }
                                }
                            }
                        ]);
                    } else {
                        props.navigation.navigate('DeliveryDrawer')
                    }
                }}
                >
                    <Text style={styles.deliveryPartnerText}>Delivery Partner</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
}



const styles = StyleSheet.create({
    drawerHeader: {
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6c290f',
    },
    userEmail: {
        fontSize: 14,
        color: '#777',
    },
    drawerItems: {
        flex: 1,
        marginTop: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    drawerItemText: {
        marginLeft: 20,
        fontSize: 16,
        color: '#6c290f',
    },
    signOutSection: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        padding: 20,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D35400',
        padding: 10,
        width: 150,
        borderRadius: 5,
        marginBottom: 80
    },
    signOutText: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 16,
    },
    deliveryPartnerButton: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        backgroundColor: '#F39C12',
        padding: 10,
        width: 150,
        borderRadius: 5,
    },
    deliveryPartnerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700'
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
