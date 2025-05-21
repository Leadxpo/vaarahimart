import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const DeliveryResetPassword =({ navigation, route }) => {
    const [imageUri, setImageUri] = useState(null);
    const [oldPass, setOldPass] = useState('Dhamodhar Rao.mandavailli');
    const [newPass, setNewPass] = useState('+91-9873452678');
    const [conformPass, setconformPass] = useState('damu@gmail.com');

    const handleContinue = () => {
        // Add form validation or API call here
        if (!name || !email || !phone) {
            Alert.alert('Error', 'Please fill all fields');
        } else {
            Alert.alert('Success', 'Details submitted successfully');
        }
    };


    // Image picker for camera or gallery 
    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            saveToPhotos: true,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const selectedImage = response.assets[0].uri;
                setImageUri(selectedImage);
            }
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    {/* Header */}
                    <View style={styles.imageContainer}>
                        <Card.Cover source={ require('../../utilities/images/logo.png')} resizeMode='stretch' style={styles.profileImage} />
                    </View>

                    {/* Profile Picture */}
                    <View style={{ width: "95%", alignSelf: 'center' }}>
                        <TextInput
                            style={styles.input}
                            placeholder="old password"
                            value={oldPass}
                            onChangeText={setOldPass}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            value={newPass}
                            onChangeText={setnewPass}
                            textContentType='newPassword'
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phone}
                            textContentType='password'
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleContinue}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        height: 250,
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
    imageContainer: {
        alignItems: 'center',
        marginTop: -50,
        marginBottom: 60
    },
    profileImage: {
        width: 100,
        height: 100,
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
        fontWeight: 'bold',
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
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
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
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
});

export default DeliveryResetPassword;
