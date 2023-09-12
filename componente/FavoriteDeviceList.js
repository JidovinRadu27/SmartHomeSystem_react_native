import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, update, off } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Card, ListItem } from "react-native-elements";

const FavoriteDeviceList = () => {
  const [favoriteDevices, setFavoriteDevices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    const userId = user.uid;
    const devicesRef = ref(database, "users/" + userId + "/rooms");

    const devicesListener = onValue(devicesRef, (snapshot) => {
      const rooms = snapshot.val();

      if (rooms) {
        const favoriteDevices = [];
        for (const roomId in rooms) {
          const devices = rooms[roomId].devices;
          for (const deviceName in devices) {
            const device = devices[deviceName];
            if (device.favourite === 1) {
              favoriteDevices.push({
                roomId,
                deviceName,
                deviceType: device.deviceType,
                state: device.state,
              });
            }
          }
        }
        setFavoriteDevices(favoriteDevices);
        console.log(favoriteDevices);
      } else {
        setFavoriteDevices([]);
      }
    });

    return () => {
      off(devicesRef, "value", devicesListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {favoriteDevices.length > 0 ? (
            <View style={styles.cardRow}>
              {favoriteDevices.map((device, index) => (
                <View key={index} style={styles.cardContainer}>
                  <Card
                    wrapperStyle={styles.cardWrapper}
                    containerStyle={styles.cardContainerStyle}
                  >
                    <Card.Title style={styles.cardTitle}>
                      {device.deviceName}
                    </Card.Title>
                    <Card.Title style={[styles.cardTitle, styles.roomName]}>
                      {device.roomId}
                    </Card.Title>
                    <Card.Divider />
                    <ListItem>
                      <ListItem.Content>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            {
                              backgroundColor:
                                device.state === "1" ? "#0782f9" : "grey",
                            },
                          ]}
                          onPress={() => {
                            // Toggle the state of the device here
                            const newState = device.state === "1" ? "0" : "1";
                            // Perform any necessary state update logic here
                            // ...

                            // Example: Update the device state in the database
                            const user = auth.currentUser;
                            const userId = user.uid;
                            const deviceRef = ref(
                              database,
                              `users/${userId}/rooms/${device.roomId}/devices/${device.deviceName}`
                            );
                            update(deviceRef, { state: newState });

                            // You may also update the local state if needed
                            const updatedFavoriteDevices = [...favoriteDevices];
                            updatedFavoriteDevices[index].state = newState;
                            setFavoriteDevices(updatedFavoriteDevices);
                          }}
                        >
                          <Text style={styles.buttonText}>
                            {device.state === "1" ? "On" : "Off"}
                          </Text>
                        </TouchableOpacity>
                      </ListItem.Content>
                    </ListItem>
                  </Card>
                </View>
              ))}
            </View>
          ) : (
            <Text>No favorite devices found.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const cardWidth = windowWidth * 0.45;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 100,
    padding: 16,
  },
  scrollContainer: {
    height: 300, // Set the desired height for scrolling
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  cardWrapper: {
    padding: 0,
  },
  cardContainerStyle: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  roomName: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    width: "110%",
    height: 30,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#0782f9",
  },
});

export default FavoriteDeviceList;
