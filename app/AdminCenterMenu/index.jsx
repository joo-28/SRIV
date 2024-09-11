import { View, StyleSheet, Button, Text, ScrollView } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";

export default function CenterStaffMenu() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Menu</Text>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title="Switch Finance APP"
            onPress={() => router.push("(tabs)")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Report"
            onPress={() => router.push("/CenterReport")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Sales Report"
            onPress={() => router.push("/CenterSalesReport")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Fixed Customer Report"
            onPress={() => router.push("/AllFixedRateCusomers")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="External Sales Report"
            onPress={() => router.push("/ExCompanySalesReport")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="External Sales Quality"
            onPress={() => router.push("/ExCompanySalesQuality")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Shift Check"
            onPress={() => router.push("/AdminCenterMilkCheck")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center CC Quality Comparison"
            onPress={() => router.push("/CenterCCQualityComp")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Fixed Rate Customer Shift Entry"
            onPress={() => router.push("/FixedRateCustomer")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Center Sales"
            onPress={() => router.push("/EditCenterMilk")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Add Fixed Rate Customer"
            onPress={() => router.push("/AddFixedRateCustomer")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Add External Company"
            onPress={() => router.push("/AddExternalCompanySales")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Set Milk Rate"
            onPress={() => router.push("/SetMilkRate")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Create Center"
            onPress={() => router.push("/CreateCenter")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Average Calculator"
            onPress={() => router.push("/AverageCalculator")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Expenses"
            onPress={() => router.push("/AdminExpenses")}
          />
        </View>
        <View style={styles.goBackButton}>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            color={Colors.Blue}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.bg,
  },
  form: {
    width: "90%",
    backgroundColor: Colors.Yellow,
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
    marginVertical: 5,
  },
  heading: {
    fontSize: 26,
    alignSelf: "center",
    marginBottom: 20,
  },
  goBackButton: {
    width: "60%",
    marginTop: 10,
  },
});
