import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("rememberMe")
      .then((value) => {
        if (value !== null) {
          setRememberMe(JSON.parse(value));
          if (JSON.parse(value)) {
            AsyncStorage.multiGet(["email", "password"]).then((values) => {
              const storedEmail = values[0][1];
              const storedPassword = values[1][1];
              setEmail(storedEmail);
              setPassword(storedPassword);
              if (email != null) console.log(email);

              console.log(password);
              if (storedEmail && storedPassword) {
                //handleLogin();
              }
            });
          }
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Check if the "rememberMe" value is stored in AsyncStorage
    AsyncStorage.getItem("rememberMe")
      .then((value) => {
        if (value !== null) {
          setRememberMe(JSON.parse(value));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Store the "rememberMe" value in AsyncStorage
    AsyncStorage.setItem("rememberMe", JSON.stringify(rememberMe)).catch(
      (error) => console.log(error)
    );
    console.log(rememberMe);
  }, [rememberMe]);

  const handleSignUp = () => {
    AsyncStorage.removeItem("rememberMe").catch((error) => console.log(error));
    navigation.replace("RegisterEmailPassword");
  };

  const handleLogin = () => {
    if (rememberMe) {
      AsyncStorage.multiSet([
        ["email", email],
        ["password", password],
      ]).catch((error) => console.log(error));
    } else {
      AsyncStorage.multiRemove(["email", "password"]).catch((error) =>
        console.log(error)
      );
    }
    if (email && password) {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Logged in with:", user.email);

          setLoading(false);
          navigation.navigate("MainContainer");
        })
        .catch((error) => {
          setLoading(false);
          alert(error.message);
        });
    } else {
      alert("Please enter both email and password.");
    }
  };

  const handleRememberMeToggle = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
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
        </View>

        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeText}>Remember Me</Text>
          <TouchableOpacity
            style={styles.rememberMeCheckbox}
            onPress={handleRememberMeToggle}
          >
            {rememberMe && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rememberMeText: {
    marginRight: 10,
  },
  rememberMeCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#0782f9",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#0782f9",
    borderRadius: 3,
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
  logo: {
    width: 200, // Set the width as per your requirement
    height: 200, // Set the height as per your requirement
    marginBottom: 30, // Adjust the margin as needed
  },
  background: {
    flex: 1,
    resizeMode: "cover", // or "stretch" for different image resize modes
  },
});
