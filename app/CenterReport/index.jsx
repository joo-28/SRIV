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
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiff, setTotalDiff] = useState(0);
  const router = useRouter();

  const fetchReportData = async () => {
    try {
      const { data: centerShiftData, error: centerShiftError } = await supabase
        .from("center_shift_entry")
        .select("DATE, AM_PM, Total_litre, FAT, SNF, total_amt")
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());
      if (centerShiftError) throw centerShiftError;

      const { data: ccShiftData, error: ccShiftError } = await supabase
        .from("cc_shift_entry")
        .select("DATE, AM_PM, Total_litre")
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());
      if (ccShiftError) throw ccShiftError;

      let totalAmt = 0;
      let totalDiffSum = 0;

      const combinedData = centerShiftData.map((centerEntry) => {
        const ccEntry = ccShiftData.find(
          (cc) => cc.DATE === centerEntry.DATE && cc.AM_PM === centerEntry.AM_PM
        );
        const diff = (
          (ccEntry?.Total_litre || 0) - centerEntry.Total_litre
        ).toFixed(1);
        totalAmt += centerEntry.total_amt;
        totalDiffSum += parseFloat(diff);

        const formattedDate = new Date(centerEntry.DATE)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })
          .replace(/\//g, "-");
        const formattedAMPM = centerEntry.AM_PM.toUpperCase();

        return {
          date: `${formattedDate}-${formattedAMPM}`,
          AM_PM: centerEntry.AM_PM,
          Total_litre: centerEntry.Total_litre.toFixed(1),
          diff: diff,
          FAT: centerEntry.FAT.toFixed(2),
          SNF: centerEntry.SNF.toFixed(2),
          total_amount: centerEntry.total_amt.toFixed(1),
        };
      });

      setReportEntries(combinedData);
      setTotalAmount(totalAmt.toFixed(1));
      setTotalDiff(totalDiffSum.toFixed(1));
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

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Center Report</Text>
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
          <View style={styles.tableHeading}>
            <Text style={styles.tableHeadingText}>
              Total Amt: ₹{new Intl.NumberFormat("en-IN").format(totalAmount)}
            </Text>
            <Text style={styles.tableHeadingText}>Total Diff: {totalDiff}</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>SHIFT</Text>
            <Text style={styles.tableHeaderText}>CTL</Text>
            <Text style={styles.tableHeaderText}>Diff</Text>
            <Text style={styles.tableHeaderText}>FAT</Text>
            <Text style={styles.tableHeaderText}>SNF</Text>
            <Text style={styles.tableHeaderText}>CAMT</Text>
          </View>

          {reportEntries.length > 0 ? (
            reportEntries.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{entry.date}</Text>
                <Text style={styles.tableCell}>{entry.Total_litre}</Text>
                <Text style={styles.tableCell}>{entry.diff}</Text>
                <Text style={styles.tableCell}>{entry.FAT}</Text>
                <Text style={styles.tableCell}>{entry.SNF}</Text>
                <Text style={styles.tableCell}>
                  ₹{new Intl.NumberFormat("en-IN").format(entry.total_amount)}
                </Text>
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
    backgroundColor: Colors.Yellow,
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
  tableHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.DarkBlue,
    padding: 5,
  },
  tableHeadingText: {
    color: "white",
    fontWeight: "bold",
    width: "46%",
    textAlign: "center",
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
    width: "16%",
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
    width: "16%",
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
