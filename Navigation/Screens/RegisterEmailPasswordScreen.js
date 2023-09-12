import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const RegisterEmailPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();
  const handleCancel = () => {
    navigation.replace("Login");
  };

  const checkPasswords = () => {
    if (password === "" || confirmPassword === "") {
      return { text: "", color: "black", disabled: true };
    } else if (password !== confirmPassword) {
      return { text: "Parola nu se potriveste", color: "red", disabled: true };
    } else if (password.length < 6) {
      return {
        text: "Parola trebuie sa aiba cel putin 6 caractere",
        color: "red",
        disabled: true,
      };
    } else {
      return { text: "Parola corespunde", color: "green", disabled: false };
    }
  };

  const passwordStatus = checkPasswords();
  const registerButtonDisabled = passwordStatus.disabled;

  const handleRegister = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered in with: ", user.email);
      })
      .catch((error) => alert(error.message));
    navigation.navigate("RegisterName");
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior="padding"
          keyboardVerticalOffset={Platform.select({ ios: 0, android: -350 })}
        >
          <Image
            source={require("../../assets/logo-no-background.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder="ConfirmPassword"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>

          <View>
            <Text style={[styles.statusText, { color: passwordStatus.color }]}>
              {passwordStatus.text}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleRegister}
              style={[
                styles.button,
                registerButtonDisabled && styles.disabledButton,
              ]}
              disabled={registerButtonDisabled}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default RegisterEmailPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: "80%",
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782f9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "#ffffff",
    margin: 5,
    borderColor: "#0782f9",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#0782f9",
    fontWeight: "700",
    fontSize: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: "#d3d3d3",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
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
