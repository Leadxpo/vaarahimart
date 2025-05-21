import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryStaffById, updateDeliveryStaff } from '../../Redux/Actions/deliveryStaffAction';
import { getUserById, updateUser } from '../../Redux/Actions/userAction';

const UserBankDetails = ({ navigation, route }) => {

  const { loading: loadingUserData, userInfo, error: UserDataError } = useSelector(state => state.userDetails);
  const dispatch = useDispatch();

  const [bankName, setBankName] = useState(userInfo.bank_name);
  const [accountNo, setAccountNo] = useState(userInfo.bank_account_no);
  const [ConformAccount, setConformAccount] = useState('');
  const [branch, setBranch] = useState(userInfo.bank_branch);
  const [accountHolder, setAccountHolder] = useState(userInfo.bank_account_holder_name);
  const [IFSC, setIFSC] = useState(userInfo.bank_ifsc);

  const [userID, setuserID] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo?.id) {
        setuserID(userInfo.id);
        try {
          await dispatch(getUserById(userInfo.id));
          setBankName(userInfo.bank_name);
          setAccountHolder(userInfo.bank_account_holder_name);
          setAccountNo(userInfo.bank_account_no);
          setBranch(userInfo.bank_branch);
          setIFSC(userInfo.bank_ifsc);

        } catch (error) {
          console.log("error : ", error);
        }
      }
    };

    fetchData();
  }, [dispatch, userID]);



  const handleContinue = async () => {
    // Add form validation or API call here
    if (!bankName || !accountNo || !ConformAccount || !IFSC || !branch || !accountHolder) {
    } else {
      if (accountNo === ConformAccount) {

        const deliveryData = { userID: userInfo.id, bank_name: bankName, bank_account_holder_name: accountHolder, bank_account_no: accountNo, bank_ifsc: IFSC, bank_branch: branch }
        try {
          await dispatch(updateUser(deliveryData))
          await dispatch(getUserById(userInfo.staff_id));
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
    color:'#6c290f',
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

export default UserBankDetails;
