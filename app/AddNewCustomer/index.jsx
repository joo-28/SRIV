import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddNewCustomer() {
  //State Varible

  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerContactNumber, setCustomerContactNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  //State Functions

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
        console.error("Error checking customer number:", error);
        return false;
      }

      if (data) {
        console.log(`Customer number ${customerNumber} already exists.`);
        Alert.alert("Already exists.", `Customer number ${customerNumber}`);
        return true;
      } else {
        if (customerNumber === "" || totalAmount === "") {
          Alert.alert("Error", "Please Enter customer number and Amount");
        } else {
          const { data: customerData, error: customerError } = await supabase
            .from("customer")
            .insert([
              {
                customer_number: customerNumber,
                customer_contact_number: customerContactNumber,
                total_amount: parseFloat(totalAmount),
              },
            ])
            .select();
          if (customerError) {
            console.error("Error inserting customer:", customerError);
          } else {
            console.log("Inserted customer:", customerData);
          }
          const { data: ledgerData, error: ledgerError } = await supabase
            .from("ledger")
            .insert([
              {
                customer_number: customerNumber,
                due_paid_date: date,
                transaction: "Credit",
              },
            ])
            .select();

          if (ledgerError) {
            console.error("Error inserting into ledger:", ledgerError);
            return;
          } else {
            console.log("Inserted customer:", ledgerData);
          }
          Alert.alert("Sucessful", "New Customer Created");
          setCustomerNumber("");
          setCustomerContactNumber("");
          setTotalAmount("");
        }
      }
    }
    checkCustomerNumberExists(customerNumber);
  }
  return (
    <View style={styles.bg}>
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
        <View style={styles.SaveButton}>
          <Button color={Colors.Green} title="Save" onPress={handleSaveData} />
        </View>
        <View style={styles.GobackButton}>
          <Button title="Go Back" onPress={goBack} />
        </View>
      </View>
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
    top: 50,
    left: 28,
    width: 360,
    height: 780,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 25,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  SaveButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 15,
  },
  GobackButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 15,
  },
});
