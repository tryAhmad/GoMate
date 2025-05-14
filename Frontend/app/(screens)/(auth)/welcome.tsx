import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-reanimated-carousel"; // only default export
import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants/index";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Loosely typed ref so TS won’t complain about scrollTo
  const carouselRef = useRef<any>(null);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/(screens)/(auth)/user-type-screen");
    } else {
      const nextIndex = activeIndex + 1;
      // imperatively scroll to the next slide
      carouselRef.current?.scrollTo({ index: nextIndex, animated: true });
      setActiveIndex(nextIndex);
    }
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      {/* Skip */}
      <TouchableOpacity
        onPress={() => router.replace("/(screens)/(auth)/user-type-screen")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={600}
        data={onboarding}
        defaultIndex={0}
        scrollAnimationDuration={500}
        onSnapToItem={(idx) => setActiveIndex(idx)}
        renderItem={({ item }) => (
          <View className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />

            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-4xl font-JakartaExtraBold mx-10 text-center">
                {item.title.includes("GoMate") ? (
                  <>
                    {item.title.split("GoMate")[0]}
                    <Text className="text-blue-500">GoMate</Text>
                    {item.title.split("GoMate")[1]}
                  </>
                ) : (
                  item.title
                )}
              </Text>
            </View>

            <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Next / Get Started */}
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={handleNext}
        className="max-w-xs mt-10 mb-10"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
