import React, { useState, useEffect } from "react";
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
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export default function EditCenterShift() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [totalLitres, setTotalLitres] = useState("");
  const [FAT, setFAT] = useState("");
  const [SNF, setSNF] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM");
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const company = companyList.find(
        (comp) => comp.company_number === selectedCompany
      );
      setSelectedCompanyName(company ? company.company_name : "");
      fetchEntryData();
    }
  }, [selectedCompany, currentDate, selectedValue]);

  const fetchCompanyData = async () => {
    const { data, error } = await supabase
      .from("external_company_sales")
      .select("company_number, company_name");

    if (error) {
      Alert.alert("Error", "Failed to fetch company data");
      console.log(error);
    } else {
      setCompanyList(data);
      setSelectedCompany("");
    }
  };

  async function fetchEntryData() {
    const { data, error } = await supabase
      .from("external_company_sales_report")
      .select("*")
      .eq("company_number", selectedCompany)
      .eq("DATE", currentDate.toISOString().split("T")[0])
      .eq("AM_PM", selectedValue)
      .single();

    if (data) {
      setExistingData(data);
      setTotalLitres(data.total_litre?.toString() || "");
      setFAT(data.FAT?.toString() || "");
      setSNF(data.SNF?.toString() || "");
    } else {
      setExistingData(null);
      setTotalLitres("");
      setFAT("");
      setSNF("");
    }
  }

  const onChangeDate = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setCurrentDate(selectedDate || currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleTextChange = (setter) => (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setter(text);
    }
  };

  async function handleSaveData() {
    if (!selectedCompany || !totalLitres || !FAT || !SNF) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const entryData = {
      company_number: selectedCompany,
      company_name: selectedCompanyName,
      DATE: currentDate.toISOString().split("T")[0],
      AM_PM: selectedValue,
      total_litre: parseFloat(totalLitres),
      FAT: parseFloat(FAT),
      SNF: parseFloat(SNF),
    };

    const { error } = await supabase
      .from("external_company_sales_report")
      .upsert(entryData);

    if (error) {
      Alert.alert("Error", "Failed to save data");
    } else {
      Alert.alert("Success", "Data saved successfully");

      setTotalLitres("");
      setFAT("");
      setSNF("");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>External Sales Entry</Text>

        <Picker
          selectedValue={selectedCompany}
          style={styles.input}
          onValueChange={(itemValue) => setSelectedCompany(itemValue)}
        >
          <Picker.Item label="Select a company" value="" />
          {companyList.map((company) => (
            <Picker.Item
              key={company.company_number}
              label={company.company_name}
              value={company.company_number}
            />
          ))}
        </Picker>

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

        <Text style={styles.label}>Total Litre</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Litre"
          value={totalLitres}
          onChangeText={handleTextChange(setTotalLitres)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>FAT</Text>
        <TextInput
          style={styles.input}
          placeholder="FAT"
          value={FAT}
          onChangeText={handleTextChange(setFAT)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>SNF</Text>
        <TextInput
          style={styles.input}
          placeholder="SNF"
          value={SNF}
          onChangeText={handleTextChange(setSNF)}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title={existingData ? "Update" : "Save"}
            onPress={handleSaveData}
          />
        </View>
      </View>
      <View style={styles.goBackButtonCon}>
        <Button
          title="Go Back"
          onPress={() => router.back()}
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
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  heading: {
    fontSize: 26,
    alignSelf: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 18,
    color: "#333",
  },
  label: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
  },
  goBackButton: {
    marginTop: 20,
    width: "100%",
  },
  goBackButtonCon: {
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
  },
});
