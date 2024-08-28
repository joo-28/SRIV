//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
export default function ChangeUserPassword() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const goBack = () => {
    router.back();
  };
  async function handleChangePassword() {
    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("USERNAME", username)
        .eq("PASSWORD", oldPassword)
        .single();
      if (error || !data) {
        Alert.alert("Error", "Invalid username or old password");
        return;
      }
      const { error: updateError } = await supabase
        .from("User")
        .update({ PASSWORD: newPassword })
        .eq("USERNAME", username);
      if (updateError) {
        Alert.alert("Error", "An error occurred while updating the password");
      } else {
        Alert.alert("Success", "Password updated successfully");
        setUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.formDesign}>
        <Text style={styles.heading}>Change User Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              color={Colors.Green}
              title="Change Password"
              onPress={handleChangePassword}
            />
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
    backgroundColor: Colors.Yellow,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  formDesign: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
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
  buttonContainer: {
    justifyContent: "space-around",
  },
  saveButton: {
    width: "70%",
    marginBottom: 10,
    alignSelf: "center",
  },
  goBackButton: {
    width: "70%",
    alignSelf: "center",
  },
});
