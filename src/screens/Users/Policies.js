import React from 'react';
import { View, Linking, StyleSheet } from 'react-native';
import { Text, Appbar, List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Policies = ({ navigation }) => {
  // Function to handle the onPress action
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <View style={styles.container}>
      {/* Appbar for Title */}
      <Appbar.Header style={styles.header}>
      <Appbar.Action
        icon="arrow-left"
        onPress={() => navigation.goBack()} // Handle back navigation
        style={styles.circularButton}
        color="#6c290f"
      />
      <Appbar.Content
        title="Vaarahi Mart Policies"
        titleStyle={styles.titleStyle}
      />
    </Appbar.Header>

      {/* List Items */}
      <View style={styles.content}>
        <List.Item 
        style={{backgroundColor:"#6a2911",elevation:3,marginVertical:15,borderRadius:8}} titleStyle={{color:"#ffffff",fontWeight:"600",fontSize:20}} 
          title="Privacy Policy"
          left={(props) => (
            <MaterialCommunityIcons {...props} name="shield-check" size={28} color={'#ffffff'} />
          )}
          right={(props) => (
            <MaterialCommunityIcons {...props} name="link" size={28} color={'#ffffff'} />
          )}
          onPress={() => handlePress('https://vaarahimart.com/privacyPolicy.html')}
        />
        <List.Item 
        style={{backgroundColor:"#6a2911",elevation:3,marginVertical:15,borderRadius:8}} titleStyle={{color:"#ffffff",fontWeight:"600",fontSize:20}}
          title="Shipping Policy" 
          left={(props) => (
            <MaterialCommunityIcons {...props} name="truck-fast" size={28} color={'#ffffff'} />
          )}
          right={(props) => (
            <MaterialCommunityIcons {...props} name="link" size={28} color={'#ffffff'} />
          )}
          onPress={() => handlePress('https://vaarahimart.com/shippingPolicy.html')}
        />
        <List.Item 
        style={{backgroundColor:"#6a2911",elevation:3,marginVertical:15,borderRadius:8}} titleStyle={{color:"#ffffff",fontWeight:"600",fontSize:20}}
          title="Refund Policy" 
          left={(props) => (
            <MaterialCommunityIcons {...props} name="cash-refund" size={28} color={'#ffffff'} />
          )}
          right={(props) => (
            <MaterialCommunityIcons {...props} name="link" size={28} color={'#ffffff'} />
          )}
          onPress={() => handlePress('https://vaarahimart.com/returnPolicy.html')}
        />
        <List.Item
         style={{backgroundColor:"#6a2911",elevation:3,marginVertical:15,borderRadius:8}} titleStyle={{color:"#ffffff",fontWeight:"600",fontSize:20}} 
          title="Terms and Conditions"
          left={(props) => (
            <MaterialCommunityIcons {...props} name="file-document" size={28} color={'#ffffff'} />
          )}
          right={(props) => (
            <MaterialCommunityIcons {...props} name="link" size={28} color={'#ffffff'} />
          )}
          onPress={() => handlePress('https://vaarahimart.com/Terms&Conditions.html')}
        />
        <List.Item
         style={{backgroundColor:"#6a2911",elevation:3,marginVertical:15,borderRadius:8}} titleStyle={{color:"#ffffff",fontWeight:"600",fontSize:20}}
          title="Permenent User Delete Request"
          left={(props) => (
            <MaterialCommunityIcons {...props} name="delete" size={28} color={'#ffffff'} />
          )}
          right={(props) => (
            <MaterialCommunityIcons {...props} name="link" size={28} color={'#ffffff'} />
          )}
          onPress={() => handlePress('https://vaarahimart.com/userDeleteRequest.html')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
});

export default Policies;
