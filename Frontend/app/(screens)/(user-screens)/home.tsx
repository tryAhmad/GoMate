import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { icons } from "@/constants";
import Toast from "react-native-toast-message";
import CustomButton from "@/components/CustomButton";

const HomeScreen = () => {
  

  return (
    <View className="flex-1 bg-white">
      {/* Top Right Icon */}
      <View className="w-full pt-7 px-7 items-end">
        <TouchableOpacity onPress={() => router.replace("/(screens)/(user-screens)/user-profile")}>
          <Image
            source={icons.person}
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
      </View>
      <Toast />
    </View>
  );
};

export default HomeScreen;
