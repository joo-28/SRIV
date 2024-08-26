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
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

export default function EditCCEntry() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [totalLitres, setTotalLitres] = useState("");
  const [FAT, setFAT] = useState("");
  const [SNF, setSNF] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM"); // Default to AM

  useEffect(() => {
    async function fetchEntryData() {
      const { data, error } = await supabase
        .from("cc_shift_entry")
        .select("*")
        .eq("DATE", currentDate.toISOString().split("T")[0])
        .eq("AM_PM", selectedValue)
        .single();
      if (error) {
        console.log("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch data");
        setTotalLitres("");
        setFAT("");
        setSNF("");
      } else {
        if (data) {
          setTotalLitres(data.Total_liter.toString());
          setFAT(data.FAT.toString());
          setSNF(data.SNF.toString());
        }
      }
    }

    fetchEntryData();
  }, [currentDate, selectedValue]);

  const onChange = (event, selectedDate) => {
    const date = selectedDate || currentDate;
    setShow(Platform.OS === "ios");
    setCurrentDate(date);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  async function handleUpdateData() {
    if (totalLiters === "" || FAT === "" || SNF === "") {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const { data, error } = await supabase.from("cc_shift_entry").upsert({
      DATE: currentDate.toISOString().split("T")[0],
      AM_PM: selectedValue,
      Total_litre: parseFloat(totalLitres),
      FAT: parseFloat(FAT),
      SNF: parseFloat(SNF),
    });

    if (error) {
      console.log("Error updating data:", error);
      Alert.alert("Error", "Failed to update data");
      setTotalLitres("");
      setFAT("");
      setSNF("");
    } else {
      console.log("Updated data:", data);
      Alert.alert("Success", "Data updated successfully");
    }
  }

  const { width } = useWindowDimensions();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>Edit CC Shift Entry</Text>
        <View style={styles.datePickerContainer}>
          <Button onPress={showDatePicker} title={currentDate.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={currentDate}
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
        <Text style={styles.radioLabel}>Total Litres</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Litres"
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
              onPress={handleUpdateData}
            />
          </View>
        </View>
      </View>
      <Button
        title="Go Back"
        onPress={() => router.back()}
        color={Colors.DarkBlue} // You can change the color to match your design
        style={styles.goBackButton}
      />
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
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
  datePicker: {
    width: "100%",
  },
  goBackButton: {
    marginBottom: 20,
    width: "100%",
  },
});
