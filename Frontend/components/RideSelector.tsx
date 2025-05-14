import React, { useRef } from "react";
import { View, Animated, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RideType = { id: string; name: string; icon: string };
interface RideSelectorProps {
  rideTypes: RideType[];
  selectedRide: string;
  onSelect: (id: string) => void;
}

const RideSelector: React.FC<RideSelectorProps> = ({
  rideTypes,
  selectedRide,
  onSelect,
}) => {
  const animationValues = useRef(
    rideTypes.reduce(
      (acc, ride) => {
        acc[ride.id] = new Animated.Value(1);
        return acc;
      },
      {} as Record<string, Animated.Value>
    )
  ).current;

  const handlePress = (id: string) => {
    rideTypes.forEach((ride) => {
      Animated.spring(animationValues[ride.id], {
        toValue: ride.id === id ? 1.05 : 1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }).start();
    });
    onSelect(id);
  };

  return (
    <View className="flex-row justify-between mb-4">
      {rideTypes.map((ride) => (
        <Animated.View
          key={ride.id}
          style={{
            transform: [{ scale: animationValues[ride.id] }],
            flex: 1,
            marginHorizontal: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => handlePress(ride.id)}
            className={`p-2 rounded-lg h-16 items-center justify-center ${
              selectedRide === ride.id ? "bg-blue-500" : "bg-white"
            }`}
            style={{
              borderWidth: selectedRide === ride.id ? 0 : 1,
              borderColor: "#e5e7eb",
            }}
          >
            <MaterialCommunityIcons
              name={ride.icon as any}
              size={24}
              color={selectedRide === ride.id ? "white" : "black"}
            />
            <Text
              className={`mt-1 text-xs font-bold ${
                selectedRide === ride.id ? "text-white" : "text-gray-800"
              }`}
            >
              {ride.name}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

export default RideSelector;
