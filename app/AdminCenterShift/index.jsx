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
import React, { useState } from "react";
import service from "../../Services/service";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

export default function Menu() {
  // State Variables
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [totalLitres, setTotalLitres] = useState("");
  const [FAT, setFAT] = useState("");
  const [SNF, setSNF] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM");

  // State Functions
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };

  async function handleSaveData() {
    if (totalLitres === "" || FAT === "" || SNF === "" || totalAmount === "") {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const { data, error } = await supabase.from("center_shift_entry").insert([
      {
        DATE: date,
        AM_PM: selectedValue,
        Total_litre: parseFloat(totalLitres),
        FAT: parseFloat(FAT),
        SNF: parseFloat(SNF),
        total_amt: parseFloat(totalAmount),
      },
    ]);
    if (error) {
      console.log("Error inserting data:", error);
      Alert.alert("Error", "Already Data updated on this date");
      setTotalLitres("");
      setFAT("");
      setSNF("");
      setTotalAmount("");
    } else {
      console.log("Inserted data:", data);
      Alert.alert("Success", "Data saved successfully");
      setTotalLitres("");
      setFAT("");
      setSNF("");
      setTotalAmount("");
    }
  }

  async function handleMenu() {
    // Handle logout functionality here
    router.push("/AdminCenterMenu");
  }

  function handleEditEntry() {
    // Handle edit entry functionality here
    router.push("/EditCenterShift");
  }

  const { width } = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>Center Shift Entry</Text>
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
        <Text style={styles.radioLabel}>Total Litre</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Litre"
          value={totalLitres}
          onChangeText={setTotalLitres}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>FAT</Text>
        <TextInput
          style={styles.input}
          placeholder="FAT"
          value={FAT}
          onChangeText={setFAT}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>SNF</Text>
        <TextInput
          style={styles.input}
          placeholder="SNF"
          value={SNF}
          onChangeText={setSNF}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>Total Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={totalAmount}
          onChangeText={setTotalAmount}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title="Save"
              onPress={handleSaveData}
            />
          </View>
        </View>
      </View>
      <View style={styles.outsideButtonsContainer}>
        <View style={styles.outsideButton}>
          <Button
            color={Colors.Blue}
            title="Edit Entry"
            onPress={handleEditEntry}
          />
        </View>
        <View style={styles.outsideButton}>
          <Button color={Colors.DarkBlue} title="Menu" onPress={handleMenu} />
        </View>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 10,
    fontWeight: "bold",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    width: "45%",
  },
  outsideButtonsContainer: {
    width: "100%",
    marginBottom: 10,
  },
  outsideButton: {
    width: "45%",
    alignSelf: "center",
    marginBottom: 10,
  },
});
