import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setTokenExists(!!token);
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Redirect
      href={
        tokenExists
          ? "/(screens)/(user-screens)/home"
          : "/(screens)/(auth)/welcome"
      }
    />
  );
};

export default Home;
