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
import AutomationModal from "./AutomationModal";

const AutomationCardList = () => {
  const [automations, setAutomations] = useState([]);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [modalAutomationVisible, setModalAutomationVisible] = useState(false); // State for the modal visibility

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      if (user !== null) {
        setEmail(user.email);
        setUid(user.uid);
      }

      const automationsRef = ref(database, "users/" + uid + "/automations");
      const automationsListener = onValue(automationsRef, (snapshot) => {
        const firebaseData = snapshot.val();
        const automationsArray = [];

        for (let key in firebaseData) {
          automationsArray.push({ id: key, ...firebaseData[key] });
        }

        setAutomations(automationsArray);
      });

      return () => {
        automationsListener();
      };
    }, [uid])
  );

  const handleCardPress = (automationId) => {
    navigation.navigate("AutomationRooms", { automationId });
  };

  const toggleModalAutomationVisible = () => {
    setModalAutomationVisible(!modalAutomationVisible);
  };

  const handleOnOffPress = (automationId) => {
    const automationRef = ref(
      database,
      `users/${uid}/automations/${automationId}`
    );
    const automation = automations.find((item) => item.id === automationId);

    // Toggle the on/off state
    const updatedAutomation = {
      ...automation,
      on: !automation.on,
    };

    update(automationRef, updatedAutomation);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {automations.map((automation) => (
          <TouchableOpacity
            key={automation.id}
            style={styles.card}
            onPress={() => handleCardPress(automation.id)}
          >
            <View style={styles.cardContent}>
              <View style={styles.textContent}>
                <Text style={styles.text}>{automation.id}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.onOffButton,
                  {
                    backgroundColor: automation.on ? "#78C257" : "#ECEBEB",
                  },
                ]}
                onPress={() => handleOnOffPress(automation.id)}
              >
                <Text style={styles.onOffButtonText}>
                  {automation.on ? "On" : "Off"}
                </Text>
              </TouchableOpacity>
            </View>

            <AutomationModal
              visible={modalAutomationVisible}
              onclose={toggleModalAutomationVisible}
              onCancel={toggleModalAutomationVisible}
            />
          </TouchableOpacity>
        ))}

        {/* Card with plus sign */}
        <TouchableOpacity
          style={styles.card}
          onPress={toggleModalAutomationVisible}
        >
          <View style={styles.cardContent}>
            <Text style={styles.text}>Adauga rutina</Text>
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
    //padding: 16,
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
  onOffButton: {
    marginTop: 8,
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  onOffButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
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

export default AutomationCardList;
