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

export default function ExternalCompanyReport() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [reportEntries, setReportEntries] = useState({});
  const [totalLitres, setTotalLitres] = useState({});
  const [totalCCAccurateLitres, setTotalCCAccurateLitres] = useState({});
  const [totalAmount, setTotalAmount] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [totalDiff, setTotalDiff] = useState({});
  const router = useRouter();

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("external_company_sales")
        .select("company_name");

      if (error) {
        throw error;
      }

      const companies = data.map((row) => row.company_name);
      setCompanyList(companies);

      fetchReportDetails(companies);
    } catch (error) {
      Alert.alert("Error fetching companies", error.message);
    }
  };

  const fetchReportDetails = async (companies) => {
    try {
      const entries = {};
      const litres = {};
      const ccLitres = {};
      const amounts = {};
      const diffs = {};

      for (const company of companies) {
        const { data, error } = await supabase
          .from("external_company_sales_report")
          .select(
            "DATE, AM_PM, center_accurate_litre, cc_accurate_litre, total_amount, litre_rate"
          )
          .eq("company_name", company)
          .gte("DATE", fromDate.toISOString().split("T")[0])
          .lte("DATE", toDate.toISOString().split("T")[0]);

        if (error) {
          throw error;
        }

        const formattedData = data.map((entry) => {
          const date = new Date(entry.DATE);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const shift = `${day}-${month}-${entry.AM_PM}`;
          return { ...entry, Shift: shift, date };
        });

        formattedData.sort((a, b) => {
          const dateComparison = a.date - b.date;
          if (dateComparison !== 0) return dateComparison;
          return a.AM_PM === "AM" ? -1 : 1;
        });

        entries[company] = formattedData;

        const total = formattedData.reduce(
          (acc, entry) => acc + (entry.center_accurate_litre || 0),
          0
        );
        litres[company] = total;

        const totalCC = formattedData.reduce(
          (acc, entry) => acc + (entry.cc_accurate_litre || 0),
          0
        );
        ccLitres[company] = totalCC;

        const totalAmt = formattedData.reduce(
          (acc, entry) => acc + (entry.total_amount || 0),
          0
        );
        amounts[company] = totalAmt;

        const totalDiff = formattedData.reduce(
          (acc, entry) =>
            acc +
            ((entry.cc_accurate_litre || 0) -
              (entry.center_accurate_litre || 0)),
          0
        );
        diffs[company] = totalDiff;
      }

      setReportEntries(entries);
      setTotalLitres(litres);
      setTotalCCAccurateLitres(ccLitres);
      setTotalAmount(amounts);
      setTotalDiff(diffs);
    } catch (error) {
      Alert.alert("Error fetching report details", error.message);
    }
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

  const handleSearch = () => {
    fetchCompanies();
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>External Company Sales Report</Text>
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryTableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.summaryHeaderText}>Name</Text>
            <Text style={styles.summaryHeaderText}>C.A.Litre</Text>
            <Text style={styles.summaryHeaderText}>CC.A.Litre</Text>
            <Text style={styles.summaryHeaderText}>T.Diff</Text>
            <Text style={styles.summaryHeaderText}>T.Amt</Text>
          </View>
          {companyList.length > 0 ? (
            companyList.map((company, index) => (
              <View key={index} style={styles.summarytableRow}>
                <Text style={styles.tableCell}>{company}</Text>
                <Text style={styles.tableCell}>
                  {totalLitres[company]?.toFixed(1) || 0}
                </Text>
                <Text style={styles.tableCell}>
                  {totalCCAccurateLitres[company]?.toFixed(1) || 0}
                </Text>
                <Text style={styles.tableCell}>
                  {totalDiff[company]?.toFixed(1) || 0}
                </Text>
                <Text style={styles.tableCell}>
                  ₹
                  {new Intl.NumberFormat("en-IN").format(
                    totalAmount[company]?.toFixed(1) || 0
                  )}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No data available.</Text>
          )}
        </View>

        {companyList.map((company, index) => (
          <View key={index} style={styles.dataContainer}>
            <View style={styles.dataHeader}>
              <Text style={styles.centerTitle}>{`Company: ${company}`}</Text>
              <Text style={styles.totalLitresHeader}>
                Center Accurate Litres: {totalLitres[company]?.toFixed(1) || 0}
              </Text>
              <Text style={styles.totalLitresHeader}>
                CC Accurate Litres:{" "}
                {totalCCAccurateLitres[company]?.toFixed(1) || 0}
              </Text>
              <Text style={styles.totalLitresHeader}>
                Total Diff: {totalDiff[company]?.toFixed(1) || 0}
              </Text>
              <Text style={styles.totalLitresHeader}>
                Total Amount: ₹
                {new Intl.NumberFormat("en-IN").format(
                  totalAmount[company]?.toFixed(1) || 0
                )}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Shift</Text>
              <Text style={styles.tableHeaderText}>C.A.Ltr</Text>
              <Text style={styles.tableHeaderText}>CC.A.Ltr</Text>
              <Text style={styles.tableHeaderText}>Diff</Text>
              <Text style={styles.tableHeaderText}>L.Rate</Text>
              <Text style={styles.tableHeaderText}>T.Amt</Text>
            </View>
            {reportEntries[company] && reportEntries[company].length > 0 ? (
              reportEntries[company].map((entry, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{entry.Shift}</Text>
                  <Text style={styles.tableCell}>
                    {entry.center_accurate_litre?.toFixed(1) || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.cc_accurate_litre?.toFixed(1) || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.cc_accurate_litre && entry.center_accurate_litre
                      ? (
                          entry.cc_accurate_litre - entry.center_accurate_litre
                        ).toFixed(1)
                      : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.litre_rate?.toFixed(2) || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.total_amount != null
                      ? `₹${new Intl.NumberFormat("en-IN").format(
                          entry.total_amount.toFixed(1)
                        )}`
                      : "-"}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No report entries found for this company.
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
  userField: {
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  dataContainer: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 10,
    padding: 10,
  },
  dataHeader: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalLitresHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.DarkBlue,
    padding: 5,
  },
  summarytableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.DarkBlue,
  },
  summaryHeaderText: {
    color: "white",
    fontWeight: "bold",
    width: "20%",
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 4,
    flexShrink: 1,
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
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  summarytableRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  tableCell: {
    width: "16%",
    textAlign: "center",
    fontSize: 10,
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
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
});
