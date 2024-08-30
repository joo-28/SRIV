//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../Services/Colors";

export default function TenInputSum() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [values, setValues] = useState(Array(10).fill(""));
  const calculateTotal = () => {
    return values.reduce((sum, value) => sum + parseFloat(value || 0), 0);
  };
  const handleInputChange = (index, text) => {
    const newValues = [...values];
    newValues[index] = text;
    setValues(newValues);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={[styles.formDesign, { width: width * 0.9 }]}>
          <Text style={styles.totalText}>Total: {calculateTotal()}</Text>
          {values.map((value, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              placeholder={`Enter value ${index + 1}`}
              value={value}
              onChangeText={(text) => handleInputChange(index, text)}
            />
          ))}
        </View>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  formDesign: {
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
    marginTop: 40,
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 18,
  },
});
