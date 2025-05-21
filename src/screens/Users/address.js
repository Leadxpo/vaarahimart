import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress, fetchAddresses } from '../../Redux/Actions/addressAction';
import { getUserById, updateUser } from '../../Redux/Actions/userAction';
import { useFocusEffect } from '@react-navigation/native';
const Address = ({ navigation, route }) => {

  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingAddressesData, addresses, error: AddressesError } = useSelector(state => state.addresses);
  const { loading: loadingRunningOrder, orderData, error: RunningOrderError } = useSelector(state => state.runningOrder);

  const dispatch = useDispatch();
  const [userID, setUserID] = useState('');
  const { addressType } = route.params;  // Sample address data

  const fetchData = async () => {
    if (userInfo?.id) {
      setUserID(userInfo.id);
      try {
        await dispatch(fetchAddresses(userInfo.id));
        await dispatch(getUserById(userInfo.id));
      } catch (error) {
        console.log("error : ", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [dispatch,addresses])
  );

  const removeAddress = async (id) => {
    try {
      await dispatch(deleteAddress(userInfo.id, id));
      await dispatch(fetchAddresses(userInfo.id));
    } catch (error) {
      console.log("Error :", error)
    }
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      if (addressType === "billing") {
        userdata = { userID: userInfo.id, billing_address: item.id }
        dispatch(updateUser(userdata))
        navigation.push("AddressCheckout")
      }
      if (addressType === "shipping") {
        userdata = { userID: userInfo.id, shiping_address: item.id }
        dispatch(updateUser(userdata))
        navigation.push("AddressCheckout")
      }
    }}>
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="account-outline" size={22} color="#333" />
        <Text style={styles.detailText}>{item.name}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="phone-outline" size={22} color="#333" />
        <Text style={styles.detailText}>{item.phone_no}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={22} color="#333" />
        <View>
          <Text style={styles.detailText}>{item.address_line_one},</Text>
          <Text style={styles.detailText}>{item.address_line_two},</Text>
          <Text style={styles.detailText}>{item.city},</Text>
          <Text style={styles.detailText}>{item.state},</Text>
          <Text style={styles.detailText}>{item.pincode}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditAddress", { addressData: item })}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeAddress(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{addressType}</Text>
      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}> Addresses Not Added As of Now</Text></View>}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text>No Address Found</Text>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddAddress')}>
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    width: '95%',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5, alignSelf: 'center',
    elevation: 5, // For Android shadow
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6c290f',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#D35400',
    padding: 10,
    borderRadius: 5,
    width: 80
  },
  removeButton: {
    borderColor: '#D35400',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  removeButtonText: {
    color: '#D35400',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#D35400',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Address;
