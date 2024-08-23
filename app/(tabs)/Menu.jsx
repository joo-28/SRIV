import { View, StyleSheet, Button } from "react-native";
import React from "react";
import Colors from "../../Services/Colors";
import { useRouter } from "expo-router";
import service from "../../Services/service";

export default function Menu() {
  const router = useRouter();

  const handleLogout = async () => {
    await service.clearUserData();
    router.push("/Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.logoutButtonContainer}>
          <Button color={Colors.Green} title="Logout" onPress={handleLogout} />
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
  logoutButtonContainer: {
    width: "60%",
  },
});
