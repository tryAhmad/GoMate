import React from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface LocationInputProps {
  placeholder: string;
  placeholderTextColor?: string;
  value: string;
  suggestions: string[];
  showDropdown: boolean;
  onChange: (text: string) => void;
  onSelect: (location: string) => void;
  onClear: () => void;
}
const { height } = Dimensions.get("window");

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  placeholderTextColor = "gray",
  value,
  suggestions,
  showDropdown,
  onChange,
  onSelect,
  onClear,
}) => (
  <View className="mb-2">
    <View className="flex-row items-center border border-gray-300 rounded-lg p-0 h-14">
      <TextInput
        className="flex-1 px-3"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="p-3">
          <MaterialCommunityIcons name="close-circle" size={20} color="gray" />
        </TouchableOpacity>
      )}
    </View>

    {showDropdown && suggestions.length > 0 && (
      <ScrollView
        className="bg-white border border-gray-200 rounded-lg mt-2"
        style={{ maxHeight: height / 3 }}
      >
        {suggestions.map((item, i) => (
          <TouchableOpacity
            key={i}
            className="p-3 border-b border-gray-100"
            onPress={() => onSelect(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )}
  </View>
);

export default LocationInput;
