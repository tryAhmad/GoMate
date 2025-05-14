import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateTimePickerGroupProps {
  date: Date;
  time: Date;
  showDate: boolean;
  showTime: boolean;
  onShowDate: () => void;
  onShowTime: () => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
}

export const DateTimePickerGroup: React.FC<DateTimePickerGroupProps> = ({
  date,
  time,
  showDate,
  showTime,
  onShowDate,
  onShowTime,
  onDateChange,
  onTimeChange,
}) => (
  <>
    <TouchableOpacity
      className="border border-gray-300 rounded-lg p-3 h-14 mb-2 justify-center"
      onPress={onShowDate}
    >
      <Text>
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Text>
    </TouchableOpacity>
    {showDate && (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onDateChange}
        minimumDate={new Date()}
      />
    )}
    <TouchableOpacity
      className="border border-gray-300 rounded-lg p-3 h-14 mb-4 justify-center"
      onPress={onShowTime}
    >
      <Text>
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </TouchableOpacity>
    {showTime && (
      <DateTimePicker
        value={time}
        mode="time"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onTimeChange}
      />
    )}
  </>
);
