import Colors from "../../Services/Colors";
import React, { useState } from "react";
import { useRouter } from "expo-router";

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

  const router = useRouter();

  const handleItemPress = (item) => {
    setInputValue(item);
    setFilteredItems([]);
  };
  const handleNavigateToNewCustomer = () => {
    router.push("/AddNewCustomer");
  };
  const handleNavigateToEditCustomer = () => {
    router.push("/EditCustomer");
  };
  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <TextInput
          style={styles.input}
          value={inputValue}
          placeholder="Customer Number"
        />

        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="See Reports" />
        </View>
        <View style={styles.dataDesign}>
          <View style={styles.headingDesign}>
            <Text style={styles.headerSize}>Customer Number : </Text>
            <Text style={styles.headerSize}>101</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.addCustomerButton}>
          <Button
            color={Colors.DarkBlue}
            title="Edit Customer"
            onPress={handleNavigateToEditCustomer}
          />
        </View>
        <View style={styles.editCustomer}>
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
  bg: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.Yellow,
  },
  formDesign: {
    top: 50,
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
    height: 530,
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

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: 10,
  },
  headerSize: {
    fontSize: 20,
    color: "white",
    marginLeft: 20,
  },
  buttonContainer: {
    top: 780,
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    gap: 45,
  },
});
