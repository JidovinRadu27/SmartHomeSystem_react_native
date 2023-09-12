import React, { useState, useEffect } from "react";
import { View, Modal, Text, Button, StyleSheet } from "react-native";
import { auth, database } from "../firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import { TextInput } from "react-native-gesture-handler";
import Automation from "../Objects/Automation";

const AutomationModal = ({ visible, onClose, onCancel }) => {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [automationName, setAutomationName] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  const handleCancel = () => {
    onCancel();
  };

  const handleDone = async () => {
    const user = auth.currentUser;
    const userId = user.uid;
    const automationRef = ref(database, "users/" + userId + "/automations");

    const automation = new Automation(automationName, "devices");
    automation.setAutomationData();
    //set(automationRef, { [newAutomationName]: "" });
    onCancel();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
            alignItems: "center",
            backgroundColor: "white",
            padding: 16,
            width: "80%",
            borderRadius: 10,
          }}
        >
          <Text style={styles.textHeader}>Adauga o rutina</Text>
          <TextInput
            placeholder="Nume rutina"
            value={automationName}
            onChangeText={(text) => setAutomationName(text)}
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
              <Button title="Cancel" onPress={handleCancel} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Button title="Done" onPress={handleDone} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  dropdownContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
  },
  noDevicesText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    paddingVertical: 8,
    textAlign: "center",
  },
  selectedTimesContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 12,
  },
  selectedTimesLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedTimeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  addButtonContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 12,
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
});

export default AutomationModal;
