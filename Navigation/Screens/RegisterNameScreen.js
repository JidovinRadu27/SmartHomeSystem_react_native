import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import User from "../../Objects/User";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actionsheet";
import { Platform } from "react-native";

const RegisterNameScreen = () => {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNameComplete, setIsNameComplete] = useState(false);
  const [isDateComplete, setIsDateComplete] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);

  const [photoUri, setPhotoUri] = useState(null);

  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
      setIsDateComplete(true);
      console.log(formattedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formattedDate = selectedDate.toLocaleDateString();

  const handleCancel = () => {
    navigation.replace("Login");
  };

  const handleInputChange = (text) => {
    setName(text);
    setIsNameComplete(text.trim().length > 0);
  };

  const handleUserName = () => {
    if (photoUri) {
      const user = new User(name, formattedDate, photoUri);
      user.setUserData();
      navigation.navigate("MainContainer");
    }
  };

  const handlePhotoSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access the camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoUri(result.uri);
      setIsPhotoSelected(true);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={styles.background}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image
          source={require("../../assets/logo-no-background.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={handleInputChange}
            style={styles.input}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <View style={styles.dateContainer}>
              <Text>Data selectata ({formattedDate})</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={showDatepicker}
            title={`Select date (${formattedDate})`}
          />
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handlePhotoSelect}>
            <Text
              style={
                isPhotoSelected
                  ? styles.photoSelectedText
                  : styles.selectPhotoText
              }
            >
              {isPhotoSelected ? "Photo Selected" : "Select Photo"}
            </Text>
          </TouchableOpacity>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.selectedPhoto} />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleUserName}
            style={[
              styles.button,
              isNameComplete && isDateComplete && photoUri
                ? {}
                : { opacity: 0.5 },
            ]}
            disabled={!isNameComplete || !isDateComplete || !photoUri}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterNameScreen;

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
  dateContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    height: 45,
    marginTop: 10,
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
  selectPhotoText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  photoSelectedText: {
    color: "#0782f9", // Set the color to blue
    fontWeight: "700",
    fontSize: 16,
  },
});
