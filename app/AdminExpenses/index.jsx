import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
  Alert,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import Colors from "../../Services/Colors";
import { Picker } from "@react-native-picker/picker";

export default function ExpenseEntry() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [type, setType] = useState("Can");
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const { width } = useWindowDimensions();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  async function handleSaveData() {
    if (amount === "" || comment === "" || type === "") {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    const { data, error } = await supabase.from("expenses").insert([
      {
        date: date.toISOString().split("T")[0],
        type: type,
        comment: comment,
        amount: parseFloat(amount),
      },
    ]);
    if (error) {
      Alert.alert("Error", "There was an error saving your data.");
    } else {
      Alert.alert("Success", "Data saved successfully");
      setComment("");
      setAmount("");
      setType("Can");
    }
  }
  const handleExpensesReport = () => {
    router.push("/ExpensesReport");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.formDesign, { width: width * 0.9 }]}>
        <Text style={styles.heading}>Expense Entry</Text>

        <View style={styles.datePickerContainer}>
          <Button onPress={showDatePicker} title={date.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          )}
        </View>

        <Text style={styles.radioLabel}>Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Can" value="Can" />
            <Picker.Item label="Vehicle" value="Vehicle" />
            <Picker.Item label="Misc" value="Misc" />
            <Picker.Item label="Rewards" value="Rewards" />
          </Picker>
        </View>

        <Text style={styles.radioLabel}>Comment</Text>
        <TextInput
          style={styles.input}
          placeholder="Comment"
          value={comment}
          onChangeText={setComment}
        />

        <Text style={styles.radioLabel}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title="Save"
              onPress={handleSaveData}
            />
          </View>
        </View>
      </View>

      <View style={styles.outsideButtonsContainer}>
        <View style={styles.outsideButton}>
          <Button
            style={styles.outsideButton}
            color={Colors.Blue}
            title="Expenses Report"
            onPress={handleExpensesReport}
          />
        </View>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
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
