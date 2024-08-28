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

export default function CustomerReport() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reportEntries, setReportEntries] = useState({});
  const [totalAmount, setTotalAmount] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const router = useRouter();

  const fetchCustomerNumbers = async () => {
    try {
      const { data: customerData, error: customerError } = await supabase
        .from("fixed_rate_customer")
        .select("customer_number");
      if (customerError) throw customerError;
      const customerNumbers = customerData.map(
        (customer) => customer.customer_number
      );
      return customerNumbers;
    } catch (error) {
      Alert.alert(
        "Error fetching customer numbers",
        "There was an error retrieving the customer numbers. Please try again."
      );
      return [];
    }
  };

  const fetchReportData = async () => {
    try {
      const customerNumbers = await fetchCustomerNumbers();
      if (customerNumbers.length === 0) {
        Alert.alert(
          "No customers available",
          "No customers were found to generate reports."
        );
        return;
      }
      const { data: customerShiftData, error: customerShiftError } =
        await supabase
          .from("fixed_rate_customer_shift_details")
          .select("customer_number, DATE, AM_PM, litre, litre_rate, amount")
          .in("customer_number", customerNumbers)
          .gte("DATE", fromDate.toISOString())
          .lte("DATE", toDate.toISOString());
      if (customerShiftError) throw customerShiftError;

      let customers = new Set(customerNumbers);
      const report = {};
      const totalAmt = {};
      customers.forEach((customer) => {
        report[customer] = [];
        totalAmt[customer] = { litre: 0, amount: 0 };
      });

      customerShiftData.forEach((shift) => {
        const customer = shift.customer_number;
        const formattedDate = new Date(shift.DATE)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })
          .replace(/\//g, "-");
        const formattedAMPM = shift.AM_PM.toUpperCase();

        report[customer].push({
          date: `${formattedDate}-${formattedAMPM}`,
          litre: shift.litre,
          litreRate: shift.litre_rate,
          amount: shift.amount,
        });

        totalAmt[customer].litre += shift.litre || 0;
        totalAmt[customer].amount += shift.amount || 0;
      });

      setCustomerList([...customers]);
      setReportEntries(report);
      setTotalAmount(totalAmt);
    } catch (error) {
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

  // Function to calculate total litres and total amount across all customers
  const calculateTotalLitresAndAmount = () => {
    let totalLitres = 0;
    let totalAmt = 0;

    Object.values(totalAmount).forEach(({ litre, amount }) => {
      totalLitres += litre;
      totalAmt += amount;
    });

    return {
      totalLitres: totalLitres.toFixed(2),
      totalAmt: totalAmt.toFixed(2),
    };
  };

  const { totalLitres, totalAmt } = calculateTotalLitresAndAmount();

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Fixed Rate Customer Report</Text>
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
                maximumDate={new Date()} // Restrict future dates
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryTableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.SummarytableHeaderText}>
              {"         "}
              Total Litre: {totalLitres} {"       "}Total Amount: ₹{totalAmt}
            </Text>
          </View>

          {customerList.length > 0 ? (
            customerList.map((customer, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{customer}</Text>
                <Text style={styles.tableCell}>
                  {totalAmount[customer]?.litre?.toFixed(2) || 0}
                </Text>
                <Text style={styles.tableCell}>
                  {totalAmount[customer]?.amount?.toFixed(2) || 0}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No data available.</Text>
          )}
        </View>

        {customerList.map((customer, index) => (
          <View key={index} style={styles.dataContainer}>
            <Text style={styles.customerTitle}>{`${customer} `}</Text>
            <Text style={styles.customerTitleText}>
              {`           Total Litre: ${
                totalAmount[customer]?.litre?.toFixed(2) || 0
              }    Total Amount: ₹${
                totalAmount[customer]?.amount?.toFixed(2) || 0
              }`}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Litre</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
              <Text style={styles.tableHeaderText}>Litre Rate</Text>
            </View>

            {reportEntries[customer] && reportEntries[customer].length > 0 ? (
              reportEntries[customer].map((entry, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{entry.date}</Text>
                  <Text style={styles.tableCell}>{entry.litre || "-"}</Text>
                  <Text style={styles.tableCell}>{entry.amount || "-"}</Text>
                  <Text style={styles.tableCell}>{entry.litreRate || "-"}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No report entries found for this customer.
              </Text>
            )}
          </View>
        ))}
      </ScrollView>

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
  userField: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  dataContainer: {
    backgroundColor: "white",
    elevation: 5,
    marginBottom: 10,
    paddingVertical: 6,
  },
  customerTitle: {
    fontSize: 18,
    padding: 5,
    textAlign: "center",
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
    width: "20%",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  tableCell: {
    width: "20%",
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
  summaryTableContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  SummarytableHeaderText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  customerTitleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
