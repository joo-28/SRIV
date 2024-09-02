import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState, useEffect } from "react";
import Colors from "../../Services/Colors";

export default function ManageCustomer() {
  const router = useRouter();
  const [customerNumber, setCustomerNumber] = useState("");
  const [litreRate, setLitreRate] = useState("");
  const [oldRate, setOldRate] = useState("");

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchLitreRate = async () => {
      if (customerNumber) {
        try {
          const { data, error } = await supabase
            .from("fixed_rate_customer")
            .select("litre_rate")
            .eq("customer_number", customerNumber)
            .single();
          if (error) {
            setLitreRate("");
            setOldRate("No Customer found");
          } else if (data) {
            setLitreRate(data.litre_rate);
            setOldRate(data.litre_rate);
          } else {
            setLitreRate("");
            setOldRate("");
          }
        } catch (error) {
          Alert.alert("Error", "An unexpected error occurred");
        }
      }
    };
    fetchLitreRate();
  }, [customerNumber]);

  async function handleSaveData() {
    if (!customerNumber || !litreRate) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("fixed_rate_customer")
        .update({ litre_rate: litreRate })
        .eq("customer_number", customerNumber);
      if (error) {
        Alert.alert("Error", "An error occurred while updating the data");
      } else {
        Alert.alert("Success", "Customer details updated");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  async function handleDeleteCustomer() {
    if (!customerNumber) {
      Alert.alert("Error", "Please enter a customer number to delete");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("fixed_rate_customer")
        .delete()
        .eq("customer_number", customerNumber);
      if (error) {
        Alert.alert("Error", "An error occurred while deleting the customer");
      } else {
        setLitreRate("");
        setOldRate("");
        Alert.alert("Success", "Customer deleted successfully");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Manage Fixed Rate Customer</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer Number"
          value={customerNumber}
          onChangeText={setCustomerNumber}
          keyboardType="numeric"
        />
        {oldRate !== "" && (
          <Text style={styles.oldRateText}>Old Rate: {oldRate}</Text> // Display old rate
        )}
        <TextInput
          style={styles.input}
          placeholder="Litre Rate"
          value={litreRate}
          onChangeText={setLitreRate}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              color={Colors.Green}
              title="Save"
              onPress={handleSaveData}
            />
          </View>
          <View style={styles.button}>
            <Button
              color={Colors.Red}
              title="Delete"
              onPress={handleDeleteCustomer}
            />
          </View>
        </View>
        <View style={styles.goBackButton}>
          <Button title="Go Back" onPress={goBack} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  formDesign: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 40,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  button: {
    width: "45%",
    marginHorizontal: 5,
  },
  goBackButton: {
    width: "45%",
    alignSelf: "center",
    marginTop: 10,
  },
  oldRateText: {
    fontSize: 16,
    paddingBottom: 10,
  },
});
