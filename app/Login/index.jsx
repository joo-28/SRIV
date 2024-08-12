import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../Services/Colors";

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setpassword] = useState("");

  const handleSubmit = () => {
    console.log("User ID:", userId);
    console.log("password:", password);
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
            value={userId}
            onChangeText={setUserId}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            value={password}
            secureTextEntry={true}
            onChangeText={setpassword}
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
