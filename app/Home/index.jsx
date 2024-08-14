import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";
import service from "../../Services/service";
import { RadioButton } from "react-native-paper";

export default function index() {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState("option1");
  const handleLogout = async () => {
    await service.clearUserData();
    router.push("/Login");
  };
  return (
    <View style={styles.bg}>
      <View style={styles.searchButton}>
        <Button color={Colors.Green} title="Logout" onPress={handleLogout} />
      </View>
      <View style={styles.formDesign}>
        <TextInput style={styles.input} placeholder="Customer Name" />
        <TextInput style={styles.input} placeholder="Customer Number" />
        <TextInput style={styles.input} placeholder="Amount" />

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="option1"
              status={selectedValue === "option1" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("option1")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Debit</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="option2"
              status={selectedValue === "option2" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("option2")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Credit</Text>
          </View>
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
    top: 20,
    left: 28,
    width: 360,
    height: 350,
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  searchButton: {
    width: 100,
    color: Colors.Green,
    left: 150,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
});
