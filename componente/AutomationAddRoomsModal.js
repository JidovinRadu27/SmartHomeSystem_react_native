import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { TextInput } from "react-native-gesture-handler";

const AutomationAddRoomModal = () => {
  const navigation = useNavigation();
  const [modalAddRoomVisible, setAddRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [RoomName, setRoomName] = useState("");

  const data = [
    { key: "1", value: "Sufragerie" },
    { key: "2", value: "Dormitor" },
    { key: "3", value: "Bucatarie" },
    { key: "4", value: "Baie" },
    { key: "5", value: "Hol" },
    { key: "6", value: "Debara" },
  ];

  const toggleAddRoomModal = () => {
    setAddRoomModal(!modalAddRoomVisible);
  };

  const test = () => {
    console.log(selectedRoom);
    console.log(RoomName);
  };

  return (
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
              placeholder="Room Name"
              value={RoomName}
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
                <Button title="Done" onPress={test} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AutomationAddRoomModal;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
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
});
