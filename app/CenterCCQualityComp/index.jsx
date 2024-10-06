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
  const [totals, setTotals] = useState({
    CFAT: 0,
    CCFAT: 0,
    CSNF: 0,
    CCSNF: 0,
  });
  const router = useRouter();

  const fetchReportData = async () => {
    try {
      const { data: centerShiftData, error: centerShiftError } = await supabase
        .from("center_shift_entry")
        .select("DATE, AM_PM, FAT, SNF, Total_litre")
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());
      if (centerShiftError) throw centerShiftError;

      const { data: ccShiftData, error: ccShiftError } = await supabase
        .from("cc_shift_entry")
        .select("DATE, AM_PM, FAT, SNF, Total_litre")
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());
      if (ccShiftError) throw ccShiftError;

      // Sort both datasets by DATE and AM_PM
      centerShiftData.sort((a, b) => {
        return (
          new Date(a.DATE) - new Date(b.DATE) || a.AM_PM.localeCompare(b.AM_PM)
        );
      });

      ccShiftData.sort((a, b) => {
        return (
          new Date(a.DATE) - new Date(b.DATE) || a.AM_PM.localeCompare(b.AM_PM)
        );
      });

      let totalCFAT = 0,
        totalCCFAT = 0,
        totalCSNF = 0,
        totalCCSNF = 0,
        totalCenterLitre = 0,
        totalCCLitre = 0;

      const combinedData = centerShiftData.map((centerEntry) => {
        const ccEntry = ccShiftData.find(
          (cc) => cc.DATE === centerEntry.DATE && cc.AM_PM === centerEntry.AM_PM
        );

        const formattedDate = new Date(centerEntry.DATE)
          .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
          .replace(/\//g, "-");
        const formattedAMPM = centerEntry.AM_PM.toUpperCase();

        const CFAT = centerEntry.FAT !== null ? centerEntry.FAT : 0;
        const CCFAT = ccEntry && ccEntry.FAT !== null ? ccEntry.FAT : 0;
        const CSNF = centerEntry.SNF !== null ? centerEntry.SNF : 0;
        const CCSNF = ccEntry && ccEntry.SNF !== null ? ccEntry.SNF : 0;
        const centerLitre = centerEntry.Total_litre || 0;
        const ccLitre = ccEntry?.Total_litre || 0;

        totalCFAT += centerLitre * CFAT;
        totalCCFAT += ccLitre * CCFAT;
        totalCSNF += centerLitre * CSNF;
        totalCCSNF += ccLitre * CCSNF;

        totalCenterLitre += centerLitre;
        totalCCLitre += ccLitre;

        return {
          date: `${formattedDate}-${formattedAMPM}`,
          CFAT: CFAT.toFixed(2),
          CSNF: CSNF.toFixed(2),
          CCFAT: CCFAT.toFixed(2),
          CCSNF: CCSNF.toFixed(2),
        };
      });

      const avgCFAT =
        totalCenterLitre > 0
          ? (totalCFAT / totalCenterLitre).toFixed(2)
          : "0.00";
      const avgCCFAT =
        totalCCLitre > 0 ? (totalCCFAT / totalCCLitre).toFixed(2) : "0.00";
      const avgCSNF =
        totalCenterLitre > 0
          ? (totalCSNF / totalCenterLitre).toFixed(2)
          : "0.00";
      const avgCCSNF =
        totalCCLitre > 0 ? (totalCCSNF / totalCCLitre).toFixed(2) : "0.00";

      setTotals({
        CFAT: avgCFAT,
        CCFAT: avgCCFAT,
        CSNF: avgCSNF,
        CCSNF: avgCCSNF,
      });
      setReportEntries(combinedData);
    } catch (error) {
      Alert.alert(
        "Error fetching report data",
        "There was an error retrieving the report data. Please try again."
      );
    }
  };

  const handleSearch = () => fetchReportData();
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
        <Text style={styles.heading}>Center CC Quality Comparison</Text>
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
                maximumDate={new Date()}
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
          <View style={styles.tableFooter}>
            <Text style={styles.footerCell}>TOTAL</Text>
            <Text style={styles.footerCell}>{totals.CFAT}</Text>
            <Text style={styles.footerCell}>{totals.CCFAT}</Text>
            <Text style={styles.footerCell}>{totals.CSNF}</Text>
            <Text style={styles.footerCell}>{totals.CCSNF}</Text>
          </View>
          <View style={styles.tableFooter}>
            <Text style={styles.footerCell}>DIFF</Text>
            <Text style={styles.footerCell}>
              {(totals.CCFAT - totals.CFAT).toFixed(2)}
            </Text>
            <Text style={styles.footerCell}>
              {(totals.CCSNF - totals.CSNF).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>SHIFT</Text>
            <Text style={styles.tableHeaderText}>CFAT</Text>
            <Text style={styles.tableHeaderText}>CCFAT</Text>
            <Text style={styles.tableHeaderText}>CSNF</Text>
            <Text style={styles.tableHeaderText}>CCSNF</Text>
          </View>
          {reportEntries.length > 0 ? (
            reportEntries.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{entry.date}</Text>
                <Text style={styles.tableCell}>{entry.CFAT}</Text>
                <Text style={styles.tableCell}>{entry.CCFAT}</Text>
                <Text style={styles.tableCell}>{entry.CSNF}</Text>
                <Text style={styles.tableCell}>{entry.CCSNF}</Text>
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
  label: { fontSize: 16, paddingTop: 8, marginBottom: 5, width: "25%" },
  datePickerContainer: { marginBottom: 10, width: "70%" },
  searchButton: { alignItems: "center" },
  dataContainer: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    elevation: 5,
    flex: 1,
  },
  userField: { flexDirection: "row" },
  scrollView: { flex: 1 },
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
    padding: 3,
    paddingVertical: 8,
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
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    backgroundColor: Colors.LightBlue,
  },
  footerCell: {
    width: "20%",
    textAlign: "center",
    fontWeight: "bold",
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
