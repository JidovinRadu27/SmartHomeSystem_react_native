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
import { ref, set, onValue, off, get, update } from "firebase/database";
import { TextInput } from "react-native-gesture-handler";
import TermostatModal from "./TermostatModal";
import BecModal from "./BecModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const DevicesCardList = ({ route }) => {
  const [deviceName, setDeviceName] = useState("");
  const { roomId, roomName } = route.params;
  const [cards, setCards] = useState([]);
  const [modalAddRoomVisible, setAddRoomModal] = useState(false);
  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [isLoadingDevice, setIsLoadingDevice] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [becModalVisible, setBecModalVisible] = useState(false);
  const [termostatModalVisible, setTermostatModalVisible] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [selectedDeviceName, setSelectedDeviceName] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const navigation = useNavigation();

  const data = [
    { key: "1", value: "Aer Conditionat" },
    { key: "2", value: "Bec" },
    { key: "3", value: "Jaluzele" },
    { key: "4", value: "Masina de Spalat" },
    { key: "5", value: "Masina de Spalat Vase" },
    { key: "6", value: "Termostat" },
  ];

  useEffect(() => {
    const user = auth.currentUser;
    const userId = user.uid;
    const devicesRef = ref(
      database,
      "users/" + userId + "/rooms/" + roomId + "/devices"
    );

    // Get the initial value once
    const getInitialDevices = async () => {
      const snapshot = await get(devicesRef);
      const devices = snapshot.val();

      if (devices) {
        const connectedDevices = Object.keys(devices).map((deviceName) => ({
          deviceName,
          deviceType: devices[deviceName].deviceType,
          state: devices[deviceName].state,
          favourite: devices[deviceName].favourite || 0,
        }));
        setConnectedDevices(connectedDevices);
      } else {
        setConnectedDevices([]);
      }
    };

    // Listen for changes in the devices node
    const devicesListener = onValue(devicesRef, (snapshot) => {
      const devices = snapshot.val();

      if (devices) {
        const connectedDevices = Object.keys(devices).map((deviceName) => ({
          deviceName,
          deviceType: devices[deviceName].deviceType,
          state: devices[deviceName].state,
          favourite: devices[deviceName].favourite || 0,
        }));
        setConnectedDevices(connectedDevices);
      } else {
        setConnectedDevices([]);
      }
    });

    // Get the initial devices once
    getInitialDevices();

    // Clean up the listener when the component unmounts
    return () => {
      off(devicesRef, "value", devicesListener);
    };
  }, [roomId]);

  const toggleAddRoomModal = () => {
    setDeviceName("");
    setSelectedDevice("");
    setIsDeviceSelected(false);
    setAddRoomModal(!modalAddRoomVisible);
  };

  const toggleSearchModal = () => {
    setModalSearchVisible(!modalSearchVisible);
    setIsDeviceSelected(selectedDevice !== null);
  };

  const openModal = (deviceType, deviceName) => {
    console.log(deviceType);
    if (deviceType.trim() === "Bec") {
      setBecModalVisible(true);
    } else if (deviceType.trim() === "Termostat") {
      setTermostatModalVisible(true);
    } else {
      console.log("Nu are nimic");
    }
  };

  const closeModal = () => {
    setBecModalVisible(false);
    setTermostatModalVisible(false);
  };

  const handlePress = (deviceType, deviceName) => {
    setSelectedDeviceType(deviceType);
    setSelectedDeviceName(deviceName);
    openModal(deviceType, deviceName);
  };

  const renderItem = (item) => {
    const handleDeviceSelection = async () => {
      setIsLoadingDevice(true);
      setSelectedDevice(item.value);
      toggleSearchModal();
      // Simulate a delay for the loading screen
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoadingDevice(false);
    };

    return (
      <TouchableOpacity
        key={item.key}
        style={styles.touchableOpacity}
        onPress={handleDeviceSelection}
      >
        <Icon name="bluetooth" size={16} color="blue" style={styles.icon} />
        <Text style={styles.text}>{item.value}</Text>
      </TouchableOpacity>
    );
  };
  const setRoomDevice = () => {
    if (!selectedDevice && !deviceName) {
      Alert.alert("Error", "Alege un nume si selecteaza un device");
    } else if (!selectedDevice) {
      Alert.alert("Error", "Te rog selecteaza un device");
    } else if (!deviceName) {
      Alert.alert("Error", "Te rog introdu un nume pentru device");
    } else {
      const user = auth.currentUser;
      const userId = user.uid;
      set(
        ref(
          database,
          "users/" + userId + "/rooms/" + roomId + "/devices/" + deviceName
        ),
        {
          deviceType: selectedDevice,
          state: "0",
        }
      );
      toggleAddRoomModal();
    }
  };

  const handleFavoritePress = (deviceid) => {
    const user = auth.currentUser;
    const userId = user.uid;
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(deviceid)
        ? prevFavorites.filter((id) => id !== deviceid)
        : [...prevFavorites, deviceid];
      const roomRef = ref(
        database,
        "users/" + userId + "/rooms/" + roomId + "/devices/" + deviceid
      );
      update(roomRef, {
        favourite: updatedFavorites.includes(deviceid) ? 1 : 0,
      });
      return updatedFavorites;
    });
  };

  const handleToggle = (deviceName, currentState) => {
    const user = auth.currentUser;
    const userId = user.uid;
    const deviceRef = ref(
      database,
      "users/" +
        userId +
        "/rooms/" +
        roomId +
        "/devices/" +
        deviceName +
        "/state"
    );

    // Toggle the state based on the current state value
    const newState = currentState === "1" ? "0" : "1";

    // Update the state of the device in the database
    set(deviceRef, newState)
      .then(() => {
        console.log("Device state updated successfully");
      })
      .catch((error) => {
        console.log("Error updating device state: ", error);
      });
  };

  const roomColors = {
    Sufragerie: "#9F2B00",
    Dormitor: "#2F2440",
    Baie: "#21B6A8",
    Bucatarie: "#1A4314",
    Hol: "#F8CF2C",
    Debara: "#000C66",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Dispozitive</Text>
      <ScrollView>
        <View style={styles.cardRow}>
          {connectedDevices.map((device) => {
            switch (roomName) {
              case "Sufragerie":
                buttonColor = device.state === "1" ? "#9F2B00" : "#CCCCCC";
                break;
              case "Dormitor":
                buttonColor = device.state === "1" ? "#2F2440" : "#CCCCCC";
                break;
              case "Baie":
                buttonColor = device.state === "1" ? "#21B6A8" : "#CCCCCC";
                break;
              case "Bucatarie":
                buttonColor = device.state === "1" ? "#1A4314" : "#CCCCCC";
                break;
              case "Hol":
                buttonColor = device.state === "1" ? "#F8CF2C" : "#CCCCCC";
                break;
              case "Debara":
                buttonColor = device.state === "1" ? "#000C66" : "#CCCCCC";
                break;
              default:
                buttonColor = "blue";
            }

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
                    styles.favoriteButton,
                    {
                      backgroundColor:
                        device.favourite === 1 ? "#f9c74f" : "#0782f9",
                    },
                  ]}
                  onPress={() => handleFavoritePress(device.deviceName)}
                >
                  <Icon name="star" size={20} color="#ffffff" />
                </TouchableOpacity>

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
            style={[
              styles.addCardButton,
              { backgroundColor: roomColors[roomName] },
            ]}
            onPress={toggleAddRoomModal}
          >
            <Icon name="plus" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BecModal
        visible={becModalVisible}
        onClose={closeModal}
        roomId={roomId}
        deviceName={selectedDeviceName}
      />
      <TermostatModal
        visible={termostatModalVisible}
        onClose={closeModal}
        roomId={roomId}
        deviceName={selectedDeviceName}
      />

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
              <TextInput
                placeholder="Device name"
                value={deviceName}
                onChangeText={(text) => setDeviceName(text)}
                style={styles.input}
              />
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { backgroundColor: isDeviceSelected ? "#0782f9" : "#CCCCCC" },
                ]}
                onPress={toggleSearchModal}
                disabled={isLoadingDevice}
              >
                {isLoadingDevice ? (
                  <View style={styles.connectingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.connectingText}>Connecting...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    {selectedDevice ? (
                      <>
                        {selectedDevice}
                        {"  "}
                        <Icon name="check-circle" size={20} color="white" />
                      </>
                    ) : (
                      "Search Device"
                    )}
                  </Text>
                )}
              </TouchableOpacity>
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
                  <Button title="Terminat" onPress={setRoomDevice} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={modalSearchVisible}
          animationType="fade"
          transparent
          onRequestClose={toggleSearchModal}
        >
          <View style={styles.modalContainer}>
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                width: "80%",
                height: "90%",
              }}
            >
              <Text style={styles.textHeader}>Caut dispozitiv</Text>
              <ScrollView>
                <Text>Dispozitive conectate:</Text>
                {connectedDevices.length > 0 ? (
                  connectedDevices.map((device) => (
                    <TouchableOpacity
                      key={device.deviceName}
                      style={styles.touchableOpacity}
                      onPress={() => {
                        console.log(device);
                      }}
                    >
                      <Icon
                        name="link"
                        size={16}
                        color="blue"
                        style={styles.icon}
                      />
                      <Text style={[styles.text, { color: "#0782f9" }]}>
                        {device.deviceName}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>Niciun dispozitiv conectat.</Text>
                )}
                <Text>Dispozitive disponibile:</Text>
                {data.map(renderItem)}
              </ScrollView>

              <Button title="Close" onPress={toggleSearchModal} />
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

export default DevicesCardList;
