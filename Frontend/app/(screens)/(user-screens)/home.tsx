// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";
import { debounce, pick } from "lodash";
import { router } from "expo-router";
import { icons } from "@/constants";
import RideSelector from "@/components/RideSelector";
import LocationInput from "@/components/LocationInput";
import { DateTimePickerGroup } from "@/components/DateTimePickerGroup";
import MapSection from "@/components/MapSection";
import MapView, { Region } from "react-native-maps";
import CustomButton from "@/components/CustomButton";

const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);

  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [pickup, setPickup] = useState<string>("");
  const [dropoff, setDropoff] = useState<string>("");
  const [fare, setFare] = useState<{ auto: number; car: number; moto: number }>(
    {
      auto: 0,
      car: 0,
      moto: 0,
    }
  );
  const [userFare, setUserFare] = useState<string>("");
  const [selectedRide, setSelectedRide] = useState<string>("car");
  const [seats, setSeats] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState<boolean>(false);
  const [showDropoffDropdown, setShowDropoffDropdown] =
    useState<boolean>(false);

  const [pickupCoords, setPickupCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const rideTypes = [
    { id: "car", name: "Car", icon: "car" },
    { id: "bike", name: "Bike", icon: "motorbike" },
    { id: "rickshaw", name: "Rickshaw", icon: "rickshaw" },
    { id: "shared", name: "Shared", icon: "account-multiple" },
  ];

  // On mount: get user location, reverse geocode, set pickup
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Location permission required" });
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});

      const region: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(region);

      const [place] = await Location.reverseGeocodeAsync(coords);
      const address = [
        place.name,
        place.street,
        place.city,
        place.region,
        place.postalCode,
      ]
        .filter(Boolean)
        .join(", ");

      setPickup(address);
      setPickupCoords({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      mapRef.current?.animateToRegion(region, 300);
    })();
  }, []);

  const fetchSuggestions = useCallback(
    debounce(async (input: string, type: "pickup" | "dropoff") => {
      if (input.length < 3) {
        type === "pickup"
          ? setShowPickupDropdown(false)
          : setShowDropoffDropdown(false);
        return;
      }
      const token = await AsyncStorage.getItem("userToken");
      try {
        const { data } = await axios.get<string[]>(
          `http://${process.env.EXPO_PUBLIC_USERIP}:5000/maps/get-suggestions`,
          { params: { input }, headers: { Authorization: `Bearer ${token}` } }
        );
        if (type === "pickup") {
          setPickupSuggestions(data);
          setShowPickupDropdown(true);
        } else {
          setDropoffSuggestions(data);
          setShowDropoffDropdown(true);
        }
      } catch (e) {
        console.error(e);
      }
    }, 300),
    []
  );

  // Function to fetch fare when pickup and dropoff are set
  const getFare = async () => {
    if (pickup && dropoff) {
        // Get the user token from AsyncStorage
        const token = await AsyncStorage.getItem("userToken");

        // Make the API call with token for authorization
        const response = await axios.get(
          `http://${process.env.EXPO_PUBLIC_USERIP}:5000/rides/get-fare`,
          {
            params: {
              pickup,
              destination: dropoff,
            },
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the headers
            },
          }
        );

        // Update the fare state with the response data
        setFare(response.data);
      
    }
  };

  // Trigger API call whenever pickup or dropoff changes with a 1 second delay
  useEffect(() => {
    const delayFetchFare = setTimeout(() => {
      getFare();
    }, 1000); // 1 second delay

    // Cleanup timeout if the component is unmounted or pickup/dropoff change again
    return () => clearTimeout(delayFetchFare);
  }, [pickup, dropoff]); // Depend on pickup and dropoff states

  const fetchCoords = async (address: string, type: "pickup" | "dropoff") => {
    const token = await AsyncStorage.getItem("userToken");
    const { data } = await axios.get<{ latitude: number; longitude: number }>(
      `http://${process.env.EXPO_PUBLIC_USERIP}:5000/maps/get-coordinates`,
      { params: { address }, headers: { Authorization: `Bearer ${token}` } }
    );
    type === "pickup" ? setPickupCoords(data) : setDropoffCoords(data);
    return data;
  };

  // Build route whenever both coords present
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      const isTwoWheeler = ["bike", "rickshaw"].includes(selectedRide);
      const mode = "driving";
      const avoid = isTwoWheeler ? "&avoid=highways" : "";

      fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupCoords.latitude},${pickupCoords.longitude}&destination=${dropoffCoords.latitude},${dropoffCoords.longitude}&mode=${mode}${avoid}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API}`
      )
        .then((res) => res.json())
        .then(({ routes }) => {
          if (routes?.length) {
            const points = polyline.decode(routes[0].overview_polyline.points);
            setRouteCoords(
              points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }))
            );
          }
        });
    }
  }, [pickupCoords, dropoffCoords, selectedRide]);

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const formatTime = (t: Date) =>
    t.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <SafeAreaView className="flex-1">
      {initialRegion && (
        <MapSection
          initialRegion={initialRegion}
          pickupCoords={pickupCoords}
          dropoffCoords={dropoffCoords}
          routeCoords={routeCoords}
          mapRef={mapRef}
        />
      )}
      <View className="absolute top-12 left-5">
        <TouchableOpacity
          onPress={() => router.push("/user-profile")}
          className="bg-white p-3 rounded-full shadow"
        >
          <Image source={icons.person} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute bottom-0 w-full bg-white p-5 rounded-t-xl shadow-lg"
      >
        <RideSelector
          rideTypes={rideTypes}
          selectedRide={selectedRide}
          onSelect={setSelectedRide}
        />

        <LocationInput
          placeholder="Pickup Location"
          value={pickup}
          suggestions={pickupSuggestions}
          showDropdown={showPickupDropdown}
          onChange={(text) => {
            setPickup(text);
            fetchSuggestions(text, "pickup");
          }}
          onClear={() => {
            setPickup("");
            setPickupSuggestions([]);
            setShowPickupDropdown(false);
            setFare({ auto: 0, car: 0, moto: 0 });
          }}
          onSelect={async (loc) => {
            setPickup(loc);
            setShowPickupDropdown(false);
            const coords = await fetchCoords(loc, "pickup");
            mapRef.current?.animateToRegion(
              { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
              300
            );
          }}
        />

        <LocationInput
          placeholder="Dropoff Location"
          value={dropoff}
          suggestions={dropoffSuggestions}
          showDropdown={showDropoffDropdown}
          onChange={(text) => {
            setDropoff(text);
            fetchSuggestions(text, "dropoff");
          }}
          onClear={() => {
            setDropoff("");
            setDropoffSuggestions([]);
            setShowDropoffDropdown(false);
            setFare({ auto: 0, car: 0, moto: 0 });
          }}
          onSelect={async (loc) => {
            setDropoff(loc);
            setShowDropoffDropdown(false);

            const coords = await fetchCoords(loc, "dropoff");
            mapRef.current?.animateToRegion(
              { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
              300
            );
          }}
        />

        {pickup && dropoff && fare && (
          <View className="bg-slate-200 p-2 rounded mb-2">
            {selectedRide === "car" || selectedRide === "shared" ? (
              <Text className="text-black font-JakartaBold">
                Recommended Fare: {fare.car}
              </Text>
            ) : selectedRide === "bike" ? (
              <Text className="text-black font-JakartaBold">
                Recommended Fare: {fare.moto}
              </Text>
            ) : selectedRide === "rickshaw" ? (
              <Text className="text-black font-JakartaBold">
                Recommended Fare: {fare.auto}
              </Text>
            ) : null}
          </View>
        )}

        <TextInput
          className="border p-3 rounded-lg mb-4"
          placeholder="Your Fare (PKR)"
          placeholderTextColor="gray"
          keyboardType="numeric"
        />

        {selectedRide === "shared" && (
          <>
            <TextInput
              className="border p-3 rounded-lg mb-3"
              placeholder="Seats (1-4)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={seats}
              onChangeText={(t) => (!t || (+t >= 1 && +t <= 4)) && setSeats(t)}
              maxLength={1}
            />
            <TouchableOpacity
              className="border p-3 rounded-lg mb-2"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePickerGroup
                date={date}
                time={time}
                showDate
                showTime={false}
                onShowDate={() => {}}
                onShowTime={() => {}}
                onDateChange={(_, d) => {
                  if (d) {
                    setDate(d);
                  }
                  setShowDatePicker(false);
                }}
                onTimeChange={() => {}}
              />
            )}
            <TouchableOpacity
              className="border p-3 rounded-lg mb-4"
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{formatTime(time)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePickerGroup
                date={date}
                time={time}
                showDate={false}
                showTime
                onShowDate={() => {}}
                onShowTime={() => {}}
                onDateChange={() => {}}
                onTimeChange={(_, t) => {
                  if (t) {
                    setTime(t);
                  }
                  setShowTimePicker(false);
                }}
              />
            )}
          </>
        )}

        <CustomButton
          title="Find a driver"
          onPress={() => {
            if (!pickup || !dropoff || !fare)
              return Toast.show({
                type: "error",
                text1: "Please fill all fields",
              });
            if (selectedRide === "shared" && (+seats < 1 || +seats > 4))
              return Toast.show({ type: "error", text1: "Select 1-4 seats" });
            const rideName =
              rideTypes.find((r) => r.id === selectedRide)?.name ||
              selectedRide;
            const message =
              selectedRide === "shared"
                ? `Shared ride for ${seats} seat(s) at ${formatTime(time)} on ${formatDate(date)}`
                : `Ride type: ${rideName}`;
            Toast.show({
              type: "success",
              text1: "Searching for driver...",
              text2: message,
            });
          }}
        />
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
};

export default HomeScreen;
