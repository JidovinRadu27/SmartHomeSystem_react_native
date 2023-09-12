import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AutomationModal from "../../componente/AutomationModal";
import AutomationCardList from "../../componente/AutomationsCardList";

const AutomationScreen = () => {
  const [modalAutomationVisible, setModalAutomationVisible] = useState(false); // State for the modal visibility

  const toggleModalAutomationVisible = () => {
    setModalAutomationVisible(!modalAutomationVisible);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")} // Replace with the path to your desired image
      style={styles.containerBackground}
    >
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.headerText}>Rutine</Text>
          <AutomationCardList />
          <TouchableOpacity
            style={styles.card}
            onPress={toggleModalAutomationVisible}
          ></TouchableOpacity>
        </ScrollView>
      </View>

      <AutomationModal
        visible={modalAutomationVisible}
        onclose={toggleModalAutomationVisible}
        onCancel={toggleModalAutomationVisible}
      />
    </ImageBackground>
  );
};

export default AutomationScreen;

const styles = StyleSheet.create({
  containerBackground: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
});
