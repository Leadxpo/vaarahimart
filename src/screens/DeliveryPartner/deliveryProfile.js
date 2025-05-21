import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const DeliveryProfile =({ navigation, route }) => {
    const [imageUri, setImageUri] = useState(null);
    const [name, setName] = useState('Dhamodhar Rao.mandavailli');
    const [phone, setPhone] = useState('+91-9873452678');
    const [email, setEmail] = useState('damu@gmail.com');
    const [gstNumber, setGstNumber] = useState('');
    const [gst, setGst] = useState('');  // Set this if you have GST number
    const [isGstEnabled, setGstEnabled] = useState(false); // For switch state


    // Toggle GST switch
    const toggleGstSwitch = () => setGstEnabled(!isGstEnabled);
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
        <ScrollView>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'flex-start', width: "45%" }}>
                            <Icon name="arrow-left" size={30} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>
                    </View>
                    <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 30 }}>
                        <Text style={styles.editText}>Edit <Icon name="pencil-outline" size={20} color="white" /></Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Picture */}
                <View style={styles.imageContainer}>
                    <Card.Cover source={imageUri ? { uri: imageUri } : require('../../utilities/images/logo.png')} resizeMode='stretch' style={styles.profileImage} />
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
        borderRadius:60
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
    input: {
        borderWidth: 1,
        color:"#6c290f",
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

export default DeliveryProfile;
