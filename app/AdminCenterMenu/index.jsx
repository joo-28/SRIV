import { View, StyleSheet, Button, Text, Alert } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";

export default function CenterStaffMenu() {
  const router = useRouter();

  const handleSwitchFinanceApp = () => {
    router.push("(tabs)");
  };

  const handleCenterSales = () => {
    router.push("/CenterSales");
  };

  const handleCenterSalesReport = () => {
    router.push("/CenterSalesReport");
  };

  const handleCenterReport = () => {
    router.push("/CenterReport");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Menu</Text>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title="Switch Finance APP"
            onPress={handleSwitchFinanceApp}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Sales"
            onPress={handleCenterSales}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Sales Report"
            onPress={handleCenterSalesReport}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Report"
            onPress={handleCenterReport}
          />
        </View>
        <View style={styles.goBackButton}>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            color={Colors.DarkBlue}
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
