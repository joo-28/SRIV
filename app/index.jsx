import { View, Text } from "react-native";
import React, { useEffect } from "react";
import service from "../Services/service";
import { useRouter } from "expo-router";
export default function index() {
  const router = useRouter();
  useEffect(() => {
    checkUserAuth();
  }, []);
  const checkUserAuth = async () => {
    const result = await service.getData("Login");
    if (result !== true) {
      router.replace("/Login");
    } else {
      router.replace("/Home");
    }
  };
  return (
    <View>
      <Text></Text>
    </View>
  );
}
