import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Colors from "../../Services/Colors";

export default function EditCustomer() {
  const router = useRouter();
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
  const goBack = () => {
    router.back();
  };
  const handleSaveData = () => {
    console.log("saved");
  };
  const handleDeleteData = () => {
    console.log("saved");
  };
  const handleSelectUser = () => {
    console.log("saved");
  };
  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Edit Customer Details</Text>
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
        <View style={styles.SelectButton}>
          <Button
            color={Colors.Green}
            title="Select"
            onPress={handleSelectUser}
          />
        </View>
        <TextInput style={styles.input} placeholder="Contact Number" />
        <TextInput style={styles.input} placeholder="Amount" />
        <View style={styles.SaveButton}>
          <Button color={Colors.Green} title="Save" onPress={handleSaveData} />
        </View>
        <View style={styles.DeleteButton}>
          <Button color={"red"} title="Delete" onPress={handleDeleteData} />
        </View>
        <View style={styles.GoBackButton}>
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
  DeleteButton: {
    marginBottom: 15,
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 30,
  },
  SelectButton: {
    width: 150,
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 30,
  },
  GoBackButton: {
    width: 150,
    bottom: 0,
    position: "absolute",
    color: Colors.Green,
    alignSelf: "center",
    marginBottom: 30,
  },
});
