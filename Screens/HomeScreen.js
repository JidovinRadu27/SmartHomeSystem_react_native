import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { auth, database } from "../../firebase";
import { getDatabase, ref, onValue } from "firebase/database";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
      console.log("e");
    }
    console.log("nu e");
  }, []);

  useEffect(() => {
    console.log("UID:", uid);
    if (uid !== "") {
      const starCountRef = ref(database, "users/" + uid + "/username");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setName(data);
      });
    }
  }, [uid]);

  const handleSingOut = () => {
    console.log("caca aici e");
    console.log(name);
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHelloUser}>
        <Text style={styles.text}>Hello, {name} !</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSingOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
  containerHelloUser: {
    backgroundColor: "#E6E6E6",
    width: "100%",
    height: 64,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 30,
  },
});
