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
} from "react-native";
import { auth, database } from "../../firebase";
import { ref, onValue, update } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import SwipeListView from "react-native-swipe-list-view";

const AutomationRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [roomsURL, setRoomsUrl] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [modalAutomationVisible, setModalAutomationVisible] = useState(false); // State for the modal visibility
  const navigation = useNavigation();
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

      const allRoomsRef = ref(database, "users/" + uid + "/rooms");
      console.log(allRoomsRef);
      const allRoomsListener = onValue(allRoomsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const allRoomsArray = [];

        for (let key in firebaseData) {
          allRoomsArray.push({ id: key, ...firebaseData[key] });
        }

        setAllRooms(allRoomsArray);
      });

      return () => {
        allRoomsListener();
      };
    }, [uid])
  );

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
          <Text style={styles.headerText}>Camerele</Text>
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
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.card}
            onPress={toggleModalAutomationVisible}
          >
            <View style={styles.cardContent}>
              <Text style={styles.text}>Adauga o cameră</Text>
              <Icon name="plus" size={20} color="#000000" />
            </View>
          </TouchableOpacity>

          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.selectedDayButton,
                ]}
                onPress={() => {
                  if (selectedDays.includes(day)) {
                    setSelectedDays(
                      selectedDays.filter((selectedDay) => selectedDay !== day)
                    );
                  } else {
                    setSelectedDays([...selectedDays, day]);
                  }
                }}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.selectedDayButtonText,
                  ]}
                >
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
            <Text style={styles.modalHeaderText}>Select Rooms</Text>
            {/* Render a FlatList or any other component to display the rooms */}
            <FlatList
              data={allRooms}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dayItem}
                  onPress={() => {
                    if (selectedDays.includes(item)) {
                      setSelectedDays(
                        selectedDays.filter((day) => day !== item)
                      );
                    } else {
                      setSelectedDays([...selectedDays, item]);
                    }
                  }}
                >
                  <Text style={styles.dayText}>{item}</Text>
                  {selectedDays.includes(item) && (
                    <Icon name="check" size={20} color="#000000" />
                  )}
                </TouchableOpacity>
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
});

export default AutomationRooms;
