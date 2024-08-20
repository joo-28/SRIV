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
    <View style={styles.bg}>
      <View style={styles.formDesign}>
        <View style={styles.logoutButton}>
          <Button color={Colors.Green} title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.Yellow,
  },
  formDesign: {
    top: 80,
    left: 28,
    width: 360,
    height: 200,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
  },
  logoutButton: {
    width: 100,
    alignSelf: "center",
  },
});
