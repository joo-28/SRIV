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
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
export default function Menu() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [totalLitres, setTotalLitres] = useState("");
  const [FAT, setFAT] = useState("");
  const [SNF, setSNF] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM");
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  async function handleSaveData() {
    if (totalLitres === "") {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    const { data, error } = await supabase.from("cc_shift_entry").insert([
      {
        DATE: date,
        AM_PM: selectedValue,
        Total_litre: parseFloat(totalLitres),
        FAT: parseFloat(FAT),
        SNF: parseFloat(SNF),
      },
    ]);
    if (error) {
      Alert.alert("Error", "Already Data inserted in this shift");
    } else {
      Alert.alert("Success", "Data saved successfully");
      setTotalLitres("");
      setFAT("");
      setSNF("");
    }
  }
  async function handleMenu() {
    router.push("/CCUserMenu");
  }
  function handleEditEntry() {
    router.push("/EditCCShiftEntry");
  }
  const { width } = useWindowDimensions();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>CC Shift Entry</Text>
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
            style={styles.outsideButton}
            color={Colors.Blue}
            title="Edit Entry"
            onPress={handleEditEntry}
          />
        </View>
      </View>
      <View style={styles.menuButton}>
        <Button color={Colors.DarkBlue} title="menu" onPress={handleMenu} />
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
    marginBottom: 15,
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
    marginBottom: 8,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
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
    marginBottom: 10,
    alignSelf: "center",
  },
  menuButton: {
    width: "45%",
  },
});
