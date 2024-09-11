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
  const [CCFAT, setCCFAT] = useState("");
  const [CCSNF, setCCSNF] = useState("");
  const [CCKG, setCCKG] = useState("");
  const [CCLitre, setCCLitre] = useState("");
  const [selectedValue, setSelectedValue] = useState("AM");
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [fixedxs, setFixedxs] = useState(0);
  const [existingData, setExistingData] = useState(null);
  const [TS, setTS] = useState(0); // State for TS value

  useEffect(() => {
    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const company = companyList.find(
        (comp) => comp.company_number === selectedCompany
      );
      setSelectedCompanyName(company ? company.company_name : "");

      setFixedxs(company ? company.fixedxs : 0);

      fetchTSValue(); // Fetch TS value when company is selected
      fetchEntryData();
    }
  }, [selectedCompany, currentDate, selectedValue]);

  const fetchCompanyData = async () => {
    const { data, error } = await supabase
      .from("external_company_sales")
      .select("company_number, company_name, fixedxs");
    if (error) {
      Alert.alert("Error", "Failed to fetch company data");
      console.log(error);
    } else {
      setCompanyList(data);
      setSelectedCompany("");
    }
  };

  const fetchTSValue = async () => {
    const { data, error } = await supabase
      .from("external_company_sales")
      .select("ts")
      .eq("company_number", selectedCompany)
      .single();
    if (data) {
      setTS(data.ts || 0); // Set the TS value
    } else if (error) {
      console.log("Failed to fetch TS value:", error);
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
      setCCFAT(data.CCFAT?.toString() || "");
      setCCSNF(data.CCSNF?.toString() || "");

      const ccLitreValue = data.cc_accurate_litre?.toString() || "";
      setCCLitre(ccLitreValue);
      if (!data.CCKG && ccLitreValue) {
        setCCKG((parseFloat(ccLitreValue) / 1.03).toFixed(1));
      } else {
        setCCKG(data.CCKG?.toString() || "");
      }
    } else {
      setExistingData(null);
      setTotalLitres("");
      setFAT("");
      setSNF("");
      setCCFAT("");
      setCCSNF("");
      setCCKG("");
      setCCLitre("");
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
    setter(text);
  };

  const handleCCKGChange = (value) => {
    setCCKG(value);

    if (!isNaN(parseFloat(value)) && value.trim() !== "") {
      setCCLitre((Math.floor((parseFloat(value) / 1.03) * 10) / 10).toFixed(1));
    } else {
      setCCLitre("");
    }
  };

  const handleCCLitreChange = (value) => {
    setCCLitre(value);

    if (!isNaN(parseFloat(value)) && value.trim() !== "") {
      setCCKG((Math.floor(parseFloat(value) * 1.03 * 10) / 10).toFixed(1));
    } else {
      setCCKG("");
    }
  };

  async function handleSaveData() {
    if (!selectedCompany || !totalLitres || !FAT || !SNF) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    const totalLitresValue = parseFloat(totalLitres);

    const accurateLitre = totalLitresValue + fixedxs;

    const litreRate = parseFloat(
      (
        ((parseFloat(CCFAT) + parseFloat(CCSNF)) * parseFloat(TS)) /
        100
      ).toFixed(2)
    );
    console.log(litreRate);
    const totalAmount = litreRate * parseFloat(CCLitre);

    const entryData = {
      company_number: selectedCompany,
      company_name: selectedCompanyName,
      DATE: currentDate.toISOString().split("T")[0],
      AM_PM: selectedValue,
      total_litre: totalLitresValue,
      FAT: parseFloat(FAT),
      SNF: parseFloat(SNF),
      CCFAT: parseFloat(CCFAT),
      CCSNF: parseFloat(CCSNF),
      cc_accurate_litre: parseFloat(CCLitre),
      center_accurate_litre: accurateLitre,
      total_amount: totalAmount,
      litre_rate: litreRate,
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
      setCCFAT("");
      setCCSNF("");
      setCCKG("");
      setCCLitre("");
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

        <Text style={styles.label}>CCFAT</Text>
        <TextInput
          style={styles.input}
          placeholder="CCFAT"
          value={CCFAT}
          onChangeText={handleTextChange(setCCFAT)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>CCSNF</Text>
        <TextInput
          style={styles.input}
          placeholder="CCSNF"
          value={CCSNF}
          onChangeText={handleTextChange(setCCSNF)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>CC KG</Text>
        <TextInput
          style={styles.input}
          placeholder="CC KG"
          value={CCKG}
          onChangeText={handleCCKGChange}
          keyboardType="numeric"
        />

        <Text style={styles.label}>CC Litre</Text>
        <TextInput
          style={styles.input}
          placeholder="CC Litre"
          value={CCLitre}
          onChangeText={handleCCLitreChange}
          keyboardType="numeric"
        />

        <Button
          title={existingData ? "Update" : "Save"}
          onPress={handleSaveData}
          color={Colors.primary}
        />
      </View>
      <View style={styles.addButton}>
        <Button
          color={Colors.DarkBlue}
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: Colors.bg,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "#fff",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  radioLabel: {
    marginLeft: 5,
  },
  addButton: {
    marginTop: 10,
    width: "90%",
    alignSelf: "center",
  },
});
