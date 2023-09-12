import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from "../firebase";
import { ref, set, onValue, off, get } from "firebase/database";
import { TextInput } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";

const AutomationDeviceCardList = ({ route }) => {
  const [deviceName, setDeviceName] = useState("");
  const { automationId } = route.params;
  const [modalAddRoomVisible, setAddRoomModal] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);

  const toggleAddRoomModal = () => {
    setAddRoomModal(!modalAddRoomVisible);
  };

  const setRoomDevice = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Devices</Text>
      <ScrollView>
        <View style={styles.cardRow}>
          {connectedDevices.map((device) => {
            return (
              <TouchableOpacity
                key={device.deviceName}
                style={styles.card}
                onPress={() =>
                  handlePress(device.deviceType, device.deviceName)
                }
              >
                {device.deviceType === "Aer Conditionat" && (
                  <>
                    <Entypo
                      name="air"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}
                {device.deviceType === "Bec" && (
                  <>
                    <FontAwesome5
                      name="lightbulb"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}
                {device.deviceType === "Jaluzele" && (
                  <>
                    <MaterialCommunityIcons
                      name="window-shutter"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}
                {device.deviceType === "Masina de Spalat" && (
                  <>
                    <MaterialCommunityIcons
                      name="washing-machine"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}
                {device.deviceType === "Masina de Spalat Vase" && (
                  <>
                    <MaterialCommunityIcons
                      name="dishwasher"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}
                {device.deviceType === "Termostat" && (
                  <>
                    <MaterialIcons
                      name="device-thermostat"
                      size={32}
                      color="black"
                      style={styles.cardIcon}
                    />
                    <Text
                      style={styles.cardText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.deviceName}
                    </Text>
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    { backgroundColor: buttonColor },
                  ]}
                  onPress={() => handleToggle(device.deviceName, device.state)}
                >
                  <Text style={styles.toggleButtonText}>
                    {device.state === "1" ? "On" : "Off"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[styles.addCardButton]}
            onPress={toggleAddRoomModal}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.containerAddRoomModal}>
        <Modal
          visible={modalAddRoomVisible}
          animationType="fade"
          transparent
          onRequestClose={toggleAddRoomModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                width: "80%",
                borderRadius: 10,
              }}
            >
              <Text style={styles.textHeader}>Add a device</Text>

              <View
                style={{
                  marginTop: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Button title="Cancel" onPress={toggleAddRoomModal} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Button title="Done" onPress={setRoomDevice} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
    marginBottom: 100,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addCardButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  searchButton: {
    backgroundColor: "#CCCCCC",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  touchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginRight: 5,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 35,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#0782f9",

    // Set the following properties to achieve transparency or make them not visible
    backgroundColor: "transparent", // or "rgba(0, 0, 0, 0)"
    borderWidth: 0,
    borderColor: "transparent",
    color: "black",
    fontSize: 16,
    backgroundColor: "#C3E8FA",
  },
  connectingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectingText: {
    marginLeft: 8,
    color: "white",
  },
  toggleButton: {
    backgroundColor: "#CCCCCC",
    borderRadius: 5,
    padding: 8,
    marginTop: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AutomationDeviceCardList;
