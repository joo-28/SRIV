import React, { useEffect, useState } from "react";
import service from "../../Services/service";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Platform,
  Alert,
} from "react-native";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";

import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
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
      } else {
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
    const { data: customerData, error: customerError } = await supabase
      .from("customer")
      .select("customer_number, total_amount")
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

    const { data: ledgerData, error: ledgerError } = await supabase
      .from("ledger")
      .insert([
        {
          customer_number: customerNumber,
          amount: amount,
          due_paid_date: date,
          transaction: selectedValue,
        },
      ])
      .select();

    if (ledgerError) {
      console.log("Error inserting into ledger:", ledgerError);
      return;
    } else {
      console.log("Inserted transaction into ledger:", ledgerData);
    }

    let updatedTotalAmount = customerData.total_amount;

    if (selectedValue === "credit") {
      updatedTotalAmount += parseFloat(amount);
    } else if (selectedValue === "debit") {
      updatedTotalAmount -= parseFloat(amount);
    } else if (selectedValue === "Miscellaneous") {
      updatedTotalAmount += eval(amount);
    }
    const { data: updateData, error: updateError } = await supabase
      .from("customer")
      .update({ total_amount: updatedTotalAmount })
      .eq("customer_number", customerNumber);

    if (updateError) {
      console.error("Error updating total_amount:", updateError);
    } else {
      console.log("Updated total_amount successfully:", updateData);
    }

    Alert.alert("Successful", "Transaction recorded successfully.");
    setCustomerNumber("");
    setAmount("");
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
              value="debit"
              status={selectedValue === "debit" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("debit")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Debit</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="credit"
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

      <View style={styles.dataDesign}>
        <View style={styles.headingDesign}>
          <Text style={styles.headerSize}>Customer Number : </Text>
          <Text style={styles.headerSize}>101</Text>
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
    height: 300,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    padding: 16,
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
    marginBottom: 10,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  searchButton: {
    width: 100,
    color: Colors.Green,
    left: 110,
  },
  radioGroup: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-between",
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
    padding: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  dataDesign: {
    top: 380,
    left: 28,
    width: 360,
    height: 430,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headingDesign: {
    top: 0,
    width: 360,
    flexDirection: "row",
    height: 50,
    minWidth: 320,
    backgroundColor: Colors.Blue,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerSize: {
    fontSize: 20,
    color: "white",
    marginLeft: 20,
  },
});
