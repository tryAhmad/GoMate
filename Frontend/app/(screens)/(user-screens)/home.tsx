import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { icons } from "@/constants";
import Toast from "react-native-toast-message";
import CustomButton from "@/components/CustomButton";

const HomeScreen = () => {
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");

      Toast.show({
        type: "success",
        text1: "Signed Out",
        text2: "You have been signed out.",
        position: "top",
      });

      // Navigate after a short delay so the toast is visible
      setTimeout(() => {
        router.replace("/(screens)/(auth)/user-type-screen");
      }, 1000);
    } catch (error) {
      console.error("Error signing out:", error);

      Toast.show({
        type: "error",
        text1: "Sign Out Failed",
        text2: "Please try again.",
        position: "top",
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top Right Icon */}
      <View className="w-full pt-7 px-7 items-end">
        <TouchableOpacity onPress={handleSignOut}>
          <Image
            source={icons.out}
            className="w-8 h-8 tint-black"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-semibold text-black">
          Welcome to the Home Screen!
        </Text>
        <CustomButton
          title="Sign Up as Rider"
          onPress={() => router.replace("/(screens)/(user-screens)/user-profile")}
          className="max-w-sm mt-3 mb-10"
        />
      </View>
      <Toast />
    </View>
  );
};

export default HomeScreen;
