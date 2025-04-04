import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/InputField";
import Toast from "react-native-toast-message";

// Define user data types
interface Fullname {
  firstname: string;
  lastname: string;
}

interface UserData {
  fullname: Fullname;
  email: string;
  imageUrl?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (!userToken) throw new Error("No user token found");

        const response = await fetch(
          "http://192.168.0.102:5000/users/profile",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch profile");

        setUserData(data);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");

      Toast.show({
        type: "success",
        text1: "Signed Out",
        text2: "You have been signed out.",
        position: "top",
      });

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg mt-3">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold">No user data found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between my-5">
          {/* Back and Title */}
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.replace("/(screens)/(user-screens)/home")}
              className="mr-4"
            >
              <Image source={icons.backArrow} className="w-6 h-6" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold">My Profile</Text>
          </View>

          {/* Sign Out Icon */}
          <TouchableOpacity onPress={handleSignOut}>
            <Image
              source={icons.out}
              className="w-7 h-7 tint-black"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri:
                userData.imageUrl || "https://avatar.iran.liara.run/public/3",
            }}
            className="rounded-full w-[110px] h-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        {/* Profile Info */}
        <View className="bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <InputField
            label="First Name"
            placeholder={userData.fullname.firstname || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />

          <InputField
            label="Last Name"
            placeholder={userData.fullname.lastname || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />

          <InputField
            label="Email"
            placeholder={userData.email || "Not Found"}
            containerStyle="w-full"
            inputStyle="p-3.5"
            editable={false}
          />
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default Profile;
