import Colors from "../../Services/Colors";
import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

export default function Customer() {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const items = [
    "Apple",
    "Banana",
    "Orange",
    "Grapes",
    "Watermelon",
    "Pineapple",
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
          placeholder="Customer Name"
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

        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="See Reports" />
        </View>
        <View style={styles.dataDesign}>
          <View style={styles.headingDesign}>
            <Text style={styles.headerSize}>CustomerID</Text>
            <Text style={styles.headerSize}>Customer Name</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.addCustomerButton}>
          <Button color={Colors.DarkBlue} title="Edit Customer" />
        </View>
        <View style={styles.editCustomer}>
          <Button color={Colors.Green} title="Add New Customer" />
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
    top: 40,
    left: 28,
    width: 360,
    height: 150,
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
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  searchButton: {
    width: 150,
    color: Colors.Green,
    left: 85,
    paddingTop: 10,
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
  dataDesign: {
    top: 170,
    width: 360,
    height: 510,
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
    height: 40,
    minWidth: 320,
    backgroundColor: Colors.Blue,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    justifyContent: "space-around",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: 5,
  },
  headerSize: {
    fontSize: 20,
  },
  buttonContainer: {
    top: 750,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    gap: 45,
  },
});
