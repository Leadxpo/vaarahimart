import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Surface } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../Redux/Actions/notificationAction';

const Notification = ({ navigation }) => {

  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const { loading: loadingNotifications, notifications, error: notificationsError } = useSelector(state => state.notifications);
  
  const dispatch = useDispatch();
  const [userID, setUserID] = useState('');

  // Sample data for notifications
  const renderItem = ({ item }) => (
    <View style={styles.card} key={item.id} >
      <View style={styles.cardContent}>
        {/* Avatar Image */}
        <Avatar.Image size={50} source={{ uri: item.image }} />
        <View style={styles.textContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
      {/* 'Show Details' Button */}
      <TouchableOpacity style={styles.showDetailsButton} onPress={() => { navigation.navigate("NotificationDetails", { NotificationDetails: item }) }}>
        <Text style={styles.showDetailsText}>Show Details</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color="#D35400" />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setUserID(userInfo.id);
        await dispatch(fetchNotifications(userInfo.id));
      }
    };

    fetchData();
  }, [dispatch, userInfo]);


  return (
    <View style={styles.container}>
      {
        notifications.length>0 ? (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>Notification Not Available For This User</Text></View>}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Surface style={{backgroundColor:"#f9f9f9",justifyContent:'center'}}>
            <Text style={{ fontSize: 20, letterSpacing: 1, color: '#6c290f',padding:10}}>
              No Notification data has found to this User Yet
            </Text>
          </Surface>
        )
      }

    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6c290f',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  showDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  showDetailsText: {
    fontSize: 14,
    color: '#D35400',
    marginRight: 5,
  },
});

export default Notification;
