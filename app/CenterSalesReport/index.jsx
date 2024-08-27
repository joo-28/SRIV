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
  const [reportEntries, setReportEntries] = useState({});
  const [totalAmount, setTotalAmount] = useState({});
  const [centerList, setCenterList] = useState([]);
  const router = useRouter();

  const fetchCenterNumbers = async () => {
    try {
      const { data: milkBoothData, error: milkBoothError } = await supabase
        .from("milk_booth")
        .select("center_number");

      if (milkBoothError) throw milkBoothError;

      // Extract center numbers
      const centerNumbers = milkBoothData.map((booth) => booth.center_number);
      return centerNumbers;
    } catch (error) {
      console.log("Error fetching center numbers:", error.message);
      Alert.alert(
        "Error fetching center numbers",
        "There was an error retrieving the center numbers. Please try again."
      );
      return [];
    }
  };

  const fetchReportData = async () => {
    try {
      const centerNumbers = await fetchCenterNumbers();

      if (centerNumbers.length === 0) {
        Alert.alert(
          "No centers available",
          "No centers were found to generate reports."
        );
        return;
      }

      const { data: milkSalesData, error: milkSalesError } = await supabase
        .from("center_milk_sales")
        .select("center_number, DATE, AM_PM, cash, credit, amount, litre")
        .in("center_number", centerNumbers)
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());

      if (milkSalesError) throw milkSalesError;

      let centers = new Set(centerNumbers);
      const report = {};
      const totalAmt = {};

      centers.forEach((center) => {
        report[center] = [];
        totalAmt[center] = { cash: 0, credit: 0, amount: 0, litre: 0 };
      });

      milkSalesData.forEach((sale) => {
        const center = sale.center_number;
        const formattedDate = new Date(sale.DATE)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })
          .replace(/\//g, "-");

        const formattedAMPM = sale.AM_PM.toUpperCase();

        report[center].push({
          date: `${formattedDate}-${formattedAMPM}`,
          cash: sale.cash,
          credit: sale.credit,
          amount: sale.amount,
          litre: sale.litre,
        });

        // Update totals
        totalAmt[center].cash += sale.cash || 0;
        totalAmt[center].credit += sale.credit || 0;
        totalAmt[center].amount += sale.amount || 0;
        totalAmt[center].litre += sale.litre || 0;
      });

      setCenterList([...centers]);
      setReportEntries(report);
      setTotalAmount(totalAmt);
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
        {centerList.map((center, index) => (
          <View key={index} style={styles.dataContainer}>
            <Text style={styles.centerTitle}>{`Center: ${center}`}</Text>
            <View style={styles.tableHeading}>
              <View style={styles.totalRow}>
                <Text style={styles.totalHeadingText}>
                  Total Cash: {totalAmount[center]?.cash?.toFixed(2) || 0}
                </Text>
                <Text style={styles.totalHeadingText}>
                  Total Amount: {totalAmount[center]?.amount?.toFixed(2) || 0}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalHeadingText}>
                  Total Credit: {totalAmount[center]?.credit?.toFixed(2) || 0}
                </Text>
                <Text style={styles.totalHeadingText}>
                  Total Litre: {totalAmount[center]?.litre?.toFixed(2) || 0}
                </Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Cash</Text>
              <Text style={styles.tableHeaderText}>Credit</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
              <Text style={styles.tableHeaderText}>Litre</Text>
            </View>

            {reportEntries[center] && reportEntries[center].length > 0 ? (
              reportEntries[center].map((entry, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{entry.date}</Text>
                  <Text style={styles.tableCell}>{entry.cash || "-"}</Text>
                  <Text style={styles.tableCell}>{entry.credit || "-"}</Text>
                  <Text style={styles.tableCell}>{entry.amount || "-"}</Text>
                  <Text style={styles.tableCell}>{entry.litre || "-"}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No report entries found for this center.
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
  dataContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    marginBottom: 10,
    padding: 10,
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeading: {
    backgroundColor: Colors.DarkBlue,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-evenly",
  },
  totalHeadingText: {
    color: "white",
    fontWeight: "bold",
    width: "48%",
    fontSize: 12,
    width: "50%",
    padding: 3,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.DarkBlue,
    padding: 5,
    borderRadius: 5,
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
});
