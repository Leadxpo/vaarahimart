import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar, Card, Divider, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import { useDispatch, useSelector } from 'react-redux';
import { deleteDeliveryStaffDetails } from '../Redux/Actions/deliveryStaffAction';
import { removeData } from '../Utils/appData';
import { deletePendingRequestsbyStaffID } from '../Redux/Actions/requestAction';
import { deleteAssignedOrderByStaffID } from '../Redux/Actions/orderAction';
import { deleteStaffNotifications } from '../Redux/Actions/notificationAction';
const DrawerItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="#D35400" />
        <Text style={styles.drawerItemText}>{label}</Text>
    </TouchableOpacity>
);

export default function CustomDelivertDrawerContent(props) {
    const dispatch = useDispatch();


    const { deliveryStaffInfo } = useSelector(state => state.deliveryStaffDetails);
    const isStaffLoggedIn = Boolean(deliveryStaffInfo?.staff_id);
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{}}>
            <View style={styles.drawerHeader}>
                <Avatar.Image source={ deliveryStaffInfo.image ? {uri:`https://vaarahimart.com/storage/images/staffDP/${deliveryStaffInfo?.image}`}:require("../utilities/images/logo.png")} size={80} style={{ elevation: 3, backgroundColor: "#fff", justifyContent: 'center' }} />
                <Text style={styles.userName}>Hi, {deliveryStaffInfo?.name}</Text>
                <Text style={{ fontSize: 16, color: '999999' }}> {deliveryStaffInfo?.staff_id}</Text>
            </View>
            <View style={styles.drawerItems}>

                <DrawerItem
                    icon="account"
                    label="About"
                    onPress={() => props.navigation.navigate('About')}
                />

                <DrawerItem
                    icon="clipboard-list"
                    label="Delivery Orders"
                    onPress={() => props.navigation.navigate('Orders')}
                />
                <DrawerItem
                    icon="map-marker"
                    label="My Address Book"
                    onPress={() => props.navigation.navigate('MyAddressBook')}
                />
                <DrawerItem
                    icon="bell"
                    label="Notifications"
                    onPress={() => props.navigation.navigate('Notifications')}
                />
                <DrawerItem
                    icon="file-document-edit-outline"
                    label="Requests"
                    onPress={() => props.navigation.navigate('Requests')}
                />
                <DrawerItem
                    icon="wallet"
                    label="Wallet"
                    onPress={() => props.navigation.navigate('Wallet')}
                />
                <DrawerItem
                    icon="headset"
                    label="Feedback & Support"
                    onPress={() => props.navigation.navigate('FeedbackSupport')}
                />
                <DrawerItem
                    icon="help-circle"
                    label="Help & Support"
                    onPress={() => props.navigation.navigate('HelpSupport')}
                />
                <DrawerItem
                    icon="file-document"
                    label="Refund Policy"
                    onPress={() => props.navigation.navigate('RefundPolicy')}
                />
                <DrawerItem
                    icon="file-document-outline"
                    label="Terms and Conditions"
                    onPress={() => props.navigation.navigate('TermsConditions')}
                />
            </View>
            {/* Sign out button */}
            <View style={styles.signOutSection}>
                <TouchableOpacity style={styles.signOutButton} onPress={() => {
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

                                        if (isStaffLoggedIn) {

                                            fetchTasks.push(
                                                dispatch(deletePendingRequestsbyStaffID()),
                                                dispatch(deleteDeliveryStaffDetails()),
                                                dispatch(deleteAssignedOrderByStaffID()),
                                                dispatch(deleteStaffNotifications()),
                                            );
                                        }
                                        await Promise.all(fetchTasks);
                                        await removeData("isStaffLogin");
                                        await removeData("role");
                                        await removeData("delivryStaffData")
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'DeliveryDrawer' }], // Reset stack to the Home screen
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
                <TouchableOpacity style={styles.deliveryPartnerButton} onPress={() => props.navigation.navigate('UserDrawer')}>
                    <MaterialCommunityIcons name="arrow-left" size={16} color="#fff" />
                    <Text style={styles.deliveryPartnerText}>User</Text>
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
        fontSize: 14,
        fontWeight: '700'
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
