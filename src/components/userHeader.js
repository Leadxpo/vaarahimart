// Header.js
import React,{useState,useEffect} from 'react';
import { View, Text, Image,FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge, TextInput } from 'react-native-paper'; // For the badge on the cart icon
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

const Header = ({ onSearchQuery, title = 'Vaarahi Mart', showCart = true }) => {
    const navigation = useNavigation();
    const cartItems = useSelector((state) => state.cartItems.cartItems);

    const cartItemCount = Object.keys(cartItems).length;
    const [searchQuery, setSearchQuery] = useState('');
    // const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        onSearchQuery(searchQuery)
    }, [searchQuery, onSearchQuery]); // Ensure correct dependencies
    //     // Handle search submission
    // const handleSearchSubmit = () => {
    //     navigation.navigate('AllProducts', { searchQuery });
    // };


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
                <Image source={require('../utilities/images/logo.png')} style={styles.logo} />

                {/* Cart Icon with Badge */}
                {showCart && (
                    <View>
                        <TouchableOpacity
                        onPress={() => navigation.navigate('Cart')}
                        >
                            <Icon name="cart" size={30} color="#900" />
                            {/* Badge for cart item count */}
                            {cartItemCount > 0 && (
                                <Badge style={styles.cartBadge}>{cartItemCount}</Badge>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {/* Menu Icon */}

            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    mode='outlined'
                    outlineColor='#f3f3f3'
                    activeOutlineColor='#f3f3f3'
                    placeholderTextColor={'#aaaaaa'}
                    textColor='#6c290f'
                    style={styles.searchPlaceholder}
                    right={<TextInput.Icon icon='magnify' />}
                    placeholder='Search products...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
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
    logo: {
        width:150,
        height: 55,
      },    
    searchBar: {
        backgroundColor: '#fff',
        padding: 8,
        marginTop: 5,
        borderRadius: 8, 
        width: "90%",
        justifyContent: 'center',
    },
    searchPlaceholder: {
        color: '#6c290f',
        fontSize: 16,
        height:35
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f46f2e',  // Tomato color for the logo text
    },
    cartBadge: {
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
    suggestionList: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 8,
        marginTop: 8,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
});

export default Header;
