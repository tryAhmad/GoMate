import { icons, images } from "@/constants";
import { ScrollView, View, Text, Image, Alert } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";

import Toast from "react-native-toast-message";


const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () => {
    const requestBody = {
      email: form.email,
      password: form.password,
    };

    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_USERIP}:5000/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);

        // Show success toast
        Toast.show({
          type: "success",
          text1: "Login Successful!",
          text2: "Welcome back 🎉",
        });

        setTimeout(() => router.replace("/(screens)/(user-screens)/home"), 500); // Navigate after toast
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed!",
          text2: data.message || "Invalid credentials 😞",
        });
      }
    } catch (error:any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Something went wrong! - ${error.message}`,
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Sign In to Your Account
          </Text>
        </View>
        <View className="p-7">
          <InputField
            label="Email"
            placeholder="Enter your Email"
            placeholderTextColor={"grey"}
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            placeholderTextColor={"grey"}
            icon={icons.lock}
            secureTextEntry={true}
            inputStyle="color-black"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            className="mt-8"
            onPress={onSignInPress}
          />

          <OAuth />

          <Link
            href="/(screens)/(auth)/user-signup"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default SignIn;
