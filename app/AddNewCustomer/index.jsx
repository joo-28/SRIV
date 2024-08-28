//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddNewCustomer() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  const goBack = () => {
    router.back();
  };
  async function handleSaveData() {
    async function checkCustomerNumberExists(customerNumber) {
      const { data, error } = await supabase
        .from("customer")
        .select("customer_number")
        .eq("customer_number", customerNumber)
        .single();

      if (error && error.code !== "PGRST116") {
        Alert.alert("Error", "Error Checking Customer Number");
        return false;
      }
      if (data) {
        Alert.alert("Already exists.", `Customer number ${customerNumber}`);
        return true;
      } else {
        if (customerNumber === "" || totalAmount === "") {
          Alert.alert("Error", "Please enter customer number and amount");
        } else {
          const { data: customerData, error: customerError } = await supabase
            .from("customer")
            .insert([
              {
                customer_number: customerNumber,
                customer_contact_number: customerContactNumber,
                total_amount: parseFloat(totalAmount),
                balance: parseFloat(totalAmount),
              },
            ])
            .select();
          if (customerError) {
            Alert.alert("Error", "Error inserting customer:");
          }
          const { data: ledgerData, error: ledgerError } = await supabase
            .from("ledger")
            .insert([
              {
                customer_number: customerNumber,
                due_paid_date: date,
                transaction: "Credit",
                amount: parseFloat(totalAmount),
                balance_amount: parseFloat(totalAmount),
              },
            ])
            .select();
          if (ledgerError) {
            Alert.alert("Error", "Error inserting customer:");
            return;
          }
          Alert.alert("Successful", "New Customer Created");
          setCustomerNumber("");
          setCustomerContactNumber("");
          setTotalAmount("");
        }
      }
    }
    checkCustomerNumberExists(customerNumber);
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Add New Customer</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer Number"
          value={customerNumber}
          onChangeText={setCustomerNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={customerContactNumber}
          onChangeText={setCustomerContactNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={totalAmount}
          onChangeText={setTotalAmount}
          keyboardType="numeric"
        />
        <View style={styles.datePickerContainer}>
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
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title="Save"
              onPress={handleSaveData}
            />
          </View>
          <View style={styles.goBackButton}>
            <Button title="Go Back" onPress={goBack} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.Yellow,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  formDesign: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    width: "45%",
  },
  goBackButton: {
    width: "45%",
  },
});
