import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import MotionSlider from "react-native-motion-slider";
import { useFocusEffect } from "@react-navigation/native";
import { auth, database } from "../firebase";
import { ref, update, onValue, off } from "firebase/database";

const TermostatModal = ({ visible, onClose, roomId, deviceName }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [lastTemperature, setLastTemperature] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const user = auth.currentUser;
      const userId = user.uid;
      const deviceRef = ref(
        database,
        "users/" +
          userId +
          "/rooms/" +
          roomId +
          "/devices/" +
          deviceName +
          "/intencity"
      );

      const handleSnapshot = (snapshot) => {
        if (snapshot.exists()) {
          const intensity = snapshot.val();
          setSliderValue(intensity);
          setLastTemperature(Math.floor(intensity));
        }
      };

      onValue(deviceRef, handleSnapshot);

      return () => {
        off(deviceRef, "value", handleSnapshot);
      };
    }, [roomId, deviceName])
  );

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSave = () => {
    const user = auth.currentUser;
    const userId = user.uid;
    const deviceRef = ref(
      database,
      "users/" + userId + "/rooms/" + roomId + "/devices/" + deviceName
    );

    update(deviceRef, { intencity: sliderValue })
      .then(() => {
        console.log("Slider value uploaded to the database:", sliderValue);
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading slider value:", error);
      });
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.sliderContainer}>
            <Text style={styles.textHeader}>Seteaza luminozitatea</Text>
            <MotionSlider
              min={18}
              max={35}
              value={22}
              decimalPlaces={0}
              units={"℃"}
              backgroundColor={["rgb(29, 29, 228)", "rgb(235, 16, 45)"]}
              useNativeDriver={true}
              onValueChanged={handleSliderChange}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "80%", // Adjust the width as per your requirement
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  sliderContainer: {
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  textHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
};

export default TermostatModal;
