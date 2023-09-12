import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import DevicesCardList from "../../componente/DevicesCardList";
import SensorsCardList from "../../componente/SensorsCardList";
import Icon from "react-native-vector-icons/FontAwesome";
import { database, auth } from "../../firebase";
import { getDatabase, ref, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const RoomScreen = ({ route }) => {
  const { roomId, roomName } = route.params;
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const navigation = useNavigation();

  let backgroundImage;
  switch (roomName) {
    case "Sufragerie":
      backgroundImage = require("../../assets/backgroudsufragerie.png");
      break;
    case "Dormitor":
      backgroundImage = require("../../assets/backgrouddormitor.png");
      break;
    case "Bucatarie":
      backgroundImage = require("../../assets/backgroudbucatarie.png");
      break;
    case "Baie":
      backgroundImage = require("../../assets/backgroudbaie.png");
      break;
    case "Hol":
      backgroundImage = require("../../assets/backgrouddebara.png");
      break;
    case "Debara":
      backgroundImage = require("../../assets/backgroudhol.png");
      break;
    default:
      backgroundImage = require("../../assets/background.png");
      break;
  }
  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  const handleDeleteRoom = () => {
    // Show confirmation dialog
    Alert.alert("Sterge camera", "Esti sigur ca vrei sa stergi camera?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sterge",
        style: "destructive",
        onPress: () => deleteRoom(),
      },
    ]);
  };

  const deleteRoom = () => {
    const database = getDatabase();
    const roomRef = ref(database, "users/" + uid + "/rooms/" + roomId);

    remove(roomRef)
      .then(() => {
        console.log("Room deleted successfully");
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
      });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{roomId}</Text>
          </View>
          <TouchableOpacity
            onPress={handleDeleteRoom}
            style={styles.deleteButton}
          >
            <Icon name="trash" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <SensorsCardList route={route} />
        <DevicesCardList route={route} />
      </ScrollView>
    </ImageBackground>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 10,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  container: {
    marginTop: 46,
    marginBottom: 100,
    padding: 16,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});
