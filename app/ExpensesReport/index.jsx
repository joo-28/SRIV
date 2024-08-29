import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Services/Colors";

export default function ExpensesReport() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [summaryTotals, setSummaryTotals] = useState({});
  const { width } = useWindowDimensions();

  const onFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(Platform.OS === "ios");
    setFromDate(currentDate);
  };

  const onToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(Platform.OS === "ios");
    setToDate(currentDate);
  };

  const showFromDatePickerModal = () => {
    setShowFromDatePicker(true);
  };

  const showToDatePickerModal = () => {
    setShowToDatePicker(true);
  };

  const fetchExpenses = async () => {
    if (fromDate > toDate) {
      Alert.alert("Error", "From Date cannot be later than To Date");
      return;
    }

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("date", fromDate.toISOString().split("T")[0])
      .lte("date", toDate.toISOString().split("T")[0]);

    if (error) {
      Alert.alert("Error", "There was an error fetching the expenses.");
    } else {
      setExpenses(data);
      calculateSummary(data);
    }
  };

  const calculateSummary = (expenses) => {
    const categories = ["Can", "Vehicle", "Misc", "Rewards"];
    const summary = {};

    categories.forEach((category) => {
      const total = expenses
        .filter((expense) => expense.type === category)
        .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

      summary[category] = total.toFixed(2); // Ensure amount is formatted
    });

    setSummaryTotals(summary);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>Expenses Report</Text>

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>From Date</Text>
          <Button
            onPress={showFromDatePickerModal}
            title={fromDate.toDateString()}
          />
          {showFromDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fromDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onFromDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>To Date</Text>
          <Button
            onPress={showToDatePickerModal}
            title={toDate.toDateString()}
          />
          {showToDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={toDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onToDateChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title="Fetch Expenses"
            onPress={fetchExpenses}
          />
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryHeading}>Expense Summary</Text>
          <View style={styles.summaryTable}>
            {Object.entries(summaryTotals).map(([category, amount]) => (
              <View key={category} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{category}</Text>
                <Text style={styles.summaryAmount}>{amount}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.tableColumnDate]}>
              Date
            </Text>
            <Text style={[styles.tableHeaderText, styles.tableColumnType]}>
              Type
            </Text>
            <Text style={[styles.tableHeaderText, styles.tableColumnComment]}>
              Comment
            </Text>
            <Text style={[styles.tableHeaderText, styles.tableColumnAmount]}>
              Amount
            </Text>
          </View>

          {expenses.length === 0 ? (
            <Text style={styles.noDataText}>
              No data found for the selected dates.
            </Text>
          ) : (
            expenses.map((expense) => (
              <View key={expense.id} style={styles.tableRow}>
                <Text style={[styles.tableText, styles.tableColumnDate]}>
                  {expense.date}
                </Text>
                <Text style={[styles.tableText, styles.tableColumnType]}>
                  {expense.type}
                </Text>
                <Text style={[styles.tableText, styles.tableColumnComment]}>
                  {expense.comment}
                </Text>
                <Text style={[styles.tableText, styles.tableColumnAmount]}>
                  {(parseFloat(expense.amount) || 0).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.outsideButtonsContainer}>
        <View style={styles.outsideButton}>
          <Button
            style={styles.outsideButton}
            color={Colors.Blue}
            title="Go Back"
            onPress={() => {
              router.back();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.Yellow,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  formDesign: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
  },
  tableHeaderText: {
    fontWeight: "bold",
  },
  tableColumnDate: {
    width: "25%",
  },
  tableColumnType: {
    width: "20%",
  },
  tableColumnComment: {
    width: "35%",
  },
  tableColumnAmount: {
    width: "20%",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  tableText: {
    fontSize: 14,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  summaryContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryTable: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  outsideButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  outsideButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  datePicker: {
    width: "100%",
    height: 120,
  },
});
