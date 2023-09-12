import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
  TextInput,
  Switch,
} from "react-native";
import { auth, database } from "../../firebase";
import { ref, onValue, update } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import SwipeListView from "react-native-swipe-list-view";
import { SelectList } from "react-native-dropdown-select-list";

const AutomationDeviceScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState([]);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [roomsURL, setRoomsUrl] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [modalAutomationVisible, setModalAutomationVisible] = useState(false); // State for the modal visibility
  const navigation = useNavigation();
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [startTime, setStartTime] = useState(""); // Added startTime state
  const [endTime, setEndTime] = useState(""); // Added endTime state

  const data = [
    { key: "1", value: "Bec" },
    { key: "2", value: "Jalizele" },
    { key: "3", value: "Termostat" },
  ];

  const toggleModalAutomationVisible = () => {
    setModalAutomationVisible(!modalAutomationVisible);
    setSelectedDays([]);
  };

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

      const roomsRef = ref(
        database,
        "users/" + uid + "/automations/rutina de dimireata/rooms"
      );
      console.log(roomsRef);
      const roomsListener = onValue(roomsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const roomsArray = [];

        for (let key in firebaseData) {
          roomsArray.push({ id: key, ...firebaseData[key] });
        }

        setRooms(roomsArray);
      });

      return () => {
        roomsListener();
      };
    }, [uid])
  );

  const handleSwitchToggle = (roomId) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, isOn: !room.isOn } : room
      )
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

      const allRoomsRef = ref(database, "users/" + uid + "/devices");
      console.log(allRoomsRef);
      const allRoomsListener = onValue(allRoomsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const allRoomsArray = [];

        for (let key in firebaseData) {
          allRoomsArray.push({ id: key, ...firebaseData[key] });
        }

        setDevices(allRoomsArray);
      });

      return () => {
        allRoomsListener();
      };
    }, [uid])
  );
  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

      const roomsRef = ref(
        database,
        "users/" +
          uid +
          "/automations/rutina de dimireata/rooms/Bucatarie/devices"
      );
      console.log(roomsRef);
      const roomsListener = onValue(roomsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const roomsArray = [];

        for (let key in firebaseData) {
          roomsArray.push({ id: key, ...firebaseData[key] });
        }

        setRooms(roomsArray);
      });

      return () => {
        roomsListener();
      };
    }, [uid])
  );

  const handleAddTime = () => {
    if (startTime && endTime) {
      setStartTimes([...startTimes, startTime]);
      setEndTimes([...endTimes, endTime]);
      setStartTime("");
      setEndTime("");
    }
  };

  const handleCardPress = (roomId, roomName) => {
    navigation.navigate("AutomationDevice", { roomId, roomName });
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")} // Replace with the path to your desired image
      style={styles.containerBackground}
    >
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.headerText}>Dispozitive</Text>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.card}
              onPress={() => handleCardPress(room.id, room.roomType)}
            >
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  <Text style={styles.text}>{room.id}</Text>
                </View>
                <Switch
                  value={room.isOn || false}
                  onValueChange={() => handleSwitchToggle(room.id)}
                />
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.card}
            onPress={toggleModalAutomationVisible}
          >
            <View style={styles.cardContent}>
              <Text style={styles.text}>Adaugă un dispozitiv</Text>
              <Icon name="plus" size={20} color="#000000" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal
        visible={modalAutomationVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModalAutomationVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Selectează un dispozitiv</Text>
            <SelectList
              setSelected={setSelectedDevice}
              data={data}
              save="value"
            />

            {/* Start time input */}
            <Text style={styles.modalLabelText}>Start Time:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="HH:mm"
              value={startTime}
              onChangeText={setStartTime}
            />

            {/* End time input */}
            <Text style={styles.modalLabelText}>End Time:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="HH:mm"
              value={endTime}
              onChangeText={setEndTime}
            />

            {/* Add button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddTime}>
              <Text style={styles.addButtonLabel}>Adauga</Text>
            </TouchableOpacity>

            {/* Display added times */}
            <FlatList
              data={startTimes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.timeItem}>
                  <Text style={styles.timeLabel}>Start Time: {item}</Text>
                  <Text style={styles.timeLabel}>
                    End Time: {endTimes[index]}
                  </Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={toggleModalAutomationVisible}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFFFFF", // Add color for the header text
  },
  container: {
    marginTop: 46,
    marginBottom: 100,
    padding: 16,
  },
  card: {
    backgroundColor: "#ECEBEB",
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16, // Add padding for the card content
  },
  textContent: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 10,
    color: "#000000", // Add color for the card text
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add a semi-transparent background color for the modal
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    width: "80%",
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  roomItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  roomText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#CCCCCC",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 16,
    alignSelf: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0782f9",
    textAlign: "center",
  },
  dayButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0782f9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayButton: {
    backgroundColor: "#0782f9",
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  selectedDayButtonText: {
    color: "#FFFFFF",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  modalLabelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#0782f9",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 16,
    alignSelf: "center",
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  timeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AutomationDeviceScreen;
