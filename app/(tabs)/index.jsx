import React, { useEffect, useState } from "react";
import service from "../../Services/service";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Platform,
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("debit");
  const [amount, setAmount] = useState("");
  const [outstandingFund, setOutstandingFund] = useState(0);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const username = await service.getUserData();
        if (!username) {
          router.replace("/Login");
          return;
        }

        // Fetch user role
        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("ROLE")
          .eq("USERNAME", username)
          .single();

        if (userError || !userData) {
          Alert.alert("Error", "Error fetching user role.");
          return;
        }

        const { ROLE } = userData;
        if (ROLE === "admin") {
          router.replace("(tabs)");
        } else if (ROLE === "ccstaff") {
          router.replace("/CCShiftEntry");
        } else if (ROLE === "cstaff") {
          router.replace("/CenterShiftEntry");
        } else {
          Alert.alert("Error", "Unknown role.");
        }
      } catch (error) {
        Alert.alert("Error", "Error checking user status.");
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
    fetchOutstandingFund();
  }, []);

  const fetchOutstandingFund = async () => {
    try {
      const { data: customers, error } = await supabase
        .from("customer")
        .select("balance");
      if (error) {
        throw error;
      }
      const totalOutstanding = customers.reduce(
        (sum, customer) => sum + parseFloat(customer.balance || 0),
        0
      );
      setOutstandingFund(totalOutstanding);
    } catch (error) {
      Alert.alert("Error", "Error fetching outstanding fund");
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleInsertData = async () => {
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("customer_number, active, balance, total_paid, total_amount")
      .eq("customer_number", customerNumber)
      .single();
    if (customerError) {
      Alert.alert("Error", "Error fetching customer details.");
      return;
    }
    if (!customerData) {
      Alert.alert("Error", "No customer found with this customer number.");
      return;
    }
    if (customerData.active === "false") {
      Alert.alert("Error", "This Customer Account is Closed.");
      return;
    }
    let updatedTotalAmount = parseFloat(customerData.total_amount) || 0;
    let updatedBalanceAmount = parseFloat(customerData.balance) || 0;
    let updatedTotalDuePaid = parseFloat(customerData.total_paid) || 0;
    const transactionAmount = parseFloat(amount);
    if (selectedValue === "credit" || selectedValue === "Miscellaneous") {
      updatedBalanceAmount += transactionAmount;
      updatedTotalAmount += transactionAmount;
    } else if (selectedValue === "debit") {
      updatedBalanceAmount -= transactionAmount;
      updatedTotalDuePaid += transactionAmount;
    }
    try {
      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .insert([
          {
            customer_number: customerNumber,
            amount: transactionAmount,
            due_paid_date: date,
            transaction: selectedValue,
            total_due_paid: updatedTotalDuePaid,
            balance_amount: updatedBalanceAmount,
          },
        ]);

      if (ledgerError) {
        throw ledgerError;
      }

      const updateFields =
        selectedValue === "debit"
          ? { total_paid: updatedTotalDuePaid, balance: updatedBalanceAmount }
          : { balance: updatedBalanceAmount, total_amount: updatedTotalAmount };

      const { data: updateData, error: updateError } = await supabase
        .from("customer")
        .update(updateFields)
        .eq("customer_number", customerNumber);

      if (updateError) {
        throw updateError;
      }

      Alert.alert("Successful", "Transaction recorded successfully.");
      setCustomerNumber("");
      setAmount("");
      fetchOutstandingFund();
    } catch (error) {
      Alert.alert("Error", "Failed to record the transaction.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.bg}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formDesign}>
          <TextInput
            style={styles.input}
            placeholder="Customer Number"
            value={customerNumber}
            onChangeText={setCustomerNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <View style={styles.radioGroup}>
            <View style={styles.radioButton}>
              <RadioButton
                value="debit"
                status={selectedValue === "debit" ? "checked" : "unchecked"}
                onPress={() => setSelectedValue("debit")}
                color={Colors.Blue}
              />
              <Text style={styles.radioLabel}>Debit</Text>
            </View>

            <View style={styles.radioButton}>
              <RadioButton
                value="credit"
                status={selectedValue === "credit" ? "checked" : "unchecked"}
                onPress={() => setSelectedValue("credit")}
                color={Colors.Blue}
              />
              <Text style={styles.radioLabel}>Credit</Text>
            </View>

            <View style={styles.radioButton}>
              <RadioButton
                value="Miscellaneous"
                status={
                  selectedValue === "Miscellaneous" ? "checked" : "unchecked"
                }
                onPress={() => setSelectedValue("Miscellaneous")}
                color={Colors.Blue}
              />
              <Text style={styles.radioLabel}>Miscellaneous</Text>
            </View>
          </View>

          <View style={styles.container}>
            <Button onPress={showDatePicker} title={date.toDateString()} />
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange}
              />
            )}
          </View>

          <View style={styles.searchButton}>
            <Button
              color={Colors.Green}
              title="Add"
              onPress={handleInsertData}
            />
          </View>
        </View>

        <View style={styles.dataDesign}>
          <Text style={styles.reportTitle}>Outstanding Fund</Text>
          <Text style={styles.reportAmount}>
            ₹{new Intl.NumberFormat("en-IN").format(outstandingFund)}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 15,
  },
  formDesign: {
    marginHorizontal: "5%",
    height: height * 0.47,
    minWidth: 320,
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    position: "relative",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 50,
  },
  input: {
    height: 40,
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 7,
    paddingHorizontal: 8,
  },
  searchButton: {
    width: "50%",
    alignSelf: "center",
    marginTop: 5,
  },
  radioGroup: {
    marginTop: 5,
    flexDirection: "row",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 10,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dataDesign: {
    marginHorizontal: "20%",
    height: height * 0.2,
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
  },
  reportAmount: {
    fontSize: 24,
    alignSelf: "center",
  },
});
