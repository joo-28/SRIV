//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import { View, StyleSheet, Button, Text, Alert } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";
import service from "../../Services/service";
export default function CenterStaffMenu() {
  const router = useRouter();
  const handleLogout = async () => {
    await service.clearUserData();
    Alert.alert("Logout", "You have been logged out.");
    router.push("/Login");
  };
  const handleCenterReport = () => {
    router.push("/CenterReport");
  };
  const handleFixedRateCustomer = () => {
    router.push("/FixedRateCustomer");
  };
  const handleCalculator = () => {
    router.push("/Calculator");
  };
  const handleExpenses = () => {
    router.push("/Expenses");
  };
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Menu</Text>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title="Calculator"
            onPress={handleCalculator}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Fixed Rate Customer"
            onPress={handleFixedRateCustomer}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Report"
            onPress={handleCenterReport}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Expenses"
            onPress={handleExpenses}
          />
        </View>
        <View style={styles.goBackButton}>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            color={Colors.DarkBlue}
          />
        </View>

        <View style={styles.logoutButtonContainer}>
          <Button color={Colors.Red} title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 10,
  },
  logoutButtonContainer: {
    width: "60%",
    marginTop: 20,
  },
  heading: {
    fontSize: 26,
    alignSelf: "center",
  },
  goBackButton: {
    width: "60%",
    marginTop: 20,
  },
});
