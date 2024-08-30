//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState, useEffect } from "react";
import Colors from "../../Services/Colors";
export default function UpdateCenterSecret() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [existingValue, setExistingValue] = useState("");

  useEffect(() => {
    const fetchExistingValue = async () => {
      const { data, error } = await supabase
        .from("center_secret")
        .select("value")
        .single();
      if (error) {
        Alert.alert("Error", "Failed to fetch existing value.");
      } else if (data) {
        setExistingValue(data.value);
        setValue(data.value);
      }
    };
    fetchExistingValue();
  }, []);
  const handleSaveData = async () => {
    const { error } = await supabase
      .from("center_secret")
      .upsert({ value })
      .eq("id", 1);
    if (error) {
      Alert.alert("Error", "Failed to update value.");
    } else {
      Alert.alert("Success", "Value updated successfully.");
      setExistingValue(value);
    }
  };
  const goBack = () => {
    router.back();
  };
  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Center Secret</Text>
        <Text style={styles.subHeading}>Previous Value: {existingValue}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter New Value"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title="Update"
              onPress={handleSaveData}
            />
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
    marginBottom: 10,
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 20,
    color: "gray",
  },
  buttonContainer: {
    justifyContent: "space-around",
  },
  saveButton: {
    width: "45%",
    marginBottom: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "45%",
    alignSelf: "center",
  },
});
