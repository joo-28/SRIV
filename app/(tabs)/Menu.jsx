import { View, StyleSheet, Button, Text } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";
import service from "../../Services/service";

export default function Menu() {
  const router = useRouter();

  const handleLogout = async () => {
    await service.clearUserData();
    Alert.alert("Logout", "You have been logged out.");
    router.push("/Login");
  };

  const handleSwitchMilkApp = () => {
    // Add navigation or functionality for switching to the Milk App
    console.log("Switch Milk App clicked");
  };

  const handleEditUser = () => {
    // Add navigation or functionality for editing user
    router.push("/EditUser");
  };

  const handleAddNewUser = () => {
    // Add navigation or functionality for adding a new user
    router.push("/AddNewUser");
  };

  const handleChangePassword = () => {
    // Add navigation or functionality for changing password
    router.push("/ChangePassword");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Menu</Text>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.Green}
            title="Switch Milk App"
            onPress={handleSwitchMilkApp}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Edit User"
            onPress={handleEditUser}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Add New User"
            onPress={handleAddNewUser}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={Colors.DarkBlue}
            title="Change Password"
            onPress={handleChangePassword}
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
});
