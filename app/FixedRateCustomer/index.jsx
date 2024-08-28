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
      Alert.alert("Error", "Error fetching customers");
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
    for (const customer of customers) {
      const customerNumber = customer.customer_number;
      const litreInput = litres[customerNumber];
      if (!litreInput) {
        continue;
      }
      const { data: rateData, error: rateError } = await supabase
        .from("fixed_rate_customer")
        .select("litre_rate")
        .eq("customer_number", customerNumber)
        .single();

      if (rateError) {
        Alert.alert("Error", "Error fetching customers");
        continue;
      }
      const litreRate = rateData.litre_rate;
      const amount = parseFloat(litreInput) * litreRate;
      const { error: insertError } = await supabase
        .from("fixed_rate_customer_shift_details")
        .upsert([
          {
            DATE: date,
            AM_PM: selectedValue,
            customer_number: customerNumber,
            litre: parseFloat(litreInput),
            litre_rate: litreRate,
            amount: amount,
          },
        ]);

      if (insertError) {
        Alert.alert("Error", "Error Inserting customers");
      }
    }
    Alert.alert("Success", "Data saved successfully");
  }

  const { width } = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        {/* Go Back Button */}
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
              maximumDate={new Date()} // Restrict future dates
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
            <Text style={styles.label}>
              Customer {customer.customer_number} - {customer.customer_name}
            </Text>
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
    backgroundColor: Colors.Yellow,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  formDesign: {
    backgroundColor: "white",
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
    fontSize: 16,
    marginBottom: 5,
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
