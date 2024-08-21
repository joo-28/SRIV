import React, { useEffect, useState } from "react";
import service from "../../Services/service";
import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const items = [
    "Arun Kumar",
    "Meena Rani",
    "Rajesh Kannan",
    "Priya Lakshmi",
    "Vijay Anand",
    "Divya Bharathi",
    "Karthik Raja",
    "Anitha Devi",
    "Suresh Babu",
    "Lakshmi Narayanan",
    "Muthu Kumaran",
    "Saranya Devi",
    "Ganesh Kumar",
    "Deepa Lakshmi",
    "Ramesh Babu",
    "Bala Murugan",
    "Vijaya Kumar",
    "Uma Maheswari",
    "Sundar Raman",
    "Gayathri Devi",
  ];
  const handleInputChange = (text) => {
    setInputValue(text);

    if (text) {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleItemPress = (item) => {
    setInputValue(item);
    setFilteredItems([]);
  };
  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="Customer Number"
        />
        {filteredItems.length > 0 && (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemPress(item)}>
                <Text style={styles.item}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        )}

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
          <Button color={Colors.Green} title="Add" />
        </View>
      </View>

      <View style={styles.dataDesign}>
        <View style={styles.headingDesign}>
          <Text style={styles.headerSize}>Customer Number : </Text>
          <Text style={styles.headerSize}>101</Text>
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
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  list: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    zIndex: 1000,
    maxHeight: 200,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
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

  dataDesign: {
    top: 380,
    left: 28,
    width: 360,
    height: 430,
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
  headingDesign: {
    top: 0,
    width: 360,
    flexDirection: "row",
    height: 50,
    minWidth: 320,
    backgroundColor: Colors.Blue,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerSize: {
    fontSize: 20,
    color: "white",
    marginLeft: 20,
  },
});
