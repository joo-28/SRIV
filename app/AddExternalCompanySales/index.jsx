//Completed NO Changes Required - Test Completed - Logs and Blank space Removed

import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
export default function AddNewUser() {
  const router = useRouter();
  const [companyNumber, setCompanyNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const goBack = () => {
    router.back();
  };
  async function handleSaveData() {
    if (!companyNumber || !companyName) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("external_company_sales")
        .insert([{ company_number: companyNumber, company_name: companyName }]);
      if (error) {
        Alert.alert("Error", "An error occurred while adding the data");
      } else {
        Alert.alert("Success", "New Company added");
        setCompanyNumber("");
        setCompanyName("");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Add External Company</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Number"
          value={companyNumber}
          onChangeText={setCompanyNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <View style={styles.goBackButton}>
          <Button color={Colors.Green} title="ADD" onPress={handleSaveData} />
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
  },
  saveButton: {
    width: "50%",
    marginTop: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "50%",
    alignSelf: "center",
    marginTop: 10,
  },
});
