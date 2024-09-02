import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState, useEffect } from "react";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

export default function EditCenterShift() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [totalLitres, setTotalLitres] = useState("");
  const [FAT, setFAT] = useState("");
  const [SNF, setSNF] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM");
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    async function fetchEntryData() {
      const { data, error } = await supabase
        .from("center_shift_entry")
        .select("*")
        .eq("DATE", currentDate.toISOString().split("T")[0])
        .eq("AM_PM", selectedValue)
        .single();

      if (data) {
        setExistingData(data);
        setTotalLitres(data.Total_litre?.toString() || "");
        setFAT(data.FAT?.toString() || "");
        setSNF(data.SNF?.toString() || "");
        setTotalAmount(data.total_amt?.toString() || "");
      } else {
        setExistingData(null);
        // Clear input values if no data found
        if (existingData && existingData.AM_PM !== selectedValue) {
          setTotalLitres("");
          setFAT("");
          setSNF("");
          setTotalAmount("");
        }
      }
    }
    fetchEntryData();
  }, [currentDate, selectedValue]);

  const onChangeDate = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setCurrentDate(selectedDate || currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const formatDecimal = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "";
    return number.toFixed(1);
  };

  const handleTextChange = (setter) => (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setter(formatDecimal(text));
    }
  };

  async function handleSaveData() {
    if (!totalLitres || !FAT || !SNF || !totalAmount) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const entryData = {
      DATE: currentDate.toISOString().split("T")[0],
      AM_PM: selectedValue,
      Total_litre: parseFloat(totalLitres),
      FAT: parseFloat(FAT),
      SNF: parseFloat(SNF),
      total_amt: parseFloat(totalAmount),
    };

    const { data, error } = await supabase
      .from("center_shift_entry")
      .upsert(entryData);

    if (error) {
      Alert.alert("Error", "Failed to save data");
    } else {
      Alert.alert("Success", "Data saved successfully");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Center Shift Entry</Text>
        <View style={styles.datePickerContainer}>
          <Button onPress={showDatePicker} title={currentDate.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={currentDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="AM"
              status={selectedValue === "AM" ? "checked" : "unchecked"}
              onPress={() => {
                setSelectedValue("AM");
                if (existingData && existingData.AM_PM !== "AM") {
                  setTotalLitres("");
                  setFAT("");
                  setSNF("");
                  setTotalAmount("");
                }
              }}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>AM</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="PM"
              status={selectedValue === "PM" ? "checked" : "unchecked"}
              onPress={() => {
                setSelectedValue("PM");
                if (existingData && existingData.AM_PM !== "PM") {
                  // Clear values if switching to PM and no data found
                  setTotalLitres("");
                  setFAT("");
                  setSNF("");
                  setTotalAmount("");
                }
              }}
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
          onChangeText={handleTextChange(setTotalLitres)}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>FAT</Text>
        <TextInput
          style={styles.input}
          placeholder="FAT"
          value={FAT}
          onChangeText={handleTextChange(setFAT)}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>SNF</Text>
        <TextInput
          style={styles.input}
          placeholder="SNF"
          value={SNF}
          onChangeText={handleTextChange(setSNF)}
          keyboardType="numeric"
        />
        <Text style={styles.radioLabel}>Total Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={totalAmount}
          onChangeText={handleTextChange(setTotalAmount)}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title={existingData ? "Update" : "Save"}
              onPress={handleSaveData}
            />
          </View>
        </View>
      </View>
      <View style={styles.saveButton}>
        <Button
          title="Menu"
          onPress={() => router.push("/CenterStaffMenu")}
          color={Colors.DarkBlue}
          style={styles.goBackButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    width: "90%",
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
    marginTop: 10,
  },
  goBackButton: {
    marginBottom: 20,
    width: "100%",
  },
});
