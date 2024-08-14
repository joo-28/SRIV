import { View, Text } from "react-native";
import React, { useEffect } from "react";
import service from "../Services/service";
import { useRouter } from "expo-router";
export default function index() {
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const username = await service.getUserData();
      console.log(username);
      if (username) {
        router.replace("/Home");
      } else {
        router.replace("/Login");
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View>
      <Text>Check</Text>
    </View>
  );
}
