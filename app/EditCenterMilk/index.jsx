import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  Button,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import Colors from "../../Services/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

export default function UpdateCenterData() {
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

  useEffect(() => {
    if (selectedCenter) {
      fetchCenterData();
    }
  }, [selectedCenter, date, selectedValue]);

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

  const fetchCenterData = async () => {
    try {
      const { data, error } = await supabase
        .from("center_milk_sales")
        .select("cash, credit")
        .eq("center_number", selectedCenter.center_number)
        .eq("DATE", date.toISOString().split("T")[0])
        .eq("AM_PM", selectedValue)
        .single();

      if (error) {
        if (error.code !== "PGRST116") {  // PGRST116 means no data found
          throw error;
        } else {
          // Clear the fields if no data is found for the selected date and shift
          setCash("");
          setCredit("");
          setAmount("");
          setLiters("");
        }
      } else {
        setCash(data.cash.toString());
        setCredit(data.credit.toString());
        calculateAndSetValues(data.cash, data.credit);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch center data");
    }
  };

  const calculateAndSetValues = (cashValue = cash, creditValue = credit) => {
    const totalAmount = parseFloat(cashValue || "0") + parseFloat(creditValue || "0");
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
        Alert.alert("Error", "Failed to fetch milk rate");
      }
    };
    fetchMilkRate();
  };

  const handleUpdateData = async () => {
    if (!selectedCenter) {
      Alert.alert("Error", "Please select a center");
      return;
    }
    calculateAndSetValues();
    const totalAmount = parseFloat(cash || "0") + parseFloat(credit || "0");
    setAmount(totalAmount.toFixed(2));
    try {
      const { data, error } = await supabase
        .from("center_milk_sales")
        .upsert({
          center_number: selectedCenter.center_number,
          DATE: date.toISOString().split("T")[0],
          AM_PM: selectedValue,
          cash: parseFloat(cash),
          credit: parseFloat(credit),
          amount: totalAmount,
          litre: parseFloat(liters),
        }, { onConflict: ['center_number', 'DATE', 'AM_PM'] });

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Data updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update data");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <View style={[styles.formDesign, { width: width * 0.9 }]}>
          <Text style={styles.heading}>Update Center Milk Sales</Text>
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
            onChangeText={(value) => {
              setCash(value);
              calculateAndSetValues(value, credit);
            }}
            keyboardType="numeric"
          />
          <Text style={styles.radioLabel}>Credit</Text>
          <TextInput
            style={styles.input}
            placeholder="Credit"
            value={credit}
            onChangeText={(value) => {
              setCredit(value);
              calculateAndSetValues(cash, value);
            }}
            keyboardType="numeric"
          />
          <View style={styles.textContainer}>
            <Text style={styles.Label}>Amount: {amount}</Text>
            <Text style={styles.Label}>Liters: {liters}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.saveButton}>
              <Button
                color={Colors.Green}
                title="Update"
                onPress={handleUpdateData}
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
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
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
      backgroundColor: Colors.Yellow,
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
      backgroundColor: Colors.Yellow,
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
  