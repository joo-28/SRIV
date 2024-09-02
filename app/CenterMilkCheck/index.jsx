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
import { useRouter } from "expo-router";

export default function CenterMilkCheck() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amPm, setAmPm] = useState("AM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalFixedCustomer, setTotalFixedCustomer] = useState(0);
  const [centerValues, setCenterValues] = useState({});
  const [fixedValue, setFixedValue] = useState(0);
  const [externalSales, setExternalSales] = useState(0);
  const [difference, setDifference] = useState(0);
  const router = useRouter();

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

  const fetchExternalSales = async () => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from("external_company_sales")
        .select("company_name");

      if (companyError) throw companyError;

      const companies = companyData.map((company) => company.company_name);

      const { data: salesData, error: salesError } = await supabase
        .from("external_company_sales_report")
        .select("company_name, total_litre")
        .in("company_name", companies)
        .eq("AM_PM", amPm);

      if (salesError) throw salesError;

      const totalExternalSales = salesData.reduce(
        (total, entry) => total + entry.total_litre,
        0
      );
      setExternalSales(totalExternalSales);
      return totalExternalSales;
    } catch (error) {
      Alert.alert("Error", "There was an error fetching external sales data.");
      return 0;
    }
  };

  const handleCheck = async () => {
    const fixedCustomerLitre = await fetchFixedCustomerData();
    const centerData = await fetchCenterData();
    const fixedVal = await fetchFixedValue();
    const externalSalesValue = await fetchExternalSales();

    const totalCenterLitre = Object.values(centerData).reduce(
      (total, litre) => total + litre,
      0
    );

    const difference =
      fixedCustomerLitre - totalCenterLitre - fixedVal - externalSalesValue;

    setDifference(difference);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
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
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.userField}>
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
            Fixed Customer Total Milk:{" "}
            <Text style={styles.resultValue}>
              {"                      "}
              {totalFixedCustomer.toFixed(1)}
            </Text>
          </Text>

          {Object.keys(centerValues).map((center) => (
            <Text key={center} style={styles.resultText}>
              Center{" "}
              <Text style={styles.resultValue}>
                {center}:{" "}
                {"                                                       "}-
                {centerValues[center].toFixed(1)}
              </Text>
            </Text>
          ))}

          <Text style={styles.resultText}>
            Center Standard Milk:{" "}
            <Text style={styles.resultValue}>
              {" "}
              {"                              "}-{fixedValue.toFixed(1)}
            </Text>
          </Text>

          <Text style={styles.resultText}>
            External Sales:{" "}
            <Text style={styles.resultValue}>
              {" "}
              {"                                           "}-
              {externalSales.toFixed(1)}
            </Text>
          </Text>

          <Text style={styles.resultText}>
            Difference:{" "}
            <Text style={styles.resultValueDiff}>
              {" "}
              {"                                      "}
              {difference.toFixed(1)}
            </Text>
          </Text>
        </View>
      </ScrollView>
      <View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Blue}
            title="Go Back"
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  form: {
    backgroundColor: Colors.Yellow,
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
    backgroundColor: Colors.Yellow,
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
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  resultValue: {
    fontWeight: "bold",
  },
  resultValueDiff: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
