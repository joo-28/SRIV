import React, { useEffect, useState } from "react";
import service from "../../Services/service";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Platform,
} from "react-native";

import Colors from "../../Services/Colors";

import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
export default function index() {
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const username = await service.getUserData();
      if (!username) {
        router.replace("/Login");
      } else {
      }
    };
    checkLoginStatus();
  }, []);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("option1");
  const handleLogout = async () => {
    await service.clearUserData();
    router.push("/Login");
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <TextInput style={styles.input} placeholder="Customer Number" />
        <TextInput style={styles.input} placeholder="Customer Name" />

        <TextInput style={styles.input} placeholder="Amount" />

        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="option1"
              status={selectedValue === "option1" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("option1")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Debit</Text>
          </View>

          <View style={styles.radioButton}>
            <RadioButton
              value="option2"
              status={selectedValue === "option2" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("option2")}
              color="#007BFF"
            />
            <Text style={styles.radioLabel}>Credit</Text>
          </View>
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
        </View>
        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="Add" onPress={handleLogout} />
        </View>
      </View>
      <Text style={styles.heading}>Reports</Text>
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
    top: 40,
    left: 28,
    width: 360,
    height: 300,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    justifyContent: "center",
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
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  searchButton: {
    width: 100,
    color: Colors.Green,
    left: 110,
  },
  logOutButton: {
    width: 100,
    color: Colors.Green,
    left: 150,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  datePicker: {
    width: "100%",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 40,
    position: "relative",
    left: 130,
    top: 340,
  },
});
