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
import React, { useState } from "react";
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
        console.error("Error fetching customer:", error);
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

  const updateCustomerContactNumber = async () => {
    if (newContactNumber.trim() === "") {
      Alert.alert("Error", "Please enter a new contact number.");
      return;
    }

    const { data, error } = await supabase
      .from("customer")
      .update({ customer_contact_number: newContactNumber })
      .eq("customer_number", customerNumber);

    if (error) {
      console.error("Error updating contact number:", error);
      Alert.alert("Error", "Failed to update contact number.");
    } else {
      setContactNumber(newContactNumber);
      setNewContactNumber("");
      Alert.alert("Success", "Contact number updated successfully.");
      console.log("Updated customer contact number:", data);
    }
  };

  const handleDeleteOrActivateCustomer = async () => {
    const newStatus = !isActive;
    const { data, error } = await supabase
      .from("customer")
      .update({ active: newStatus })
      .eq("customer_number", customerNumber);

    if (error) {
      console.error(
        `Error ${newStatus ? "activating" : "deactivating"} customer:`,
        error
      );
      Alert.alert(
        "Error",
        `Failed to ${newStatus ? "activate" : "deactivate"} customer.`
      );
    } else {
      setIsActive(newStatus);
      Alert.alert(
        "Success",
        `Customer has been ${newStatus ? "activated" : "deactivated"}.`
      );
      console.log(`Customer ${newStatus ? "activated" : "deactivated"}:`, data);
    }
  };

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
        {loading && <ActivityIndicator size="small" color={Colors.Blue} />}
        <View style={styles.detailView}>
          <Text>Contact Number: </Text>
          <Text>{contactNumber || "No customer found."}</Text>
        </View>
        {isActive !== null && (
          <View style={styles.detailView}>
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
        <View style={styles.saveButton}>
          <Button
            color={Colors.Green}
            title="Save"
            onPress={updateCustomerContactNumber}
          />
        </View>
        {isActive !== null && (
          <View style={styles.toggleButton}>
            <Button
              color={isActive ? Colors.Red : Colors.Blue}
              title={isActive ? "Deactivate Customer" : "Activate Customer"}
              onPress={handleDeleteOrActivateCustomer}
            />
          </View>
        )}
        <View style={styles.goBackButton}>
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
    justifyContent: "center",
    backgroundColor: Colors.Yellow,
  },
  formDesign: {
    marginTop: 50,
    marginHorizontal: 28,
    backgroundColor: "white",
    borderRadius: 8,
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
  detailView: {
    flexDirection: "row",
    marginBottom: 13,
  },
  saveButton: {
    width: 150,
    alignSelf: "center",
    marginBottom: 15,
  },
  toggleButton: {
    width: 150,
    alignSelf: "center",
    marginBottom: 15,
  },
  goBackButton: {
    width: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
});
