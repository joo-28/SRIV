import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";

export default function CenterReport() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reportEntries, setReportEntries] = useState([]);
  const router = useRouter();

  const fetchReportData = async () => {
    try {
      // Fetch all customer numbers from fixed_rate_customer
      const { data: customers, error: customerError } = await supabase
        .from("fixed_rate_customer")
        .select("customer_number");

      if (customerError) throw customerError;

      let aggregatedData = [];

      // Iterate through each customer to fetch and aggregate their details
      for (const customer of customers) {
        const { data: details, error: detailsError } = await supabase
          .from("fixed_rate_customer_details")
          .select("DATE, AM_PM, Total_litre, Amount")
          .eq("customer_number", customer.customer_number)
          .gte("DATE", fromDate.toISOString())
          .lte("DATE", toDate.toISOString());

        if (detailsError) throw detailsError;

        // Aggregate total litre and total amount for this customer
        const totalLitre = details.reduce(
          (sum, entry) => sum + entry.Total_litre,
          0
        );
        const totalAmount = details.reduce(
          (sum, entry) => sum + entry.Amount,
          0
        );

        // Format date and AM_PM for each entry
        const formattedEntries = details.map((entry) => {
          const formattedDate = new Date(entry.DATE)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
            })
            .replace(/\//g, "-");
          const formattedAMPM = entry.AM_PM.toUpperCase();
          return {
            customer_number: customer.customer_number,
            shift: `${formattedDate}-${formattedAMPM}`,
            total_litre: totalLitre,
            total_amount: totalAmount,
          };
        });

        aggregatedData = [...aggregatedData, ...formattedEntries];
      }

      setReportEntries(aggregatedData);
    } catch (error) {
      console.log("Error fetching report data:", error.message);
      Alert.alert(
        "Error fetching report data",
        "There was an error retrieving the report data. Please try again."
      );
    }
  };

  const handleSearch = () => {
    fetchReportData();
  };

  const handleFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromPicker(false);
    setFromDate(currentDate);
  };

  const handleToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToPicker(false);
    setToDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>All Fixed Rate Customer</Text>
        <View style={styles.userField}>
          <Text style={styles.label}>From</Text>
          <View style={styles.datePickerContainer}>
            <Button
              onPress={() => setShowFromPicker(true)}
              title={fromDate.toDateString()}
            />
            {showFromPicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="default"
                onChange={handleFromDateChange}
                maximumDate={new Date()} // Restrict future dates
                style={styles.datePicker}
              />
            )}
          </View>
        </View>
        <View style={styles.userField}>
          <Text style={styles.label}>To</Text>
          <View style={styles.datePickerContainer}>
            <Button
              onPress={() => setShowToPicker(true)}
              title={toDate.toDateString()}
            />
            {showToPicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="default"
                onChange={handleToDateChange}
                maximumDate={new Date()}
                style={styles.datePicker}
              />
            )}
          </View>
        </View>
        <View style={styles.searchButton}>
          <Button
            color={Colors.Green}
            title="See Reports"
            onPress={handleSearch}
          />
        </View>
      </View>

      <View style={styles.dataContainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Customer Number</Text>
            <Text style={styles.tableHeaderText}>Total Litre</Text>
            <Text style={styles.tableHeaderText}>Total Amount</Text>
          </View>

          {reportEntries.length > 0 ? (
            reportEntries.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{entry.customer_number}</Text>
                <Text style={styles.tableCell}>{entry.shift}</Text>
                <Text style={styles.tableCell}>{entry.total_litre}</Text>
                <Text style={styles.tableCell}>{entry.total_amount}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No report entries found.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.addButton}>
          <Button
            color={Colors.DarkBlue}
            title="Go Back"
            onPress={() => router.back()}
          />
        </View>
      </View>
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
    paddingTop: 8,
    marginBottom: 5,
    width: "25%",
  },
  datePickerContainer: {
    marginBottom: 10,
    width: "70%",
  },
  searchButton: {
    alignItems: "center",
  },
  dataContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    flex: 1,
  },
  userField: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.DarkBlue,
    padding: 5,
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
    width: "25%",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  tableCell: {
    width: "25%",
    textAlign: "center",
    fontSize: 12,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    marginBottom: 15,
  },
  addButton: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
});
