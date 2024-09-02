import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import Colors from "../../Services/Colors";

export default function Menu() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [litres, setLitres] = useState({});
  const [selectedValue, setSelectedValue] = useState("AM");

  useEffect(() => {
    async function fetchCustomers() {
      const { data, error } = await supabase
        .from("fixed_rate_customer")
        .select("*");
      if (error) {
        Alert.alert("Error", "Error fetching customers");
      } else {
        setCustomers(data);
        fetchExistingLitres(data);
      }
    }
    fetchCustomers();
  }, [date, selectedValue]);

  async function fetchExistingLitres(customers) {
    const dateFormatted = date.toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("fixed_rate_customer_shift_details")
      .select("customer_number, litre")
      .eq("DATE", dateFormatted)
      .eq("AM_PM", selectedValue);
    if (error) {
      Alert.alert("Error", "Error fetching customer data");
    } else {
      const initialLitres = {};
      for (const customer of customers) {
        const existingData = data.find(
          (entry) => entry.customer_number === customer.customer_number
        );
        initialLitres[customer.customer_number] = existingData
          ? existingData.litre.toString()
          : "";
      }
      setLitres(initialLitres);
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleInputChange = (customerNumber, value) => {
    setLitres((prevLitres) => ({
      ...prevLitres,
      [customerNumber]: value,
    }));
  };

  async function handleSaveData() {
    const dateFormatted = date.toISOString().split("T")[0];
    const dataToUpsert = [];
    const customerNumbersToDelete = [];

    // Fetch existing entries for the current date and AM/PM period
    const { data: existingData, error: fetchError } = await supabase
      .from("fixed_rate_customer_shift_details")
      .select("customer_number")
      .eq("DATE", dateFormatted)
      .eq("AM_PM", selectedValue);

    if (fetchError) {
      Alert.alert("Error", "Error fetching existing data");
      return;
    }

    // Collect customer numbers that need to be deleted
    const existingCustomerNumbers = existingData.map(
      (entry) => entry.customer_number
    );

    for (const customer of customers) {
      const customerNumber = customer.customer_number;
      const litreInput = litres[customerNumber];

      // Parse float value from the input and handle edge cases
      const litreValue = parseFloat(litreInput);

      if (isNaN(litreValue)) {
        continue; // Skip if the input is not a valid number
      }

      if (litreValue === 0) {
        if (existingCustomerNumbers.includes(customerNumber)) {
          // Mark for deletion if the value is zero and exists in the database
          customerNumbersToDelete.push(customerNumber);
        }
        continue; // Skip zero values in the upsert operation
      }

      // Fetch the litre rate from the fixed_rate_customer table
      const { data: rateData, error: rateError } = await supabase
        .from("fixed_rate_customer")
        .select("litre_rate")
        .eq("customer_number", customerNumber)
        .single();

      if (rateError) {
        Alert.alert("Error", "Error fetching customer rate");
        continue;
      }

      const litreRate = rateData.litre_rate;
      const amount = litreValue * litreRate;

      // Prepare the data to upsert
      dataToUpsert.push({
        DATE: dateFormatted,
        AM_PM: selectedValue,
        customer_number: customerNumber,
        litre: litreValue,
        litre_rate: litreRate,
        amount: amount,
      });
    }

    // Perform deletion operation if there are customer numbers to delete
    if (customerNumbersToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("fixed_rate_customer_shift_details")
        .delete()
        .eq("DATE", dateFormatted)
        .eq("AM_PM", selectedValue)
        .in("customer_number", customerNumbersToDelete);

      if (deleteError) {
        Alert.alert("Error", "Error deleting data");
        return;
      } else {
        Alert.alert("Success", "data Updated");
      }
    }

    // Perform upsert operation if there is data to upsert
    if (dataToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from("fixed_rate_customer_shift_details")
        .upsert(dataToUpsert);

      if (upsertError) {
        Alert.alert("Error", "Error saving data");
      } else {
        Alert.alert("Success", "Data saved successfully");
      }
    }
  }

  const { width } = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>Fixed Rate Customer</Text>
        <View style={styles.datePickerContainer}>
          <Button onPress={showDatePicker} title={date.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="AM"
              status={selectedValue === "AM" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("AM")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>AM</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="PM"
              status={selectedValue === "PM" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("PM")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>PM</Text>
          </View>
        </View>
        {customers.map((customer) => (
          <View key={customer.customer_number} style={styles.inputContainer}>
            <Text style={styles.label}>{customer.customer_number}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Litre"
              value={litres[customer.customer_number] || ""}
              onChangeText={(value) =>
                handleInputChange(customer.customer_number, value)
              }
            />
          </View>
        ))}
        <View style={styles.Button}>
          <Button
            color={Colors.Green}
            onPress={handleSaveData}
            title="Save Data"
          />
        </View>

        <Button
          onPress={() => {
            router.back();
          }}
          title="Go Back"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  Button: {
    marginBottom: 10,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
