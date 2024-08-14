import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";
import service from "../../Services/service";
export default function index() {
  const router = useRouter();
  const handleLogout = async () => {
    await service.clearUserData();
    router.push("/Login");
  };
  return (
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          // value={userId}
          // onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Customer Number"
          // value={userId}
          // onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          // value={userId}
          // onChangeText={setUserId}
        />
        <View style={styles.searchButton}>
          <Button color={Colors.Green} title="Logout" onPress={handleLogout} />
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
    top: 20,
    left: 28,
    width: 360,
    height: 350,
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
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchButton: {
    width: 100,
    color: Colors.Green,
  },
  dateButton: {
    width: 100,
    color: Colors.Green,
    left: 228,
  },
});
