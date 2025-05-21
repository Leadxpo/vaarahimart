import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, SafeAreaView,Modal } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const CancelOrder =({ navigation, route }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [open, setOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [issues, setIssues] = useState([
    { label: 'Item damaged', value: 'damaged' },
    { label: 'Wrong item delivered', value: 'wrong-item' },
    { label: 'Late delivery', value: 'late-delivery' },
  ]);
  const [description, setDescription] = useState('');
  const [remainingWords, setRemainingWords] = useState(1000);

  const handleDescriptionChange = (text) => {
    const wordCount = 1000 - text.length;
    setDescription(text);
    setRemainingWords(wordCount >= 0 ? wordCount : 0);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleCancelOrder = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding:20}}>
        {/* Order ID */}
        <Text style={styles.orderId}>Cancel Order Id: 2347568</Text>
        <Text style={styles.subtitle}>Select type of issue</Text>

        {/* Dropdown for Issue selection */}
        <DropDownPicker
          open={open}
          value={selectedIssue}
          items={issues}
          setOpen={setOpen}
          setValue={setSelectedIssue}
          setItems={setIssues}
          placeholder="Choose issue"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />


        {/* Description box */}
        <Text style={styles.subtitle}>Please Write reasons for cancel order</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Tell us your issue"
          multiline={true}
          maxLength={1000}
          onChangeText={handleDescriptionChange}
          value={description}
        />
        <Text style={styles.wordCount}>{remainingWords} words remaining</Text>

        {/* Submit Button */}
        <Button mode="contained" onPress={() => {setIsModalVisible(true);}} style={styles.submitButton}>
          Cancel Order
        </Button>
      </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.bottomSheet}>
              <Text style={{fontSize:16,textAlign:'center',margin:5,color:'gray'}}>
              Are You Sure You Want Cancel this Order
              </Text>
              <Text style={styles.orderId}>Cancel Order Id: 2347568</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.moveCartButton} onPress={handleCancelOrder}>
                  <Text style={styles.buttonCartText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={handleCloseModal}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

    </SafeAreaView>
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
    marginBottom: 20,
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
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
    }),
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
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
    }),
  },
  uploadText: {
    fontSize: 16,
    marginTop: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    color:"#6c290f",
    borderRadius: 10,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 10,
    // ...Platform.select({
    //   android: {
    //     elevation: 3,
    //   },
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 2,
    //   },
    // }),
  },
  wordCount: {
    textAlign: 'right',
    marginBottom: 20,
    color: 'gray',
  },
  submitButton: {
    backgroundColor: '#f46a11',
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  moveCartButton: {
    backgroundColor: '#f46f2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: '#fff',
    borderColor: '#f46f2e',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#f46f2e',
    fontWeight: 'bold',
  },
  buttonCartText: {
    color: '#f3f3f3',
    fontWeight: 'bold',
  },

});

export default CancelOrder;
