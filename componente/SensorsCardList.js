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
import { ref, set, onValue, off } from "firebase/database";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const SensorsCardList = ({ route }) => {
  const [sensorName, setSensorName] = useState("");
  const { roomId, roomName } = route.params;
  const [cards, setCards] = useState([]);
  const [modalAddRoomVisible, setAddRoomModal] = useState(false);
  const [modalSearchVisible, setModalSearchVisible] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [isSensorSelected, setIsSensorSelected] = useState(false);
  const [isLoadingSensor, setIsLoadingSensor] = useState(false);
  const [connectedSensors, setConnectedSensors] = useState([]);

  const data = [
    { key: "1", value: "Senzor de fum" },
    { key: "2", value: "Senzor de miscare" },
    { key: "3", value: "Senzor de gaz" },
  ];

  useEffect(() => {
    const user = auth.currentUser;
    const userId = user.uid;
    const sensorsRef = ref(
      database,
      "users/" + userId + "/rooms/" + roomId + "/sensors"
    );
    console.log(sensorsRef);

    // Listen for changes in the devices node
    onValue(sensorsRef, (snapshot) => {
      const sensors = snapshot.val();
      if (sensors) {
        const connectedSensors = Object.keys(sensors).map((sensorName) => ({
          sensorName,
          sensorType: sensors[sensorName].sensorType,
          state: sensors[sensorName].state,
        }));
        setConnectedSensors(connectedSensors);
      } else {
        setConnectedSensors([]);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(sensorsRef);
    };
  }, [roomId]);

  const toggleAddRoomModal = () => {
    setSensorName("");
    setSelectedSensor("");
    setIsSensorSelected(false);
    setAddRoomModal(!modalAddRoomVisible);
  };

  const toggleSearchModal = () => {
    setModalSearchVisible(!modalSearchVisible);
    setIsSensorSelected(selectedSensor !== null);
  };

  const renderItem = (item) => {
    const handleSensorSelection = async () => {
      setIsLoadingSensor(true);
      setSelectedSensor(item.value);
      toggleSearchModal();
      // Simulate a delay for the loading screen
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoadingSensor(false);
    };

    return (
      <TouchableOpacity
        key={item.key}
        style={styles.touchableOpacity}
        onPress={handleSensorSelection}
      >
        <Icon name="bluetooth" size={16} color="blue" style={styles.icon} />
        <Text style={styles.text}>{item.value}</Text>
      </TouchableOpacity>
    );
  };
  const setRoomSensor = () => {
    if (!selectedSensor && !sensorName) {
      Alert.alert("Error", "Alege un nume si selecteaza un senzor");
    } else if (!selectedSensor) {
      Alert.alert("Error", "Te rog selecteaza un senzor");
    } else if (!sensorName) {
      Alert.alert("Error", "Te rog introdu un nume pentru sensor");
    } else {
      const user = auth.currentUser;
      const userId = user.uid;
      set(
        ref(
          database,
          "users/" + userId + "/rooms/" + roomId + "/sensors/" + sensorName
        ),
        {
          sensorType: selectedSensor,
          state: "0",
        }
      );
      toggleAddRoomModal();
    }
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
      <Text style={styles.headerText}>Senzori</Text>
      <ScrollView>
        <View style={styles.cardRow}>
          {connectedSensors.map((sensor) => (
            <TouchableOpacity
              key={sensor.sensorName}
              style={styles.card}
              onPress={() => handleCardPress(sensor.sensorName)}
            >
              {sensor.sensorType === "Senzor de gaz" && (
                <>
                  <MaterialCommunityIcons
                    name="smoke-detector-variant"
                    size={32}
                    color="black"
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardText}>{sensor.sensorName}</Text>
                </>
              )}
              {sensor.sensorType === "Senzor de miscare" && (
                <>
                  <MaterialCommunityIcons
                    name="motion-sensor"
                    size={32}
                    color="black"
                    style={styles.cardIcon}
                  />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardText}>{sensor.sensorName} </Text>
                    {sensor.sensorType === "Senzor de miscare" && (
                      <>
                        {sensor.state === "1" ? (
                          <FontAwesome
                            name="map-marker"
                            size={22}
                            color="green"
                            style={styles.cardIcon}
                          />
                        ) : (
                          <FontAwesome
                            name="map-marker"
                            size={22}
                            color="grey"
                            style={styles.cardIcon}
                          />
                        )}
                      </>
                    )}
                  </View>
                </>
              )}

              {sensor.sensorType === "Senzor de fum" && (
                <>
                  <MaterialCommunityIcons
                    name="smoke"
                    size={32}
                    color="black"
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardText}>{sensor.sensorName}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
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
              <Text style={styles.textHeader}>Add a sensor</Text>
              <TextInput
                placeholder="Sensor name"
                value={sensorName}
                onChangeText={(text) => setSensorName(text)}
                style={styles.input}
              />
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { backgroundColor: isSensorSelected ? "#0782f9" : "#CCCCCC" },
                ]}
                onPress={toggleSearchModal}
                disabled={isLoadingSensor}
              >
                {isLoadingSensor ? (
                  <View style={styles.connectingContainer}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.connectingText}>Connecting...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    {selectedSensor ? (
                      <>
                        {selectedSensor}
                        {"  "}
                        <Icon name="check-circle" size={20} color="white" />
                      </>
                    ) : (
                      "Search Sensor"
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
                  <Button title="Done" onPress={setRoomSensor} />
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
              style={{ backgroundColor: "white", padding: 16, width: "80%" }}
            >
              <Text style={styles.textHeader}>Cauta senzori</Text>
              <Text>Senzori conectati:</Text>
              {connectedSensors.length > 0 ? (
                connectedSensors.map((sensor) => (
                  <TouchableOpacity
                    key={sensor.sensorName}
                    style={styles.touchableOpacity}
                    onPress={() => {
                      console.log(sensor);
                    }}
                  >
                    <Icon
                      name="link"
                      size={16}
                      color="blue"
                      style={styles.icon}
                    />
                    <Text style={[styles.text, { color: "#0782f9" }]}>
                      {sensor.sensorName}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>Niciun senzor conectat.</Text>
              )}
              <Text>Senzori disponibili:</Text>
              {data.map(renderItem)}
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
    marginBottom: 5,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 16,
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
    backgroundColor: "#0782f9",
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
  cardTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SensorsCardList;
