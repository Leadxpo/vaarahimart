import React ,{useEffect,useState}from 'react';
import { View, Text, StyleSheet, Dimensions, Alert,  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Surface } from 'react-native-paper';// Mock Data for Categories and Products
import { useDispatch, useSelector } from 'react-redux';
import { updateNotification } from '../../Redux/Actions/notificationAction';

const NotificationDetails = ({navigation,route}) => {

  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { NotificationDetails } = route.params;
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setUserID(userInfo.id);
        await dispatch(updateNotification(userInfo.id,NotificationDetails));
      }
    };

    fetchData();
  }, [dispatch, userInfo]);
  return (
    <SafeAreaView style={styles.container}>
          <Divider style={{ height: 1, width: width,marginVertical:10, backgroundColor: '#f5f5f5' }}></Divider>
        <View style={styles.header}>
        <Text style={{fontSize:20,color:"#6c290f",fontWeight:'bold'}}>{NotificationDetails.name}</Text>
        </View>
        <Divider style={{ height: 1, width: width,marginVertical:10, backgroundColor: '#f5f5f5' }}></Divider>
        <Text style={{fontSize:12,color:"#f9f9f9",marginTop:5,alignSelf:'flex-end'}}>{NotificationDetails.date_time}</Text>
        <View>
        <Text style={{fontSize:18,color:"#000000",marginTop:20}}>Description : </Text>
        <Text style={{fontSize:14,color:"#6c290f",marginTop:10}}>{NotificationDetails.description}</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    backgroundColor: '#fff',
    justifyContent:'center',alignSelf:'center'
  },
  input: {
    width: '100%',color:"#6c290f",
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Shadow for Android
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
});

export default NotificationDetails;
