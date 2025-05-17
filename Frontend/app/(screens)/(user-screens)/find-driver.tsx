import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { red } from "react-native-reanimated/lib/typescript/Colors";

const mockDrivers = [
  {
    id: "1",
    first_name: "James",
    last_name: "Wilson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    fare: 400,
    rating: "4.80",
  },
  {
    id: "2",
    first_name: "David",
    last_name: "Brown",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    fare: 450,
    rating: "4.60",
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Johnson",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    fare: 480,
    rating: "4.70",
  },
  {
    id: "4",
    first_name: "Robert",
    last_name: "Green",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    fare: 400,
    rating: "4.90",
  },
  {
    id: "5",
    first_name: "Robert",
    last_name: "Green",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    fare: 500,
    rating: "4.90",
  },
];

const { width } = Dimensions.get("window");

const FindDriverScreen = () => {
  const [loading, setLoading] = useState(true);
  const slideAnims = useRef(
    mockDrivers.map(() => new Animated.Value(-width))
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // animate each driver in sequence
      mockDrivers.forEach((_, index) => {
        Animated.timing(slideAnims[index], {
          toValue: 0,
          duration: 500,
          delay: index * 300,
          useNativeDriver: true,
        }).start();
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const cancelRide = () => {
    router.back();
  };

  const acceptDriver = (driverId: string) => {
    console.log("Accepted driver:", driverId);
    // Navigate to next screen or update state
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-4 text-lg text-gray-700">Finding Drivers...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Text className="text-3xl font-JakartaExtraBold text-gray-700 mb-4 text-center">
        Available Drivers
      </Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {mockDrivers.map((driver, index) => (
          <Animated.View
            key={driver.id}
            style={{ transform: [{ translateX: slideAnims[index] }]}}
            className="bg-gray-200 rounded-xl p-4 mb-4 shadow-md"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: driver.profile_image_url }}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <View>
                  <Text className="text-2xl font-JakartaBold">
                    {driver.first_name} {driver.last_name}
                  </Text>
                  <Text className="text-gray-800 font-JakartaSemiBold">
                    Rating: {driver.rating} ⭐
                  </Text>
                  <Text className="text-gray-800 font-JakartaExtraBold text-2xl">Fare: Rs {driver.fare}</Text>
                </View>
              </View>

              <Image
                source={{ uri: driver.car_image_url }}
                className="w-20 h-20 rounded-xl ml-4"
              />
            </View>

            <View className="mt-4">
              <CustomButton
                title="Accept"
                className="bg-green-600 py-2 rounded-xl text-2xl h-14"
                onPress={() => acceptDriver(driver.id)}
              />
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <View className="absolute bottom-6 w-full px-6">
        <CustomButton
          title="Cancel Ride"
          className="bg-red-600 py-3 rounded-xl h-14 ml-4"
          onPress={cancelRide}
        />
      </View>
    </View>
  );
};

export default FindDriverScreen;
