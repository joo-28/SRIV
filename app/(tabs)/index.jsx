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
} from "react-native";

import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";

import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
const { width, height } = Dimensions.get("window");

export default function index() {
  const router = useRouter();

  const [customerNumber, setCustomerNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("debit");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const username = await service.getUserData();
      if (!username) {
        router.replace("/Login");
      }
    };
    checkLoginStatus();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleInsertData = async () => {
    // Fetch customer data
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("customer_number,active,balance,total_paid,total_amount")
      .eq("customer_number", customerNumber)
      .single();

    if (customerError) {
      Alert.alert("Error", "Error fetching customer details.");
      console.log("Error fetching customer:", customerError);
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

    // Initialize amounts

    let updatedTotalAmount = parseFloat(customerData.total_amount) || 0;
    let updatedBalanceAmount = parseFloat(customerData.balance) || 0;
    let updatedTotalDuePaid = parseFloat(customerData.total_paid) || 0;

    // Update based on transaction type

    if (selectedValue === "credit") {
      updatedBalanceAmount += eval(amount);
      updatedTotalAmount += eval(amount);
      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .insert([
          {
            customer_number: customerNumber,
            amount: amount,
            due_paid_date: date,
            transaction: selectedValue,
            total_due_paid: updatedTotalDuePaid,
            balance_amount: updatedBalanceAmount,
          },
        ])
        .select();

      if (ledgerError) {
        console.log("Error inserting into ledger:", ledgerError);
        return;
      } else {
        console.log("Inserted transaction into ledger:", ledgerData);
      }
      const { data: updateData, error: updateError } = await supabase
        .from("customer")
        .update({
          balance: updatedBalanceAmount,
          total_amount: updatedTotalAmount,
        })
        .eq("customer_number", customerNumber);

      if (updateError) {
        console.error(
          "Error updating balance_amount and total_amount:",
          updateError
        );
      } else {
        console.log(
          "Updated balance_amount and total_amount successfully:",
          updateData
        );
        Alert.alert("Successful", "Transaction recorded successfully.");
        setCustomerNumber("");
        setAmount(0);
      }
    } else if (selectedValue === "debit") {
      updatedBalanceAmount -= eval(amount);
      updatedTotalDuePaid += eval(amount);

      const { data: updateData, error: updateError } = await supabase
        .from("ledger")
        .insert([
          {
            customer_number: customerNumber,
            amount: amount,
            due_paid_date: date,
            transaction: selectedValue,
            total_due_paid: updatedTotalDuePaid,
            balance_amount: updatedBalanceAmount,
          },
        ])
        .select();

      if (updateError) {
        console.error(
          "Error updating balance_amount and total_due_paid:",
          updateError
        );
      } else {
        console.log(
          "Updated balance_amount and total_due_paid successfully:",
          updateData
        );
        const { data: updateDataToLedger, error: updateErrorToLedger } =
          await supabase
            .from("customer")
            .update({
              total_paid: updatedTotalDuePaid,
              balance: updatedBalanceAmount,
            })
            .eq("customer_number", customerNumber);

        if (updateErrorToLedger) {
          console.error(
            "Error updating balance_amount and total_due_paid:",
            updateError
          );
        } else {
          console.log(
            "Updated balance_amount and total_due_paid successfully:",
            updateDataToLedger
          );
          Alert.alert("Successful", "Transaction recorded successfully.");
          setCustomerNumber("");
          setAmount(0);
        }
      }
    } else if (selectedValue === "Miscellaneous") {
      updatedTotalAmount += eval(amount);
      updatedBalanceAmount += eval(amount);
      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .insert([
          {
            customer_number: customerNumber,
            amount: amount,
            due_paid_date: date,
            transaction: selectedValue,
            total_due_paid: updatedTotalDuePaid,
            balance_amount: updatedBalanceAmount,
          },
        ])
        .select();

      if (ledgerError) {
        console.log("Error inserting into ledger:", ledgerError);
        return;
      } else {
        console.log("Inserted transaction into ledger:", ledgerData);
      }
      const { data: updateData, error: updateError } = await supabase
        .from("customer")
        .update({
          total_amount: updatedTotalAmount,
          balance: updatedBalanceAmount,
        })
        .eq("customer_number", customerNumber);

      if (updateError) {
        console.error("Error updating total_amount:", updateError);
      } else {
        console.log("Updated total_amount successfully:", updateData);
        Alert.alert("Successful", "Transaction recorded successfully.");
        setCustomerNumber("");
        setAmount(0);
      }
    }
  };

  return (
    <View style={styles.bg}>
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
        />

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="Debit"
              status={selectedValue === "debit" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("debit")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Debit</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="Credit"
              status={selectedValue === "credit" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("credit")}
              color="#007BFF"
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
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Miscellaneous</Text>
          </View>
        </View>

        <View style={styles.container}>
          <Button onPress={showDatePicker} title={date.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="Add" onPress={handleInsertData} />
        </View>
      </View>

      <View style={styles.dataDesign}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.Yellow,
  },
  formDesign: {
    top: "5%",
    width: "90%",
    left: "5%",
    height: height * 0.37,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    position: "absolute",
    flex: 1,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    marginTop: 2,
    flexDirection: "row",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dataDesign: {
    top: "48%",
    width: "90%",
    left: "5%",
    height: height * 0.47,
    backgroundColor: "white",
    borderRadius: 8,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
