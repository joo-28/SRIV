import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";

export default function EditCustomer() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(null);

  const searchCustomer = async (customerNumber) => {
    if (customerNumber.trim() === "") {
      setContactNumber("");
      setIsActive(null);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("customer")
      .select("customer_contact_number, active")
      .eq("customer_number", customerNumber)
      .single();

    setTimeout(() => {
      if (error && error.code !== "PGRST116") {
        console.log("Error fetching customer:", error);
        setContactNumber("");
        setIsActive(null);
      } else if (data) {
        setContactNumber(data.customer_contact_number);
        setIsActive(data.active);
      } else {
        setContactNumber("");
        setIsActive(null);
      }
      setLoading(false);
    }, 2000);
  };

  async function updateCustomerContactNumber(customerNumber, newContactNumber) {
    const { data, error } = await supabase
      .from("customer")
      .update({ customer_contact_number: newContactNumber })
      .eq("customer_number", customerNumber);

    if (error) {
      console.log("Error updating contact number:", error);
      return null;
    }
    setNewContactNumber("");
    setContactNumber(newContactNumber);
    Alert.alert("Success", "Contact updated");
    console.log("Updated customer contact number:", data);
    return data;
  }

  async function handleDeleteOrActivateCustomer() {
    if (isActive) {
      // Deactivate customer
      const { data, error } = await supabase
        .from("customer")
        .update({ active: false })
        .eq("customer_number", customerNumber);

      if (error) {
        console.log("Error deactivating customer:", error);
        Alert.alert("Error", "Failed to deactivate customer.");
        return;
      }

      Alert.alert("Success", "Customer has been deactivated.");
      setIsActive(false);
      console.log("Customer deactivated:", data);
    } else {
      // Activate customer
      const { data, error } = await supabase
        .from("customer")
        .update({ active: true })
        .eq("customer_number", customerNumber);

      if (error) {
        console.log("Error activating customer:", error);
        Alert.alert("Error", "Failed to activate customer.");
        return;
      }

      Alert.alert("Success", "Customer has been activated.");
      setIsActive(true);
      console.log("Customer activated:", data);
    }
  }

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Edit Customer Details</Text>
        <TextInput
          style={styles.input}
          value={customerNumber}
          onChangeText={(text) => {
            setCustomerNumber(text);
            searchCustomer(text);
          }}
          placeholder="Customer Number"
          keyboardType="numeric"
        />
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
        <View style={styles.contantView}>
          <Text>Contact Number: </Text>
          <Text>{contactNumber ? contactNumber : "No customer found."}</Text>
        </View>
        {isActive !== null && (
          <View style={styles.contantView}>
            <Text>Status: </Text>
            <Text>{isActive ? "Active" : "Inactive"}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="New Contact Number"
          value={newContactNumber}
          onChangeText={setNewContactNumber}
          keyboardType="numeric"
        />
        <View style={styles.SaveButton}>
          <Button
            color={Colors.Green}
            title="Save"
            onPress={() => {
              updateCustomerContactNumber(customerNumber, newContactNumber);
            }}
          />
        </View>
        {isActive !== null && (
          <View style={styles.DeleteButton}>
            <Button
              color={isActive ? "red" : "blue"}
              title={isActive ? "Deactivate Customer" : "Activate Customer"}
              onPress={handleDeleteOrActivateCustomer}
            />
          </View>
        )}
        <View style={styles.GoBackButton}>
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
  DeleteButton: {
    marginBottom: 15,
    width: 150,
    alignSelf: "center",
  },
  SelectButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 30,
  },
  GoBackButton: {
    width: 150,
    bottom: 0,
    position: "absolute",
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 30,
  },
  contantView: {
    flexDirection: "row",
    marginBottom: 13,
  },
});
