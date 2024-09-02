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
  const [selectedValue, setSelectedValue] = useState("AM");
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    async function fetchEntryData() {
      const { data, error } = await supabase
        .from("cc_shift_entry")
        .select("*")
        .eq("DATE", currentDate.toISOString().split("T")[0])
        .eq("AM_PM", selectedValue)
        .single();
      if (error) {
        console.log("Error fetching data:", error.message);
      } else {
        setExistingData(data);
        if (data) {
          setTotalLitres(data.Total_litre?.toFixed(1) || "");
          setFAT(data.FAT?.toFixed(1) || "");
          setSNF(data.SNF?.toFixed(1) || "");
        } else {
          setTotalLitres("");
          setFAT("");
          setSNF("");
        }
      }
    }
    fetchEntryData();
  }, [currentDate, selectedValue]);

  const onChange = (event, selectedDate) => {
    const date = selectedDate || currentDate;
    setShow(Platform.OS === "ios");
    setCurrentDate(date);
    // Clear input fields when the date changes
    setTotalLitres("");
    setFAT("");
    setSNF("");
    // Optionally, clear existing data if you want to reset the form state
    setExistingData(null);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleUpdateData = async () => {
    if (!totalLitres && !FAT && !SNF) {
      Alert.alert("Error", "At least one field must be filled out");
      return;
    }

    try {
      const data = {
        DATE: currentDate.toISOString().split("T")[0],
        AM_PM: selectedValue,
        Total_litre: parseFloat(totalLitres) || null,
        FAT: parseFloat(FAT) || null,
        SNF: parseFloat(SNF) || null,
      };

      if (existingData) {
        await supabase.from("cc_shift_entry").upsert(data);
      } else {
        await supabase.from("cc_shift_entry").insert(data);
      }

      Alert.alert("Success", "Data saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save data");
    }
  };

  const handleRadioChange = (value) => {
    setSelectedValue(value);
    if (existingData && existingData.AM_PM !== value) {
      setTotalLitres("");
      setFAT("");
      setSNF("");
    }
  };

  const handleTextChange = (setter) => (text) => {
    if (/^\d*\.?\d{0,1}$/.test(text)) {
      setter(text);
    }
  };

  const { width } = useWindowDimensions();

  const buttonTitle = existingData ? "Update" : "Save";

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
              onPress={() => handleRadioChange("AM")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>AM</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="PM"
              status={selectedValue === "PM" ? "checked" : "unchecked"}
              onPress={() => handleRadioChange("PM")}
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
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title={buttonTitle}
              onPress={handleUpdateData}
            />
          </View>
        </View>
      </View>
      <View style={styles.saveButton}>
        <Button
          title="Menu"
          onPress={() => router.push("/CCUserMenu")}
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
    padding: 10,
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    marginTop: 40,
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
    fontSize: 14,
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
