import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import Colors from "../../Services/Colors";
import supabase from "../../Services/supabaseConfig";

export default function Customer() {
  const [inputValue, setInputValue] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const router = useRouter();

  const fetchCustomerDetails = async (customerNumber) => {
    try {
      const { data: customerData, error: customerError } = await supabase
        .from("customer")
        .select("customer_number, total_due_paid, balance_amount")
        .eq("customer_number", customerNumber)
        .single();

      if (customerError) throw customerError;

      const { data: ledgerData, error: ledgerError } = await supabase
        .from("ledger")
        .select("due_paid_date, transaction, amount")
        .eq("customer_number", customerNumber);

      if (ledgerError) throw ledgerError;

      setCustomerDetails(customerData);
      setLedgerEntries(ledgerData);
    } catch (error) {
      console.error("Error fetching customer details:", error.message);
    }
  };

  const handleSearch = () => {
    if (inputValue) {
      fetchCustomerDetails(inputValue);
    }
  };

  const handleNavigateToNewCustomer = () => {
    router.push("/AddNewCustomer");
    console.log(customerDetails);
  };

  const handleNavigateToEditCustomer = () => {
    router.push("/EditCustomer");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Customer Number"
        />
        <View style={styles.searchButton}>
          <Button
            color={Colors.Green}
            title="See Reports"
            onPress={handleSearch}
          />
        </View>
      </View>

      <View style={styles.dataContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Customer Number:</Text>
          <Text style={styles.headerText}>
            {customerDetails ? customerDetails.customer_number : ""}
          </Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Amount</Text>
            <Text style={styles.tableHeaderText}>Action</Text>
            <Text style={styles.tableHeaderText}>Total Paid</Text>
            <Text style={styles.tableHeaderText}>Balance</Text>
          </View>

          {ledgerEntries.length > 0 ? (
            ledgerEntries.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{entry.due_paid_date}</Text>
                <Text style={styles.tableCell}>{entry.amount}</Text>
                <Text style={styles.tableCell}>{entry.transaction}</Text>
                <Text style={styles.tableCell}>
                  {customerDetails.total_due_paid}
                </Text>
                <Text style={styles.tableCell}>
                  {customerDetails.balance_amount}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No ledger entries found.</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.editButton}>
          <Button
            color={Colors.DarkBlue}
            title="Edit Customer"
            onPress={handleNavigateToEditCustomer}
          />
        </View>
        <View style={styles.addButton}>
          <Button
            color={Colors.Green}
            title="Add New Customer"
            onPress={handleNavigateToNewCustomer}
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.Blue,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
  },
  headerText: {
    color: "white",
    fontSize: 18,
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
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  tableCell: {
    width: "20%",
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
  editButton: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    flex: 1,
  },
});
