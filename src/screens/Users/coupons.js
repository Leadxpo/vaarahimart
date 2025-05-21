import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList,Dimensions, Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Surface, TextInput } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../../Redux/Actions/userAction';
import { fetchCoupons } from '../../Redux/Actions/couponAction';

export default function Coupons({navigation}) {
    const [coupon, setCoupon] = useState('');
    
    const { loading: loadingCoupons, coupons, error: couponsError } = useSelector(state => state.coupons);
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
    const [userID, setUserID] = useState("");
    const [searchData, setSearchData] = useState([]); // Example caffinData
    const dispatch = useDispatch();
    const width = Dimensions.get("screen").width;
    const height = Dimensions.get("screen").height;

      const handleApply = () => {
const item=coupons.find((couponItem)=>couponItem.coupon_code===coupon)
if (item) {
    const couponData={code:item.coupon_code,type:item.type,couponDiscount:item.coupon_discount,minAmt:item.min_order_amt,maxAmt:item.max_discount_amt,coupon_users:item.coupon_users}
    navigation.navigate("Cart", { CouponData:couponData })    
} else {
    Alert.alert("sorry,No such Coupone ode Avilable");
}
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const fetchTasks = [
              dispatch(fetchCoupons()),
            ];
            if (userInfo && userInfo.id) {
              setUserID(userInfo.id);
              fetchTasks.push(dispatch(getUserById(userInfo.id)));
            }
            await Promise.all(fetchTasks);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
    
        fetchData();
      }, [dispatch, userID]);
    
      useEffect(() => {
        if (coupon.length > 0) {
          const filtered = coupons.filter(couponItem =>
            couponItem.coupon_code.toLowerCase().includes(coupon.toLowerCase())
          );
          setSearchData(filtered);
        } else {
          setSearchData(coupons);  // Reset to all products when query is empty
        }
      }, [coupon, coupons]);  // Only runs when debounced query or products change
    

    const renderCouponsItem = ({item}) => {
        return (
            <Surface mode='elevated' elevation={3} key={item.id} style={{width:width/1.1,backgroundColor:'white',margin:10}}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <Text style={[styles.subTitle, { color: "#6c290f",marginStart:5 }]}>{item.coupon_code}</Text>
                    <Text style={[styles.subTitle, { color: "#f46f2e" }]}  onPress={() => { 
                        const couponData={code:item.coupon_code,type:item.type,couponDiscount:item.coupon_discount,minAmt:item.min_order_amt,maxAmt:item.max_discount_amt,coupon_users:item.coupon_users}
                        navigation.navigate("Cart", { CouponData:couponData }) }}>Apply</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Icon name="circle" size={14} color="gray" />
                <Text style={[styles.subTitle, { color: "gray",textAlign:'justify',width:'90%'}]}>Get {item.coupon_discount}% discount on first order and valid once per card using the offer period</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Icon name="circle" size={14} color="gray" />
                <Text style={[styles.subTitle, { color: "gray",textAlign:'justify',width:'90%'}]}>Minimum Order Amount to add this coupon is INR{item.min_order_amt}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Icon name="circle" size={14} color="gray" />
                <Text style={[styles.subTitle, { color: "gray",textAlign:'justify',width:'90%'}]}>Maximum order amount is {item.max_discount_amt} Customer use this coupon only one time avalable.</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <Icon name="circle" size={14} color="gray" />
                <Text style={[styles.subTitle, { color: "gray",textAlign:'justify',width:'90%'}]}>coupon Validtill {item.vallidData}.</Text>
                </View>
            </Surface>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex:1}}>
                <TextInput value={coupon} mode='outlined' placeholder='Coupon' onChangeText={setCoupon} outlineColor='#f46f2e' activeOutlineColor='#f46f2e' textColor='#6c290f' placeholderTextColor={'#aaaaaa'} style={{ height: 40,marginTop:20, width: width/1.1,alignSelf:'center'}} 
                right={
                   <TextInput.Affix
                        width={70}
                        text={
                            <TouchableOpacity onPress={handleApply}>
                                <Text style={{ color: '#f46f2e', fontWeight: '600' }}>Apply</Text>
                            </TouchableOpacity>
                        }
                    />
                }></TextInput>
                <View >

                </View>
                <Text style={[styles.subTitle, { marginVertical: 30 }]}>Available Coupon</Text>

                <FlatList
                    data={searchData}  
                    renderItem={renderCouponsItem}
                    ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>No Coupons are Available For This User</Text></View>}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    subTitle: {
        color:"#6c290f",
        fontSize: 15,
        fontWeight: '700'
    },
    image: {
        width: 300,
        height: 200,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    homeButton: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 30,
        marginBottom: 20,
    },
    homeButtonText: {
        color: '#f46a11',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ordersButton: {
        borderColor: '#fff',
        borderWidth: 2,
        width: '80%',
        borderRadius: 30,
    },
    ordersButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
