//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  ScrollView,
  Button,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

export default function SelectCenter() {
  const [centers, setCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState("AM");
  const [cash, setCash] = useState("");
  const [credit, setCredit] = useState("");
  const [amount, setAmount] = useState("");
  const [liters, setLiters] = useState("");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
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
  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setShowModal(false);
  };
  const calculateAndSetValues = () => {
    const totalAmount = parseFloat(cash || "0") + parseFloat(credit || "0");
    setAmount(totalAmount.toFixed(2));
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
        const milkRate = milkBoothData.milk_rate;
        const litersCalculated = (totalAmount / milkRate).toFixed(2);
        setLiters(litersCalculated);
      } catch (error) {
        Alert.alert("Error", "Please Select the Center First");
      }
    };
    fetchMilkRate();
  };
  const handleSaveData = async () => {
    if (!selectedCenter) {
      Alert.alert("Error", "Please select a center");
      return;
    }
    calculateAndSetValues();
    const totalAmount = parseFloat(cash || "0") + parseFloat(credit || "0");
    setAmount(totalAmount.toFixed(2));
    try {
      const { data: milkBoothData, error: milkBoothError } = await supabase
        .from("milk_booth")
        .select("milk_rate")
        .eq("center_number", selectedCenter.center_number)
        .single();
      if (milkBoothError) {
        throw milkBoothError;
      }
      const milkRate = milkBoothData.milk_rate;
      const litersCalculated = (totalAmount / milkRate).toFixed(2);
      setLiters(litersCalculated);
      const { error: insertError } = await supabase
        .from("center_milk_sales")
        .insert({
          center_number: selectedCenter.center_number,
          DATE: date.toISOString().split("T")[0],
          AM_PM: selectedValue,
          cash: parseFloat(cash),
          credit: parseFloat(credit),
          amount: totalAmount,
          litre: parseFloat(litersCalculated),
        });
      if (insertError) {
        throw insertError;
      }
      Alert.alert("Success", "Data saved successfully");
      setCash("");
      setCredit("");
      setAmount("");
      setLiters("");
    } catch (error) {
      Alert.alert("Error", "Data Already Updated on this Shift");
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.formDesign, { width: width * 0.9 }]}>
          <Text style={styles.heading}>Center Milk Sales</Text>
          <View style={styles.datePickerContainer}>
            <Button onPress={showDatePicker} title={date.toDateString()} />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChange}
                maximumDate={new Date()}
                style={styles.datePicker}
              />
            )}
          </View>
          <View style={styles.radioGroup}>
            <View style={styles.radioButton}>
              <RadioButton
                value="AM"
                status={selectedValue === "AM" ? "checked" : "unchecked"}
                onPress={() => setSelectedValue("AM")}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>AM</Text>
            </View>

            <View style={styles.radioButton}>
              <RadioButton
                value="PM"
                status={selectedValue === "PM" ? "checked" : "unchecked"}
                onPress={() => setSelectedValue("PM")}
                color="#007BFF"
              />
              <Text style={styles.radioLabel}>PM</Text>
            </View>
          </View>
          <Text style={styles.radioLabel}>Cash</Text>
          <TextInput
            style={styles.input}
            placeholder="Cash"
            value={cash}
            onChangeText={setCash}
            keyboardType="numeric"
            onEndEditing={calculateAndSetValues}
          />
          <Text style={styles.radioLabel}>Credit</Text>
          <TextInput
            style={styles.input}
            placeholder="Credit"
            value={credit}
            onChangeText={setCredit}
            keyboardType="numeric"
            onEndEditing={calculateAndSetValues}
          />
          <View style={styles.textContainer}>
            <Text style={styles.Label}>Amount: {amount}</Text>
            <Text style={styles.Label}>Liters: {liters}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.saveButton}>
              <Button
                color={Colors.Green}
                title="Save"
                onPress={handleSaveData}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: Colors.Yellow,
    padding: 10,
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
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
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
    marginBottom: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  saveButton: {
    marginTop: 10,
    width: "45%",
  },
  datePicker: {
    width: "100%",
    height: 150,
  },
  Label: {
    paddingTop: 10,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  goBackButton: {
    width: "60%",
    marginBottom: 20,
    alignSelf: "center",
  },
});
