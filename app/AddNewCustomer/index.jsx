import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddNewCustomer() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  const router = useRouter();

  const goBack = () => {
    router.back();
  };
  const handleSaveData = () => {
    console.log("saved");
  };
  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Add New Customer</Text>
        <TextInput style={styles.input} placeholder="Customer Name" />
        <TextInput style={styles.input} placeholder="Contact Number" />
        <TextInput style={styles.input} placeholder="Amount" />
        <View style={styles.container}>
          <Button onPress={showDatePicker} title={date.toDateString()} />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              style={styles.datePicker}
            />
          )}
        </View>
        <View style={styles.SaveButton}>
          <Button color={Colors.Green} title="Save" onPress={handleSaveData} />
        </View>
        <View style={styles.GobackButton}>
          <Button title="Go Back" onPress={goBack} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.Yellow,
  },
  formDesign: {
    top: 50,
    left: 28,
    width: 360,
    height: 780,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  heading: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 25,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  SaveButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 15,
  },
  GobackButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 15,
  },
});
