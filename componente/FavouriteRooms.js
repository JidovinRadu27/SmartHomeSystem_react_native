import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const FavouriteRooms = () => {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [uid, setUid] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setUid(user.uid);
      }

      const roomsRef = ref(database, "users/" + uid + "/rooms");
      const roomsListener = onValue(roomsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const roomsArray = [];

        for (let key in firebaseData) {
          if (firebaseData[key].favourite === 1) {
            roomsArray.push({ id: key, ...firebaseData[key] });
          }
        }

        setFavoriteRooms(roomsArray);
      });

      return () => {
        roomsListener();
      };
    }, [uid])
  );

  const handleCardPress = (roomId, roomName) => {
    navigation.navigate("RoomScreen", { roomId, roomName });
  };

  const renderCard = (room) => {
    let cardStyle = styles.card;
    let backgroundImage = null;

    if (room.roomType === "Sufragerie") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/sufrageriePhoto.png");
    } else if (room.roomType === "Baie") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/baie.png");
    } else if (room.roomType === "Dormitor") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/dormitor.png");
    } else if (room.roomType === "Bucatarie") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/bucatarie.png");
    } else if (room.roomType === "Hol") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/hol.png");
    } else if (room.roomType === "Debara") {
      cardStyle = styles.cardWithBackground;
      backgroundImage = require("../assets/debara.png");
    }

    let hasSensor = false;
    const hasSensorVerification = Object.values(room.sensors || {}).some(
      (sensor) =>
        sensor.sensorType === "Senzor de miscare" && sensor.state === "1"
    );
    if (hasSensorVerification) {
      console.log("aiiiiciiii");
      hasSensor = true;
    }

    return (
      <TouchableOpacity
        key={room.id}
        style={[cardStyle, styles.cardSpacing]}
        onPress={() => handleCardPress(room.id, room.roomType)}
      >
        {backgroundImage && (
          <Image source={backgroundImage} style={styles.backgroundImage} />
        )}
        <View style={styles.textContent}>
          <Text style={styles.text}>
            {room.id}{" "}
            {hasSensor && (
              <FontAwesome name="map-marker" size={24} color="green" />
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  ``;
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        {favoriteRooms.map((room) => renderCard(room))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginTop: 46,
    marginBottom: 0,
    padding: 16,
  },
  card: {
    width: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    marginBottom: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  leftCard: {
    marginLeft: 16,
  },
  textContent: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  favoriteButton: {
    marginTop: 8,
    borderRadius: 5,
    padding: 8,
  },
  cardSpacing: {
    marginRight: 12,
  },
});

export default FavouriteRooms;
