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

const VALID_USERNAME = "Sriv";
const VALID_PASSWORD = "Varun$2020";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      service.storeUserData(username);
      router.push("(tabs)");
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
      >
        <Text style={styles.heading}>SRIV</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your User ID"
            value={username}
            onChangeText={setUsername}
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
