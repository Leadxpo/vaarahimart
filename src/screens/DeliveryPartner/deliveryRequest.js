import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getDeliveryStaffById } from '../../Redux/Actions/deliveryStaffAction';
import { loadData } from '../../Utils/appData';

export default function WithdrawRequest({ navigation, route }) {
  const dispatch = useDispatch();
  const { deliveryStaffInfo } = useSelector(state => state.deliveryStaffDetails);
  const { orderData } = route.params;
  const [deliveryPartnerID, setDeliveryPartnerID] = useState('');
  const [holder_name, setHolder_name] = useState(orderData?.bank_account_holder_name ? orderData?.bank_account_holder_name :"");
  const [account_no, setAccount_no] = useState(orderData?.bank_account_no ? orderData?.bank_account_no :"");
  const [bank_name, setBank_name] = useState(orderData?.bank_name ? orderData?.bank_name :"");
  const [IFSC_no, setIFSC_no] = useState(orderData?.bank_ifsc ? orderData?.bank_ifsc :"");
  const [amount, setAmount] = useState('');
  const [staffInfo, setStaffInfo] = useState(null);
  const [balance, setBalance] = useState(1000); // Example balance
  const [error, setError] = useState('');
  const [showaccount, setShowaccount] = useState(true);


  const minimumWithdrawalAmount = 5000;

  const handleAmountChange = (value) => {
    // Allow only numerical input
    const numericValue = value.replace(/[^0-9]/g, '');

    // Check if the amount exceeds the balance
    if (parseInt(numericValue) > balance) {
      setError('Withdraw amount cannot exceed balance amount');
    } else {
      setError('');
    }

    // Update amount input
    setAmount(numericValue);
  };

  const handleSendRequest = () => {
    // Validate that the amount meets the minimum withdrawal amount
    if (parseInt(amount) < minimumWithdrawalAmount) {
      setError(`The Minimum Withdrawal Amount is ₹${minimumWithdrawalAmount}`);
    } else if (!error && amount) {
      // Send withdrawal request
      setAmount(''); // Clear input
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const staffData = await loadData("delivryStaffData");
      if (staffData?.id && staffData.staff_id) {
        setDeliveryPartnerID(staffData.id);
        setBalance(staffData.earnedAmount);
        if ( deliveryStaffInfo.bank_name==null ||"") {
          setShowaccount(false)
        } else {
          setShowaccount(true)
        }
        // setStaffInfo(staffData)
        try {
          await dispatch(getDeliveryStaffById(staffData.staff_id));

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [dispatch, deliveryStaffInfo?.id, deliveryStaffInfo?.staff_id]);


  return (
    <View style={styles.container}>
      {/* Balance Display */}
      <Text style={styles.balanceText}>Balance Amount</Text>
      <Text style={styles.balanceAmount}>₹{balance}</Text>

      {/* Bank Details Card */}
      {showaccount  ? (

        <Card style={styles.bankCard}>
          <Card.Content style={styles.bankCardContent}>
            <MaterialCommunityIcons name="bank" size={24} color="#F07825" />

            <View style={styles.bankInfo}>
              <Text>UNION BANK</Text>
              <Text>Ac No: 5678******</Text>
            </View>
            <Text style={styles.editBankText}>Edit Bank</Text>
          </Card.Content>
        </Card>
      ) : (
        <View>
          <TextInput
            mode="outlined"
            placeholder="Enter Account Holder Name"
            value={holder_name}
            keyboardType="default"
            onChangeText={setHolder_name}
            style={styles.input}
            outlineColor="#F07825"
            error={!!error}
          />
          <TextInput
            mode="outlined"
            placeholder="Enter Account Number"
            value={account_no}
            keyboardType="numeric"
            onChangeText={setAccount_no}
            style={styles.input}
            outlineColor="#F07825"
            error={!!error}
          />
          <TextInput
            mode="outlined"
            placeholder="Enter Bank Name"
            value={bank_name}
            keyboardType="default"
            onChangeText={setBank_name}
            style={styles.input}
            outlineColor="#F07825"
            error={!!error}
          />
          <TextInput
            mode="outlined"
            placeholder="Enter IFSC No"
            value={IFSC_no}
            keyboardType="default"
            onChangeText={setIFSC_no}
            style={styles.input}
            outlineColor="#F07825"
            error={!!error}
          />

          <Button
            mode="contained"
            onPress={AddAccount}
            style={styles.requestButton}
            contentStyle={styles.requestButtonContent}
          >
            Add Account
          </Button>
        </View>
      )

      }


      {/* Withdrawal Amount Input */}
      <Text style={styles.label}>Withdraw Amount</Text>
      <TextInput
        mode="outlined"
        placeholder="Enter Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={handleAmountChange}
        style={styles.input}
        outlineColor="#F07825"
        error={!!error}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={styles.minAmountText}>The Minimum Withdrawal Amount is ₹{minimumWithdrawalAmount}</Text>

      {/* Note */}
      <Text style={styles.noteText}>
        NOTE: When you send a request, the amount will be deducted from your given account. If the admin rejects the request, the amount will be refunded to your wallet.
      </Text>

      {/* Send Request Button */}
      <Button
        mode="contained"
        onPress={handleSendRequest}
        style={styles.requestButton}
        contentStyle={styles.requestButtonContent}
      >
        Send Request
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F07825',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  balanceText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bankCard: {
    marginVertical: 20,
    borderRadius: 8, backgroundColor: '#ffffff',
    borderColor: '#F07825',
    borderWidth: 1,
  },
  bankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankInfo: {
    flex: 1,
    marginLeft: 10,
  },
  editBankText: {
    color: '#F07825',
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',color:"#6c290f",
  },
  errorText: {
    color: 'red',
    marginVertical: 5,
  },
  minAmountText: {
    fontSize: 12,
    color: '#F07825',
    marginVertical: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#777',
    marginTop: 10,
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: '#F07825',
    borderRadius: 30,
  },
  requestButtonContent: {
    paddingVertical: 10,
  },
});
