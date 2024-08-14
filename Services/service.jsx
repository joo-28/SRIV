// services.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeUserData = async (username) => {
  try {
    await AsyncStorage.setItem("username", username);
  } catch (e) {
    console.error("Failed to save username to AsyncStorage", e);
  }
};

const getUserData = async () => {
  try {
    const username = await AsyncStorage.getItem("username");
    return username;
  } catch (e) {
    console.error("Failed to fetch username from AsyncStorage", e);
    return null;
  }
};

const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem("username");
  } catch (e) {
    console.error("Failed to clear username from AsyncStorage", e);
  }
};
export default {
  storeUserData,
  getUserData,
  clearUserData,
};
