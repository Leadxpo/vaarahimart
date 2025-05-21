import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DeliveryNotification= () => {
  // Sample data for notifications
  const [notifications, setNotifications] = useState([ 
    {
      id: '1', 
      title: 'Hurry! Apple is now in shop',
      description: 'Get an offer for fruits 30%-50% off on selected apples and these are available upto 23 Jan.',
      time: 'Today, 12:00 AM',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Apple',
    },
    {
      id: '2',
      title: '75% Off On Floor Cleaner',
      description: 'Get an offer for floor cleaner 75% off, available upto 26 Jan.',
      time: 'Today, 1:00 PM',
      image: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=Cleaner',
    },
    {
      id: '3',
      title: 'Last Chance To Grab Vegetables',
      description: 'Get an offer for vegetables 50%-30% off, available today.',
      time: 'Today, 12:00 AM',
      image: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=Vegetables',
    },
    {
      id: '4',
      title: '80% Off on Online Grocery',
      description: 'Get an offer for fruits 80% off, valid until 23 Jan.',
      time: 'Yesterday, 3:00 PM',
      image: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=Grocery',
    },
    {
      id: '5',
      title: 'Big Grand Sale is Live!',
      description: 'Get an offer for fruits 30%-50% off, available upto 23 Jan.',
      time: '2 days ago',
      image: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=Sale',
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.textContent}>
          <Text style={styles.title}>#{item.id}-{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>Notifications Not Found</Text></View>}
        contentContainerStyle={styles.list}
      />
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

export default DeliveryNotification;
