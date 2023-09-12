import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import SwipeListView from "react-native-swipe-list-view";

const RoomsCardList = () => {
  const [rooms, setRooms] = useState([]);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [roomsURL, setRoomsUrl] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

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
    }, [uid])
  );

  const handleCardPress = (roomId, roomName) => {
    navigation.navigate("RoomScreen", { roomId, roomName });
  };

  const handleFavoritePress = (roomId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(roomId)
        ? prevFavorites.filter((id) => id !== roomId)
        : [...prevFavorites, roomId];

      const roomRef = ref(database, "users/" + uid + "/rooms/" + roomId);
      update(roomRef, { favourite: updatedFavorites.includes(roomId) ? 1 : 0 });

      return updatedFavorites;
    });
  };

  const roomTypeImageMapping = {
    Sufragerie: require("../assets/MyRoomSufragerie.png"),
    Dormitor: require("../assets/MyRoomDormitor.png"),
    Baie: require("../assets/MyRoomBaie.png"),
    Bucatarie: require("../assets/MyRoomBucatarie.png"),
    Hol: require("../assets/MyRoomHol.png"),
    Debara: require("../assets/MyRoomDebara.png"),
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Camere</Text>
      <ScrollView>
        {rooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.card}
            onPress={() => handleCardPress(room.id, room.roomType)}
          >
            <ImageBackground
              source={roomTypeImageMapping[room.roomType]}
              style={styles.backgroundImage}
              imageStyle={styles.cardBackground}
            >
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  <Text style={styles.text}>{room.id}</Text>
                  <Text style={styles.text}>{room.roomType}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.favoriteButton,
                    {
                      backgroundColor:
                        room.favourite === 1 ? "#f9c74f" : "#0782f9",
                    },
                  ]}
                  onPress={() => handleFavoritePress(room.id)}
                >
                  <Icon name="star" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {/* Card with plus sign */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AddRoomScreen")}
        >
          <View style={styles.cardContent}>
            <Text style={styles.text}>Adaugă cameră</Text>
            <Icon
              style={{ marginRight: 16 }}
              name="plus"
              size={20}
              color="#000000"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 46,
    marginBottom: 100,
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ECEBEB",
    borderRadius: 20,
    //padding: 1,
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
  },
  favoriteButton: {
    marginTop: 8,
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  cardBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RoomsCardList;
