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
import { router } from "expo-router";

const VALID_USERNAME = "Sriv";
const VALID_PASSWORD = "Varun$2020";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = () => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      service.storeUserData(username);
      router.replace("/Home");
    } else {
      Alert.alert(
        "Invalid Credentials",
        "Please check your username and password."
      );
    }
  };
  return (
    <View style={styles.bg}>
      <ImageBackground
        source={require("../../assets/background.png")}
        style={styles.bgImage}
      >
        <View>
          <Text style={styles.heading}>SRIV</Text>
        </View>
        <View style={styles.formDesign}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Users ID"
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

          <Button color={Colors.Green} title="Login" onPress={handleSubmit} />
        </View>
      </ImageBackground>
    </View>
  );
}
5;
const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.Yellow,
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  heading: {
    fontSize: 45,
    color: Colors.Green,
    position: "relative",
    left: 150,
    top: 240,
  },
  formDesign: {
    top: 320,
    left: 50,
    width: 320,
    height: 297,
    minWidth: 320,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.Green,
    borderStyle: "solid",
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
