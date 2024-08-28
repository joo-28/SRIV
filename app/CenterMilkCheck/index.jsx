//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";
import { RadioButton } from "react-native-paper";

export default function CenterMilkCheck() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amPm, setAmPm] = useState("AM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalFixedCustomer, setTotalFixedCustomer] = useState(0);
  const [centerValues, setCenterValues] = useState([]);
  const [fixedValue, setFixedValue] = useState(0);
  const [totalLitre, setTotalLitre] = useState(0);
  const [diff, setDiff] = useState(0);
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };
  const fetchFixedCustomerData = async () => {
    try {
      const { data, error } = await supabase
        .from("fixed_rate_customer_shift_details")
        .select("litre")
        .eq("DATE", selectedDate.toISOString().split("T")[0])
        .eq("AM_PM", amPm);
      if (error) throw error;
      const totalLitre = data.reduce((total, entry) => total + entry.litre, 0);
      setTotalFixedCustomer(totalLitre);
      return totalLitre;
    } catch (error) {
      Alert.alert("Error", "There was an error fetching fixed customer data.");
      return 0;
    }
  };
  const fetchCenterData = async () => {
    try {
      const { data, error } = await supabase
        .from("center_milk_sales")
        .select("center_number, litre")
        .eq("DATE", selectedDate.toISOString().split("T")[0])
        .eq("AM_PM", amPm);
      if (error) throw error;
      const centers = {};
      data.forEach((entry) => {
        if (centers[entry.center_number]) {
          centers[entry.center_number] += entry.litre;
        } else {
          centers[entry.center_number] = entry.litre;
        }
      });
      setCenterValues(centers);
      return centers;
    } catch (error) {
      Alert.alert("Error", "There was an error fetching center data.");
      return {};
    }
  };
  const fetchFixedValue = async () => {
    try {
      const { data, error } = await supabase
        .from("center_secret")
        .select("value")
        .eq("id", 1)
        .single();
      if (error) throw error;
      setFixedValue(data.value || 0);
      return data.value || 0;
    } catch (error) {
      Alert.alert("Error", "There was an error fetching fixed value.");
      return 0;
    }
  };
  const handleCheck = async () => {
    const fixedCustomerLitre = await fetchFixedCustomerData();
    const centerData = await fetchCenterData();
    const fixedVal = await fetchFixedValue();
    const totalCenterLitre = Object.values(centerData).reduce(
      (total, litre) => total + litre,
      0
    );
    const totalLitres = totalCenterLitre + fixedVal;
    const difference = totalLitres - fixedCustomerLitre;
    setTotalLitre(totalLitres);
    setDiff(difference);
  };
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Center Milk Check</Text>

        <View style={styles.userField}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()} // Restrict future dates
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.userField}>
          <Text style={styles.label}>AM/PM</Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="AM"
                status={amPm === "AM" ? "checked" : "unchecked"}
                onPress={() => setAmPm("AM")}
              />
              <Text style={styles.radioText}>AM</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton
                value="PM"
                status={amPm === "PM" ? "checked" : "unchecked"}
                onPress={() => setAmPm("PM")}
              />
              <Text style={styles.radioText}>PM</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="Check" onPress={handleCheck} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Total Fixed Customer Litre: {totalFixedCustomer.toFixed(2)}
          </Text>

          <Text style={styles.resultText}>Centers:</Text>
          {Object.keys(centerValues).map((center) => (
            <Text key={center} style={styles.resultText}>
              Center {center}: {centerValues[center].toFixed(2)} litre
            </Text>
          ))}

          <Text style={styles.resultText}>
            Fixed Value: {fixedValue.toFixed(2)} litre
          </Text>

          <Text style={styles.resultText}>
            Total Litre: {totalLitre.toFixed(2)} litre
          </Text>

          <Text style={styles.resultText}>
            Difference: {diff.toFixed(2)} litre
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Yellow,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    elevation: 5,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
  },
  userField: {
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.White,
    alignItems: "center",
    marginTop: 8,
  },
  dateButtonText: {
    color: Colors.DarkBlue,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  resultContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
