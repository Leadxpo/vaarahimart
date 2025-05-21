import { View, Text, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Surface } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryStaffById } from '../../Redux/Actions/deliveryStaffAction';
import { getUserById } from '../../Redux/Actions/userAction';

export default function BankInfo({ navigation }) {

    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const [userID, setuserID] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            if (userInfo?.id) {
                setuserID(userInfo.id);
                try {
                    await dispatch(getUserById(userInfo.staff_id));
                } catch (error) {
                    console.log("error : ", error);
                }
            }
        };
        fetchData();
    }, [dispatch, userID]);

    const handleChangeBankInfo = () => {
        NavigationContainer.navigate("userBankDetails", { UserData: userInfo})
    }

    return (
        <Surface>
            <View style={styles.card}>
                <View style={styles.detailRow}>
                    <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="account-outline" size={22} color="#333" />
                        <Text style={styles.detailText}>Bank Name</Text>
                    </View>
                    <Text style={[styles.detailText, { flex: 1 }]}>{userInfo.bank_name}</Text>

                </View>
                <View style={styles.detailRow}>
                    <View style={{ flexDirection: "row", flex: 3 }}>
                        <MaterialCommunityIcons name="account" size={22} color="#333" />
                        <Text style={styles.detailText}>AccountHolderName</Text>
                    </View>
                    <Text style={[styles.detailText, { flex: 1 }]}>{userInfo.bank_account_holder_name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <View style={{ flexDirection: "row", flex: 3 }}>
                        <MaterialCommunityIcons name="money" size={22} color="#333" />
                        <Text style={styles.detailText}>AccountNumber</Text>
                    </View>
                    <Text style={[styles.detailText, { flex: 1 }]}>{userInfo.bank_acount_no}</Text>
                </View>
                <View style={styles.detailRow}>
                    <View style={{ flexDirection: "row", flex: 3 }}>
                        <MaterialCommunityIcons name="map-marker-outline" size={22} color="#333" />
                        <Text style={styles.detailText}>IFSC</Text>
                    </View>
                    <Text style={[styles.detailText, { flex: 1 }]}>{userInfo.bank_ifsc}</Text>
                </View>
                <View style={styles.detailRow}>
                    <View style={{ flexDirection: "row", flex: 3 }}>
                        <MaterialCommunityIcons name="map-marker-outline" size={22} color="#333" />
                        <Text style={styles.detailText}>Branch Name</Text>
                    </View>
                    <Text style={[styles.detailText, { flex: 1 }]}>{userInfo.bank_branch}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleChangeBankInfo}>
                <Text style={styles.buttonText}>Change Bank Info</Text>
            </TouchableOpacity>
        </Surface>
    )
}

const styles = StyleSheet.create({
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
        fontSize: 14,
        color: '#6c290f',
    },
    button: {
        backgroundColor: '#FF7F45',
        width: '100%',
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})