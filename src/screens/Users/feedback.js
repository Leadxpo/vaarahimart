import React, { useState,useEffect,useCallback } from 'react';
import { View, StyleSheet, TextInput, Text,FlatList, TouchableOpacity,ScrollView } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { createReviews, getReviews } from '../../Redux/Actions/reviewAction';
import { useFocusEffect } from '@react-navigation/native';
import { getUserById } from '../../Redux/Actions/userAction';
const Feedback =({ navigation, route }) => {
    const [checked, setChecked] = useState('general'); // default selection for radio buttons
    const [feedback, setFeedback] = useState('');
    const [userID, setUserID] = useState("");
    const dispatch = useDispatch();
    const { loading: loadingReviews, reviews, error: reviewsError } = useSelector(state => state.reviews);
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);

    const handleSubmit = async () => {
        // Handle the feedback submission logic here
        await dispatch(createReviews(userInfo.id,feedback));
    };

    const renderReviewsItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectItem(item)}>
          <Surface style={styles.productItem}>
            <View style={{width:"100%",height:80,justifyContent:'center',alignSelf:'center',backgroundColor:'#f6f6f6'}}>
              <Text style={styles.productName}>{item.createdAt}</Text>
            </View>
              <Text style={styles.productItem}>
                {item.review}
              </Text>
          </Surface>
        </TouchableOpacity>
      );
    

    const fetchData = async () => {
        
        if (userInfo?.id) {
          setUserID(userInfo.id);
          try {
            await dispatch(getReviews(userInfo.id));
            await dispatch(getUserById(userInfo.id));
          } catch (error) {
            console.log("error : ", error);
          }
        }
      };

      useFocusEffect(
        useCallback(() => {
          fetchData();
        }, [dispatch])
      );
    

    return (
        <ScrollView>

            <View style={styles.container}>
                <View style={{ backgroundColor: '#f46f2e', flex: 1, borderBottomEndRadius: 15, borderBottomStartRadius: 15 }}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
                        <Icon name="arrow-left" size={28} color="white" />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.title}>Feed Back & Support</Text>

                </View>
                <View style={{ padding: 20, flex: 1 }}>

                    {/* Greeting Section */}
                    <Text style={styles.heading}>Hello!</Text>
                    <Text style={styles.subHeading}>Your Review will help us to give you a better experience</Text>

                    <FlatList
                    data={reviews}
                    renderItem={renderReviewsItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={<View><Text style={{color:'#aaaaaa',fontWeight:'600',fontSize:18}}>No Review Posted You</Text></View>}
                    contentContainerStyle={styles.productList}
                   
                  />
                    {/* Radio Buttons for Feedback Type */}
                    <View style={styles.radioGroup}>
                        <RadioButton.Group
                            onValueChange={value => setChecked(value)}
                            value={checked}
                        >
                            <View style={styles.radioItem}>
                                <RadioButton.Android value="general" />
                                <Text style={styles.radioLabel}>General Feedback</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton.Android value="features" />
                                <Text style={styles.radioLabel}>Features & Suggestions</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton.Android value="technical" />
                                <Text style={styles.radioLabel}>Technical Info</Text>
                            </View>
                        </RadioButton.Group>
                    </View>

                    {/* Feedback Input */}
                    <Text style={styles.feedbackText}>
                        If You have any other feedback, please tell us here. We love to improve our service.
                    </Text>
                    <TextInput
                        style={styles.feedbackInput}
                        placeholder="Enter your feedback here"
                        multiline={true}
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    {/* Submit Button */}
                    <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                        Submit
                    </Button>
                </View>

            </View>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        backgroundColor: '#f46a11',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#f3f3f3',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30
    },
    subHeading: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        color: '#888',
    },
    radioGroup: {
        marginTop: 20,
        marginBottom: 30,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6c290f',
      },
    productText: {
        fontSize: 14,
        color: 'gray',
      },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioLabel: {
        fontSize: 16,
        color:"#6c290f"
    },
    feedbackText: {
        fontSize: 14,
        marginBottom: 10,
        color: '#555',
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
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#f46a11',
        borderRadius: 10,
        padding: 10,
        height: 100,
        color:"#6c290f",
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#f46a11',
        paddingVertical: 10,
        borderRadius: 5,
    },
    productList: {
        paddingLeft: 16,
        justifyContent: 'center',
        marginBottom: 16,
      },
    
});

export default Feedback;
