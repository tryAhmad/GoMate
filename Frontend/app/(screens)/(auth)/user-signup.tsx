import { icons, images } from "@/constants";
import { ScrollView, View, Text, Image } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";

import Toast from "react-native-toast-message";

const SignUp = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const onSignUpPress = async () => {
    const requestBody = {
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      email: form.email,
      password: form.password,
    };

    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_USERIP}:5000/users/register`,
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
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
          })
        );

        Toast.show({
          type: "success",
          text1: "Sign-up Successful 🎉",
          text2: "Redirecting to login...",
          position: "top",
        });

        setTimeout(() => {
          router.replace("/(screens)/(auth)/user-signin");
        }, 1000);
      } else {
        Toast.show({
          type: "error",
          text1: "Sign-up Failed",
          text2: data.message || "Something went wrong!",
          position: "top",
        });
      }
    } catch (error) {
      console.error("Sign-up failed:", error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please try again later.",
        position: "top",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create your account
          </Text>
        </View>
        <View className="p-7">
          <InputField
            label="First Name"
            placeholder="Enter your first name"
            placeholderTextColor={"grey"}
            icon={icons.person}
            value={form.firstname}
            onChangeText={(value) => setForm({ ...form, firstname: value })}
          />
          <InputField
            label="Last Name"
            placeholder="Enter your last name"
            placeholderTextColor={"grey"}
            icon={icons.person}
            value={form.lastname}
            onChangeText={(value) => setForm({ ...form, lastname: value })}
          />
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
            title="Sign Up"
            className="mt-8"
            onPress={onSignUpPress}
          />

          <OAuth />

          <Link
            href="/(screens)/(auth)/user-signin"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default SignUp;
