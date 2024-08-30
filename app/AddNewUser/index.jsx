//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
export default function AddNewUser() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const goBack = () => {
    router.back();
  };
  async function handleSaveData() {
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!role) {
      Alert.alert("Error", "Please select a role");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("User")
        .insert([{ USERNAME: username, PASSWORD: password, ROLE: role }]);

      if (error) {
        Alert.alert("Error", "An error occurred while adding the user");
      } else {
        Alert.alert("Successful", "New User Created");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    }
  }
  const renderRadioButton = (selectedRole, label) => (
    <TouchableOpacity
      style={styles.radioButtonContainer}
      onPress={() => setRole(selectedRole)}
    >
      <View style={styles.radioButtonOuterCircle}>
        {role === selectedRole && (
          <View style={styles.radioButtonInnerCircle} />
        )}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Add New User</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.radioGroup}>
          {renderRadioButton("admin", "Admin")}
          {renderRadioButton("ccstaff", "CCstaff")}
          {renderRadioButton("cstaff", "Cstaff")}
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button color={Colors.Green} title="ADD" onPress={handleSaveData} />
          </View>
          <View style={styles.goBackButton}>
            <Button title="Go Back" onPress={goBack} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  formDesign: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: Colors.Yellow,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 40,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 24,
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 20,
    alignSelf: "center",
  },
  radioGroupLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginEnd: 12,
  },
  radioButtonOuterCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.Green,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.Green,
  },
  radioButtonLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: "space-around",
  },
  saveButton: {
    width: "45%",
    marginBottom: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "45%",
    alignSelf: "center",
  },
});
