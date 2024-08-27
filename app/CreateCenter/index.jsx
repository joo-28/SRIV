import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";

export default function AddNewUser() {
  // State Variables
  const router = useRouter();
  const [centerNumber, setCenterNumber] = useState("");
  const [milkRate, setMilkRate] = useState("");

  // State Functions
  const goBack = () => {
    router.back();
  };

  async function handleSaveData() {
    if (!centerNumber || !milkRate) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("milk_booth")
        .insert([{ center_number: centerNumber, milk_rate: milkRate }]);

      if (error) {
        console.error("Error inserting data:", error);
        Alert.alert("Error", "An error occurred while adding the data");
      } else {
        console.log("Inserted data:", data);
        Alert.alert("Success", "New center added");
        setCenterNumber("");
        setMilkRate("");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Create New Center</Text>
        <TextInput
          style={styles.input}
          placeholder="Center Number"
          value={centerNumber}
          onChangeText={setCenterNumber}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Milk Rate"
          value={milkRate}
          onChangeText={setMilkRate}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button color={Colors.Green} title="ADD" onPress={handleSaveData} />
          </View>
          <View style={styles.goBackButton}>
            <Button title="Go Back" onPress={goBack} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "space-around",
  },
  saveButton: {
    width: "45%",
    marginBottom: 10,
    alignSelf: "center",
  },
  editButton: {
    width: "45%",
    marginBottom: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "45%",
    alignSelf: "center",
  },
});
