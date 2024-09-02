import React, { useState, useEffect } from "react";
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
  const [companyList, setCompanyList] = useState([]);
  const [overallTotalLitres, setOverallTotalLitres] = useState(0);
  const router = useRouter();

  const fetchCompanyData = async () => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from("external_company_sales")
        .select("company_")
        .distinct();
      if (companyError) throw companyError;

      return companyData;
    } catch (error) {
      Alert.alert(
        "Error fetching company data",
        "There was an error retrieving the company data. Please try again."
      );
      return [];
    }
  };

  const fetchReportDataForCompany = async (companyNumber) => {
    try {
      const { data: salesReportData, error: salesReportError } = await supabase
        .from("external_company_sales_report")
        .select("DATE, AM_PM, FAT, SNF, total_litre,company_name")
        .eq("company_number", companyNumber)
        .gte("DATE", fromDate.toISOString())
        .lte("DATE", toDate.toISOString());
      if (salesReportError) throw salesReportError;

      return salesReportData;
    } catch (error) {
      Alert.alert(
        "Error fetching report data",
        "There was an error retrieving the report data. Please try again."
      );
      return [];
    }
  };

  const fetchAllReportData = async () => {
    try {
      const companyData = await fetchCompanyData();
      if (companyData.length === 0) {
        Alert.alert(
          "No companies available",
          "No companies were found to generate reports."
        );
        return;
      }

      const report = {};
      const totalLitre = {};
      let totalOverallLitres = 0;

      for (const { company_number } of companyData) {
        const salesReportData = await fetchReportDataForCompany(company_number);

        report[company_number] = salesReportData.map((sale) => {
          const formattedDate = new Date(sale.DATE)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
            })
            .replace(/\//g, "-");
          const formattedAMPM = sale.AM_PM.toUpperCase();

          return {
            date: `${formattedDate}-${formattedAMPM}`,
            FAT: sale.FAT,
            SNF: sale.SNF,
            total_litre: sale.total_litre,
          };
        });

        totalLitre[company_name] = salesReportData.reduce(
          (acc, sale) => acc + (sale.total_litre || 0),
          0
        );

        totalOverallLitres += totalLitre[company_name];
      }

      const companies = companyData.map((c) => c.company_name);

      setCompanyList(companies);
      setReportEntries(report);
      setTotalLitres(totalLitre);
      setOverallTotalLitres(totalOverallLitres.toFixed(1));
    } catch (error) {
      Alert.alert(
        "Error fetching all report data",
        "There was an error retrieving the report data for all companies. Please try again."
      );
    }
  };

  const handleSearch = () => {
    fetchAllReportData();
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
            <Text style={styles.tableHeaderText}>Overall TL</Text>
            <Text style={styles.tableHeaderText}>{overallTotalLitres}</Text>
          </View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Company Name</Text>
            <Text style={styles.tableHeaderText}>Total Litre</Text>
          </View>
          {companyList.length > 0 ? (
            companyList.map((company, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{company}</Text>
                <Text style={styles.tableCell}>
                  {totalLitres[company]?.toFixed(1) || 0}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No data available.</Text>
          )}
        </View>

        {companyList.map((company, index) => (
          <View key={index} style={styles.dataContainer}>
            <Text style={styles.centerTitle}>{`Company: ${company}`}</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>FAT</Text>
              <Text style={styles.tableHeaderText}>SNF</Text>
              <Text style={styles.tableHeaderText}>Total Litre</Text>
            </View>
            {reportEntries[company] && reportEntries[company].length > 0 ? (
              reportEntries[company].map((entry, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{entry.date}</Text>
                  <Text style={styles.tableCell}>
                    {entry.FAT?.toFixed(1) || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.SNF?.toFixed(1) || "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {entry.total_litre?.toFixed(1) || "-"}
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
  centerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
});
