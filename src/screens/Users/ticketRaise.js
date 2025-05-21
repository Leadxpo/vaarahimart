import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { createTicket } from '../../Redux/Actions/ticketAction';

const TicketRaise = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { orderDetails } = route.params;

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [open, setOpen] = useState(false);
  const [issues] = useState([
    { label: 'Item damaged', value: 'damaged' },
    { label: 'Wrong item delivered', value: 'wrong-item' },
  ]);
  const [description, setDescription] = useState('');
  const [remainingWords, setRemainingWords] = useState(1000);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageData, setImageData] = useState(null);

  const { loading: loadingCreateTicket } = useSelector(state => state.ticketAdd);
  const { userInfo } = useSelector(state => state.userDetails);

  const handleDescriptionChange = (text) => {
    setDescription(text);
    setRemainingWords(Math.max(1000 - text.length, 0));
  };

  const handleImageSelection = (type) => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    const callback = (response) => {
      setModalVisible(false);
      if (response.didCancel || response.errorCode) {
        console.error(response.errorMessage || 'Image selection cancelled');
        return;
      }

      if (response.assets?.length) {
        const image = response.assets[0];
        setImageData(image);
      }
    };

    if (type === 'camera') {
      launchCamera(options, callback);
    } else if (type === 'gallery') {
      launchImageLibrary(options, callback);
    }
  };

  const handleSubmit = async () => {
    if (!selectedIssue || !description.trim()) {
      alert('Please select an issue and provide a description.');
      return;
    }

    if (!imageData) {
      alert('Please upload an image.');
      return;
    }

    const formData = new FormData();

    formData.append('issueImage', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.fileName,
    });
    formData.append('userID', userInfo.id);
    formData.append('order_id', orderDetails.id);
    formData.append('ticket_mode', selectedIssue);
    formData.append('user_name', userInfo.name);
    formData.append('description', description);

    await dispatch(createTicket(formData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.orderId}>Order ID: {orderDetails.id}</Text>
      <Text style={styles.subtitle}>Select Type of Issue</Text>

      <DropDownPicker
        open={open}
        value={selectedIssue}
        items={issues}
        setOpen={setOpen}
        setValue={setSelectedIssue}
        placeholder="Choose issue"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <Text style={styles.subtitle}>Attach Document/Photos</Text>
      <Text style={styles.subtext}>Uploaded file should be less than 10MB</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={styles.uploadCard}>
          <Icon name="camera" size={40} color="black" />
          <Text style={styles.uploadText}>Add Photo</Text>
        </Card>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Please Write a Description</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Tell us your issue"
        multiline
        maxLength={1000}
        onChangeText={handleDescriptionChange}
        value={description}
      />
      <Text style={styles.wordCount}>{remainingWords} words remaining</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {loadingCreateTicket ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Raise Ticket</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Option</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleImageSelection('camera')}
            >
              <Text style={styles.modalButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleImageSelection('gallery')}
            >
              <Text style={styles.modalButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  dropdown: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    elevation: Platform.OS === 'android' ? 5 : 0,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  uploadCard: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  uploadText: {
    fontSize: 16,
    marginTop: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    color:"#6c290f",
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  wordCount: {
    textAlign: 'right',
    marginBottom: 20,
    color: 'gray',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#F07825',
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 12,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#F07825',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  }
});

export default TicketRaise;
