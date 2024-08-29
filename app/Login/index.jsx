//Completed NO Changes Required - Test Completed - Logs and Blank space Removed
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Services/Colors";
import service from "../../Services/service";
import { useRouter } from "expo-router";
import supabase from "../../Services/supabaseConfig";

export default function LoginScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("USERNAME,PASSWORD,ROLE")
      .eq("USERNAME", userName)
      .single();

    if (error || !data) {
      Alert.alert("Error", "Incorrect UserName or Password.");
      return;
    }

    const { USERNAME, PASSWORD, ROLE } = data;
    setRole(ROLE);
    if (userName === USERNAME && password === PASSWORD) {
      service.storeUserData(userName);
      switch (ROLE) {
        case "admin":
          router.push("(tabs)");
          break;
        case "ccstaff":
          router.push("CCShiftEntry");
          break;
        case "cstaff":
          router.push("CenterShiftEntry");
          break;
        default:
          Alert.alert("Error", "Role not recognized.");
      }
    } else {
      Alert.alert(
        "Invalid Credentials",
        "Please check your username and password."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Text style={styles.heading}>SRIV</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your User ID"
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <Button color={Colors.Green} title="Login" onPress={handleSubmit} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.Yellow,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 45,
    color: Colors.Green,
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    borderColor: Colors.Green,
    borderWidth: 2,
    elevation: 5,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
