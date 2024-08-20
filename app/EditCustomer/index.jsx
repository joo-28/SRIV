import { Button, View, Text } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function index() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <View>
      <Button title="Go Back" onPress={goBack} />
    </View>
  );
}
