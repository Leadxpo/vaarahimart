import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryStaffById, updateDeliveryStaff } from '../../Redux/Actions/deliveryStaffAction';

const DeliveryPartnerBankDetails = ({ navigation, route }) => {
  const { deliveryParnerData } = route.params;
  const [bankName, setBankName] = useState(deliveryParnerData.bank_name);
  const [accountNo, setAccountNo] = useState(deliveryParnerData.bank_account_no);
  const [ConformAccount, setConformAccount] = useState('');
  const [branch, setBranch] = useState(deliveryParnerData.bank_branch);
  const [accountHolder, setAccountHolder] = useState(deliveryParnerData.bank_account_holder_name);
  const [IFSC, setIFSC] = useState(deliveryParnerData.bank_ifsc);

  const { loading: loadingDeliveryPartnerData, deliveryInfo, error: DeliveryPartnerDataError } = useSelector(state => state.deliveryDetails);
  const [deliveryPartnerID, setDeliveryPartnerID] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (deliveryInfo?.id) {
        setDeliveryPartnerID(deliveryInfo.id);
        try { 
          await dispatch(getDeliveryStaffById(deliveryInfo.staff_id));
        } catch (error) {
          console.log("error : ", error);
        }
      }
    };

    fetchData();
  }, [dispatch, deliveryPartnerID]);



  const handleContinue = async () => {
    // Add form validation or API call here
    if (!bankName || !accountNo || !ConformAccount || !IFSC || !branch || !accountHolder) {
    } else {
      if (accountNo === ConformAccount) {

        const deliveryData = { staff_id: deliveryInfo.staff_id, bank_name: bankName, bank_account_holder_name: accountHolder, bank_account_no: accountNo, bank_ifsc: IFSC, bank_branch: branch }
        try {
          await dispatch(updateDeliveryStaff(deliveryData))
          await dispatch(getDeliveryStaffById(deliveryInfo.staff_id));
        } catch (error) {
          console.log("error : ", error)
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Account Holder Name"
          value={accountHolder}
          onChangeText={setAccountHolder}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Bank Name"
          value={name}
          onChangeText={setBankName}
        />
        <TextInput
          style={styles.input}
          placeholder="Account No"
          value={accountNo}
          onChangeText={setAccountNo}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="comfirm Account No"
          value={con}
          onChangeText={setConformAccount}
          keyboardType="number-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="IFSC"
          value={IFSC}
          onChangeText={setIFSC}
        />
        <TextInput
          style={styles.input}
          placeholder="Branch"
          value={branch}
          onChangeText={setBranch}
        />
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100
  },
  input: {
    width: '100%',
    color:"#6c290f",
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
  pickupText: {
    justifyContent: 'flex-end',
    color: '#FF7F45',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
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

export default DeliveryPartnerBankDetails;
