import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { getUserById, updateUser, updateUserDP } from '../../Redux/Actions/userAction';
import store from '../../Redux/store';
import { saveData,loadData} from '../../Utils/appData'
import { Screen } from 'react-native-screens';

const Profile = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null);
    const [name, setName] = useState('xxxxxx');
    const [phone, setPhone] = useState('xxxxxx');
    const [email, setEmail] = useState('xxxxxxxx');
    const [image, setImage] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [userData,setUserData] =useState({});
    const [gst, setGst] = useState('');  // Set this if you have GST number
    const [isGstEnabled, setGstEnabled] = useState(false); // For switch state
    const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);

    const defaultImage = require('../../utilities/images/logo.png');
    const profileImageUri = imageUri
        ? { uri: imageUri }
        : image
        ? { uri: `https://vaarahimart.com/storage/images/userDP/${image}` }
        : defaultImage;
    const dispatch = useDispatch();
    // Toggle GST switch
    const toggleGstSwitch = () => setGstEnabled(!isGstEnabled);
    // Image picker for camera or gallery
    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            saveToPhotos: true,
        };

        launchImageLibrary(options, async response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }
            
            if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
                return;
            }
            
            if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0].uri;

                setImageUri(selectedImage);
                const imageupload = new FormData();
                imageupload.append('userdp', {
                  uri: response.assets[0]["uri"],
                  type: response.assets[0]["type"],
                  name: response.assets[0]["fileName"]
                });
                imageupload.append('userID',userData.id)
    
               await dispatch(updateUserDP(imageupload));
               await dispatch(getUserById(userData.id));
               const state = store.getState(); // Assuming you have access to the Redux store
               const userDetailsInfo = state.userDetails.userInfo;
               await saveData('userData', userDetailsInfo);
                       }
        });
    };

    const updateGST=async ()=>{
        const userInfo = { userID: userData.id, gst: gstNumber }
        
        try {
          await dispatch(updateUser(userInfo));
          await dispatch(getUserById(userData.id));
          const state = store.getState(); // Assuming you have access to the Redux store
          const userDetailsInfo = state.userDetails.userInfo;
          await saveData('userData', userDetailsInfo);
        } catch (error) {
          console.log("error :", error);
        }
        navigation.replace('Bottom_Home',{screen:"Profile"});
  
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                try {
                    const fetchTasks = [];
                    const userInfos = await loadData('userData');
                    const isLogin = await loadData('isLogin');
                    setName(userInfos.name);
                    setEmail(userInfos.email);
                    setPhone(userInfos.phone_no);
                    setImage(userInfos.image);
                    setGst(userInfos.gst)
                    setUserData(userInfos)
                    if (isLogin) {
                        fetchTasks.push(
                            dispatch(getUserById(userInfos.id)),
                        );
                    }
                    await Promise.all(fetchTasks);
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                }
            }

            fetchData(); // Call the async function
        }, [dispatch, loadData])
    );



    return (
        <ScrollView>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-start', width: "45%" }} onPress={() => navigation.navigate("Bottom_Home",{screen:'Home'})}>
                            <Icon name="arrow-left" size={30} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                    <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 30 }} onPress={() => navigation.navigate("UserDetails",{userData:userData})}>
                        <Text style={styles.editText}>Edit <Icon name="pencil-outline" size={20} color="white" /></Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Picture */}
                <View style={styles.imageContainer}>
                <Card.Cover source={profileImageUri} resizeMode="stretch" style={styles.profileImage} />
                    <TouchableOpacity style={styles.cameraIcon} onPress={selectImage}>
                        <Icon name="camera" size={25} color="#f46f2e" />
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <View style={styles.infoContainer}>
                    <Icon name="account" size={25} color="#f46f2e" />
                    <Text style={styles.infoLabel}>NAME</Text>
                </View>
                <Text style={styles.infoText}>{name}</Text>

                {/* Phone Number */}
                <View style={styles.infoContainer}>
                    <Icon name="phone" size={25} color="#f46f2e" />
                    <Text style={styles.infoLabel}>PHONE NUMBER</Text>
                </View>
                <Text style={styles.infoText}>{phone}</Text>

                {/* Email */}
                <View style={styles.infoContainer}>
                    <Icon name="email" size={25} color="#f46f2e" />
                    <Text style={styles.infoLabel}>E-mail</Text>
                </View>
                <Text style={styles.infoText}>{email}</Text>

                {/* GST Switch */}
                <View style={styles.container}>
                    {/* If GST exists */}
                    {gst=='' || gst==null ? (
                        <View>
                            {/* If GST is enabled, show input */}
                            <View style={styles.gstContainer}>
                                <Text style={styles.gstLabel}>Know About GST IN</Text>
                                <Switch value={isGstEnabled} onValueChange={toggleGstSwitch} color="#f46f2e" />
                            </View>

                            {isGstEnabled && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter GST Number"
                                        value={gstNumber}
                                        onChangeText={setGstNumber}
                                    />
                                    {/* Submit Button */}
                                    <TouchableOpacity style={styles.submitButton} onPress={updateGST}>
                                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                                    </TouchableOpacity>
                                </View>

                            )}

                        </View>
                    ) : (
                        // If GST doesn't exist, only show the "Know About GST IN" view
                        <View style={styles.gstContainer}>
                            <Text style={styles.gstLabel}>GST IN : <Text style={{ color: '#f46f2e' }}>{gst}</Text></Text>

                        </View>
                    )}
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
    header: {
        backgroundColor: '#f46f2e',
        padding: 20,
        height: 200,
        width: "100%",
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20
    },
    headerTitle: {
        fontSize: 20,
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
        justifyContent: "center"
    },
    editText: {
        color: 'white',
        fontSize: 16,
        fontWeight: "600"
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: -50,
        marginBottom: 60
    },
    profileImage: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: '#f46f2e',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 115,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#f46f2e',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 18,
        fontWeight: 'bold',color:"#6c290f",
        marginLeft: 10,
    },
    infoText: {
        marginLeft: 50,
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    gstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 15,
        alignItems: 'center',
    },
    gstLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color:"#333333"
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        color:"#333333",
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#f46f2e',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#f46f2e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
});

export default Profile;
