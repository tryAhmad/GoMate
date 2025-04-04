import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Define the types for user data
interface Fullname {
  firstname: string;
  lastname: string;
}

interface UserData {
  fullname: Fullname;
  email: string;
  password: string; // Including password field here
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // Set type for userData
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try getting token from AsyncStorage
        const userToken = await AsyncStorage.getItem("userToken");
        console.log(userToken);

        if (userToken) {
          // Fetch user data from your backend API (using /profile endpoint)
          const response = await fetch("http://192.168.0.102:5000/users/profile", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUserData(data); // Set the user data after fetching
          } else {
            throw new Error(data.message || "Failed to fetch profile");
          }
        } else {
          throw new Error("No user token found");
        }
      } catch (error:any) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", error.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      router.replace("/(screens)/(auth)/user-signin");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.username}>
          {userData.fullname.firstname} {userData.fullname.lastname}
        </Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.profileDetails}>
        <Text style={styles.detailTitle}>Account Info</Text>
        <Text style={styles.detailText}>Email: {userData.email}</Text>
        <Text style={styles.detailText}>
          Password: {userData.password}
        </Text>{" "}
        {/* Display password */}
      </View>

      <Button title="Log Out" onPress={handleLogout} color="#FF4C4C" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
});

export default Profile;
