import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  deleteWishlist,
  fetchWishlists,
} from '../../Redux/Actions/wishlistAction';
import {
  createCarts,
  fetchCarts,
  updateCartByProductID,
} from '../../Redux/Actions/cartAction';
import { addToCart, updateCartItem } from '../../Redux/Actions/cartItemsAction';

const Wishlist = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userDetails);
  const { wishlists } = useSelector((state) => state.wishlists);
  const { carts } = useSelector((state) => state.carts);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        await dispatch(fetchWishlists(userInfo.id));
        await dispatch(fetchCarts(userInfo.id));
      }
    };
    fetchData();
  }, [dispatch, userInfo]);

  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = async (id) => {
    try {
      await dispatch(deleteWishlist(userInfo.id, id));
      await dispatch(fetchWishlists(userInfo.id));
      handleCloseModal();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    const existingCartItem = carts.find((item) => item.product_id.toString() === product.id.toString());
    try {
      if (existingCartItem) {
        // Update cart item quantity
        await dispatch(updateCartItem(product.id, productCount + 1));
        await dispatch(updateCartByProductID(userInfo.id, product, 1));
        await dispatch(fetchCarts(userInfo.id));
      } else {
        // Add new product to cart
        await dispatch(addToCart(product));
        await dispatch(createCarts(userInfo.id, product));
        await dispatch(fetchCarts(userInfo.id));
      }
      await dispatch(fetchCarts(userInfo.id));
      handleCloseModal();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Render a single wishlist item
  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectItem(item)}>
      <Surface style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productUnit}>{item.pack}</Text>
          <Text style={styles.productPrice}>{`₹${item.price}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIcon}
          onPress={() => handleSelectItem(item)}
        >
          <MaterialCommunityIcons name="delete-outline" size={28} color="#6c290f" />
        </TouchableOpacity>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Wishlist Items */}
      <FlatList
        data={wishlists}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}s
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Your wishlist is empty!</Text>
        )}
      />

      {/* Modal for Item Actions */}
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.bottomSheet}>
              <Text style={styles.modalTitle}>
                Are you sure you want to remove this item from your wishlist?
              </Text>
              <Surface style={styles.productItem}>
                <Image source={{ uri: selectedItem.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{selectedItem.name}</Text>
                  <Text style={styles.productUnit}>{`${selectedItem.weight} ${selectedItem.units}`}</Text>
                </View>
                <Text style={[styles.productPrice, styles.boldText]}>
                  ₹{selectedItem.price}
                </Text>
              </Surface>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.moveCartButton}
                  onPress={() => handleAddToCart(selectedItem)}
                >
                  <Text style={styles.buttonCartText}>Move to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromWishlist(selectedItem.id)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  list: {
    padding: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 12,
    elevation: 2,
    marginBottom: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c290f',
  },
  productUnit: {
    fontSize: 12,
    color: 'gray',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
  },
  deleteIcon: {
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: 'gray',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  moveCartButton: {
    backgroundColor: '#f46f2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: '#fff',
    borderColor: '#f46f2e',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#f46f2e',
    fontWeight: 'bold',
  },
  buttonCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  boldText: {
    fontWeight: '600',
  },
});

export default Wishlist;
