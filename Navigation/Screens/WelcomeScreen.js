import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const handleWelcome = () => {
    navigation.replace("Login");
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo-no-background.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.button} onPress={handleWelcome}>
          <Text style={styles.buttonText}> Let's go! </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  background: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
  logo: {
    width: 200, // Set the width as per your requirement
    height: 200, // Set the height as per your requirement
    marginBottom: 30, // Adjust the margin as needed
  },
});
