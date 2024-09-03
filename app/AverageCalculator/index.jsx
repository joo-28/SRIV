import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../Services/Colors";

export default function AverageCalculator() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [values, setValues] = useState(
    Array(5).fill({ litre: "", fat: "", snf: "" })
  );

  const handleInputChange = (index, field, text) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: text };
    setValues(newValues);
  };

  const calculateTotalLitre = () => {
    const totalLitre = values.reduce(
      (sum, row) => sum + parseFloat(row.litre || 0),
      0
    );
    return totalLitre.toFixed(1);
  };

  const calculateAverageFAT = () => {
    const totalLitre = calculateTotalLitre();
    const totalFAT = values.reduce(
      (sum, row) => sum + parseFloat(row.litre || 0) * parseFloat(row.fat || 0),
      0
    );
    return totalLitre ? (totalFAT / totalLitre).toFixed(2) : "0.00";
  };

  const calculateAverageSNF = () => {
    const totalLitre = calculateTotalLitre();
    const totalSNF = values.reduce(
      (sum, row) => sum + parseFloat(row.litre || 0) * parseFloat(row.snf || 0),
      0
    );
    return totalLitre ? (totalSNF / totalLitre).toFixed(2) : "0.00";
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={[styles.formDesign, { width: width * 0.9 }]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Litre</Text>
            <Text style={styles.headerText}>FAT</Text>
            <Text style={styles.headerText}>SNF</Text>
          </View>

          {values.map((row, index) => (
            <View key={index} style={styles.row}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`Litre ${index + 1}`}
                value={row.litre}
                onChangeText={(text) => handleInputChange(index, "litre", text)}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`FAT ${index + 1}`}
                value={row.fat}
                onChangeText={(text) => handleInputChange(index, "fat", text)}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={`SNF ${index + 1}`}
                value={row.snf}
                onChangeText={(text) => handleInputChange(index, "snf", text)}
              />
            </View>
          ))}

          <View style={styles.resultRow}>
            <Text style={styles.resultText}>
              Total Litre: {calculateTotalLitre()}
            </Text>
            <Text style={styles.resultText}>
              Avg FAT: {calculateAverageFAT()}
            </Text>
            <Text style={styles.resultText}>
              Avg SNF: {calculateAverageSNF()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.goBackButtom}>
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
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 18,
  },
  resultRow: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    marginVertical: 5,
  },
  goBackButtom: {
    width: "50%",
    paddingBottom: 40,
  },
});
