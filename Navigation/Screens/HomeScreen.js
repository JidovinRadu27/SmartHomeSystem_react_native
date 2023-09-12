import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import CircleButton from "../../componente/AddButton";
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-gesture-handler";
import Room from "../../Objects/Room";
import FavouriteRooms from "../../componente/FavouriteRooms";
import SensorAlert from "../../componente/SensorAlert";
import ProfilModal from "../../componente/ProfilModal";
import FavoriteDevicesList from "../../componente/FavoriteDeviceList";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [modalAddRoomVisible, setAddRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isFormValid, setFormValid] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // State for the profile image URL
  const [modalProfilVisible, setModalProfilVisible] = useState(false); // State for the modal visibility

  const data = [
    { key: "1", value: "Sufragerie" },
    { key: "2", value: "Dormitor" },
    { key: "3", value: "Bucatarie" },
    { key: "4", value: "Baie" },
    { key: "5", value: "Hol" },
    { key: "6", value: "Debara" },
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  useEffect(() => {
    if (uid !== "") {
      const starCountRef = ref(database, "users/" + uid + "/username");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setName(data);
      });

      const photoRef = ref(database, "users/" + uid + "/photo");
      onValue(photoRef, (snapshot) => {
        const dataPhoto = snapshot.val();
        setProfileImage(dataPhoto);
      });
    }
  }, [uid]);

  useEffect(() => {
    const roomsRef = ref(database, "users/" + uid + "/rooms");
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
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleAddRoomModal = () => {
    setRoomName("");
    console.log(name);

    setAddRoomModal(!modalAddRoomVisible);
  };
  const toggleModalProfilVisible = () => {
    setModalProfilVisible(!modalProfilVisible);
  };

  const handleAddRoom = () => {
    const roomExists = rooms.some((room) => room.id === roomName);

    if (roomExists) {
      Alert.alert("Error", `Deja exista o camera cu nemele de "${roomName}"`, [
        { text: "OK" },
      ]);
      console.log(rooms);
    } else {
      const room = new Room(selectedRoom, roomName, [], [], 0);
      room.setRoomData();
      toggleAddRoomModal();
    }
  };

  useEffect(() => {
    // Check if both fields are completed
    if (selectedRoom !== "" && roomName !== "") {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [selectedRoom, roomName]);

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <SensorAlert />
      <View style={styles.container}>
        <View style={styles.containerHelloUser}>
          <TouchableOpacity onPress={toggleModalProfilVisible}>
            <View style={styles.profileImageContainer}>
              {/* Display the profile image */}
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Hello, {name}!</Text>
          </View>
          <View style={styles.addButtonContainer}>
            <CircleButton
              style={styles.buttonAdd}
              onPress={toggleAddRoomModal}
            />
          </View>
        </View>

        <ProfilModal
          visible={modalProfilVisible}
          onclose={toggleModalProfilVisible}
          onCancel={toggleModalProfilVisible}
        />

        <View style={styles.containerCamereFavorite}>
          <Text style={styles.textCamereFavorite}>Camere favorite</Text>
        </View>
        <View>
          <FavouriteRooms />
        </View>

        <View style={styles.containerCamereFavorite}>
          <Text style={styles.textCamereFavorite}>Dispozitive favorite</Text>
        </View>
        <View>
          <FavoriteDevicesList />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        <View style={styles.containerAddRoomModal}>
          <Modal
            visible={modalAddRoomVisible}
            animationType="slide"
            transparent
            onRequestClose={toggleAddRoomModal}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
                margin: 20,
              }}
            >
              <View style={{ backgroundColor: "white", padding: 16 }}>
                <Text style={styles.text}>Adaugă o cameră</Text>

                <SelectList
                  setSelected={setSelectedRoom}
                  data={data}
                  save="value"
                />

                <TextInput
                  placeholder="Nume cameră"
                  value={roomName}
                  onChangeText={(text) => setRoomName(text)}
                  style={styles.input}
                />

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
                    <Button
                      title="Done"
                      onPress={handleAddRoom}
                      disabled={!isFormValid}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782f9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 40,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  containerHelloUser: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    height: 64,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  text: {
    fontSize: 33,
    fontWeight: "bold",
    color: "#000",
  },
  buttonAdd: {
    position: "absolute",
    top: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0782f9",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonContainer: {
    marginLeft: 8,
  },
  containerAddRoomModal: {
    padding: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  containerHelloUser: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 70,
  },
  textContainer: {
    flex: 1,
  },
  textCamereFavorite: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  containerCamereFavorite: {
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  background: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    overflow: "hidden",
    borderColor: "#0782f9",
    borderWidth: 2,
    overflow: "hidden",
  },
  profileImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
});
