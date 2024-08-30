//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import Colors from "../../Services/Colors";

export default function UpdateMilkRate() {
  const [centers, setCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [milkRate, setMilkRate] = useState("");
  const [newMilkRate, setNewMilkRate] = useState("");
  const router = useRouter();
  const { width } = useWindowDimensions();
  useEffect(() => {
    if (selectedCenter) {
      fetchMilkRate();
    }
  }, [selectedCenter]);
  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from("milk_booth")
        .select("center_number");
      if (error) {
        throw error;
      }
      setCenters(data);
      setShowModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch center numbers");
    }
  };
  const fetchMilkRate = async () => {
    try {
      const { data: milkBoothData, error: milkBoothError } = await supabase
        .from("milk_booth")
        .select("milk_rate")
        .eq("center_number", selectedCenter.center_number)
        .single();
      if (milkBoothError) {
        throw milkBoothError;
      }
      setMilkRate(milkBoothData.milk_rate.toString());
    } catch (error) {
      Alert.alert("Error", "Failed to fetch the milk rate");
    }
  };
  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setShowModal(false);
  };
  const handleSaveMilkRate = async () => {
    if (!selectedCenter) {
      Alert.alert("Error", "Please select a center");
      return;
    }
    try {
      const { error } = await supabase
        .from("milk_booth")
        .update({ milk_rate: parseFloat(newMilkRate) })
        .eq("center_number", selectedCenter.center_number);
      if (error) {
        throw error;
      }
      Alert.alert("Success", "Milk rate updated successfully");
      setMilkRate(newMilkRate);
      setNewMilkRate("");
    } catch (error) {
      Alert.alert("Error", "Failed to update the milk rate");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={
            selectedCenter
              ? `Center ${selectedCenter.center_number}`
              : "Select Center"
          }
          color={Colors.Green}
          onPress={fetchCenters}
        />
      </View>

      <Modal
        transparent={true}
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Center Number</Text>
            <FlatList
              data={centers}
              keyExtractor={(item) => item.center_number.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.centerItem}
                  onPress={() => handleCenterSelect(item)}
                >
                  <Text style={styles.centerText}>{item.center_number}</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              title="Close"
              color={Colors.DarkBlue}
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </Modal>

      {selectedCenter && (
        <View style={[styles.formDesign, { width: width * 0.9 }]}>
          <Text style={styles.heading}>
            Center {selectedCenter.center_number} Milk Rate
          </Text>
          <Text style={styles.label}>Current Milk Rate: {milkRate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter New Milk Rate"
            value={newMilkRate}
            onChangeText={setNewMilkRate}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Button
              color={Colors.Green}
              title="Save"
              onPress={handleSaveMilkRate}
            />
          </View>
        </View>
      )}

      <View style={styles.goBackButton}>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          color={Colors.DarkBlue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: 20,
    padding: 20,
    justifyContent: "center",
  },
  buttonContainer: {
    alignItems: "center",
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  centerItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: Colors.LightGray,
    width: "100%",
    alignItems: "center",
  },
  centerText: {
    fontSize: 16,
  },
  formDesign: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
    marginTop: 40,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "60%",
    marginBottom: 20,
    alignSelf: "center",
  },
});
