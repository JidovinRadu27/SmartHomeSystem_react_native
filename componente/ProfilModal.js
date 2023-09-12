import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, set, update } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ProfilModal = ({ visible, onClose, onCancel }) => {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  useEffect(() => {
    if (uid !== "") {
      const starCountRef = ref(database, "users/" + uid + "/username");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setUserName(data);
      });

      const photoRef = ref(database, "users/" + uid + "/photo");
      onValue(photoRef, (snapshot) => {
        const dataPhoto = snapshot.val();
        setProfileImage(dataPhoto);
      });
    }
  }, [uid]);

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
      setProfileImage(result.uri);
    }
  };

  const handleCancel = () => {
    onCancel();
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDone = () => {
    const updates = {};

    // Update the name in the database
    updates["users/" + uid + "/username"] = userName;

    // Update the photo in the database
    updates["users/" + uid + "/photo"] = profileImage;

    update(ref(database), updates);
    handleCancel();
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
            //justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 16,
            width: "80%",
            borderRadius: 10,
          }}
        >
          <Text style={styles.textHeader}>Editeaza-ti profilul</Text>
          <Text style={styles.text}>Editeaza-ti numele</Text>
          <TextInput
            value={userName}
            onChangeText={(text) => setUserName(text)}
            style={styles.input}
          />
          <Text style={styles.text}>Editeaza-ti poza de profil</Text>
          <TouchableOpacity onPress={handlePhotoSelect}>
            <View style={styles.profileImageContainer}>
              {/* Display the profile image */}
              {profileImage && (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>

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
  input: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#0782f9",

    // Set the following properties to achieve transparency or make them not visible
    backgroundColor: "transparent", // or "rgba(0, 0, 0, 0)"
    borderWidth: 0,
    borderColor: "transparent",
    color: "black",
    fontSize: 16,
    backgroundColor: "#C3E8FA",
    width: "90%",
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 25,
    overflow: "hidden",
    borderColor: "#0782f9",
    borderWidth: 2,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  profileImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  text: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
    marginTop: 20,
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
});

export default ProfilModal;
