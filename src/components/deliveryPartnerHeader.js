// Header.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper'; // For the badge on the notification icon
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliveryHeader = ({notificationItemCount = 0,  title = 'Vaarahi Mart', showNotification = true }) => {
    const navigation = useNavigation();
    const openMenu = () => {
        navigation.openDrawer();  // This will now work
    };      

    return (
        <View style={styles.headerContainer}>

            <View style={styles.titleContainer}>
                <TouchableOpacity onPress={openMenu} style={styles.menuIconContainer}>
                    <Icon name="menu" size={30} color="#900" />
                </TouchableOpacity>

                {/* Logo */}
                <Text style={styles.logoText}>{title}</Text>

                {/* notification Icon with Badge */}
                {showNotification && (
                    <View>
                        <TouchableOpacity
                        // onPress={() => navigation.navigate('notification')}
                        >
                            <Icon name="bell" size={30} color="#900" />
                            {/* Badge for notification item count */}
                            {notificationItemCount > 0 && (
                                <Badge style={styles.notificationBadge}>{notificationItemCount}</Badge>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#F5F8E2',  // Light greenish background
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingTop: 20,
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchBar: {
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 5,
        borderRadius: 8, width: "90%",
        justifyContent: 'center',
    },
    searchPlaceholder: {
        color: '#aaa',
        fontSize: 16,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f46f2e',  // Tomato color for the logo text
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#f46f2e',
        color: '#fff',
        fontSize: 10,
    },
    menuIconContainer: {
        padding: 5,
    },
});

export default DeliveryHeader;
