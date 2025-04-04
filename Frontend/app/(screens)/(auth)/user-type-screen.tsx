import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const ChooseUserType = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-black text-4xl font-JakartaExtraBold mx-10 text-center mb-6">
        Choose User Type
      </Text>
      <CustomButton
        title="Sign Up as Driver"
        onPress={() => router.replace("/(screens)/(auth)/welcome")}
        className="max-w-sm mt-3 mb-5"
      />
      <CustomButton
        title="Sign Up as Rider"
        onPress={() => router.replace("/(screens)/(auth)/user-signup")}
        className="max-w-sm mt-3 mb-10"
      />
    </View>
  );
};

export default ChooseUserType;
