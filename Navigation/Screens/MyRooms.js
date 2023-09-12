import { StyleSheet, Text, View, ImageBackground } from "react-native";
import React from "react";
import RoomsCardList from "../../componente/RoomsCardList";

const MyRooms = () => {
  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View>
        <RoomsCardList />
      </View>
    </ImageBackground>
  );
};

export default MyRooms;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
});
