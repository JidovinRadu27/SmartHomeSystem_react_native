import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { auth, database } from "../firebase";
import { ref, onValue, onChildChanged } from "firebase/database";

const SensorAlert = () => {
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [previousSensorStates, setPreviousSensorStates] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user !== null) {
      setEmail(user.email);
      setUid(user.uid);
    }
  }, []);

  useEffect(() => {
    if (uid) {
      const userRef = ref(database, "users/" + uid);
      const handleSensorStateChange = onValue(userRef, (snapshot) => {
        const user = snapshot.val();
        if (user && user.rooms) {
          Object.values(user.rooms).forEach((room) => {
            if (room.sensors) {
              Object.values(room.sensors).forEach((sensor) => {
                if (
                  (sensor.sensorType === "Senzor de fum" ||
                    sensor.sensorType === "Senzor de gaz") &&
                  sensor.state === "1"
                ) {
                  Alert.alert(
                    "Sensor State Changed",
                    `The ${sensor.sensorType} sensor state changed from 0 to 1 in room ${room.roomType}.`
                  );
                }
              });
            }
          });
        }
      });

      onChildChanged(userRef, handleSensorStateChange);

      return () => {
        userRef.off("value", handleSensorStateChange);
      };
    }
  }, [uid]);

  // useEffect(() => {
  //   if (uid) {
  //     const userRef = ref(database, "users/" + uid);
  //     const handleSensorStateChange = onValue(userRef, (snapshot) => {
  //       const user = snapshot.val();
  //       console.log(user);
  //       if (user && user.rooms) {
  //         Object.values(user.rooms).forEach((room) => {
  //           if (room.sensors) {
  //             Object.values(room.sensors).forEach((sensor) => {
  //               console.log(sensor.sensorType);
  //               if (
  //                 (sensor.sensorType === "Senzor de fum" ||
  //                   sensor.sensorType === "Senzor de gaz") &&
  //                 sensor.state === "1"
  //               ) {
  //                 Alert.alert(
  //                   "Sensor State Changed",
  //                   `The ${sensor.sensorType} sensor state changed from 0 to 1 in room ${room.roomType}.`
  //                 );
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });

  //     onChildChanged(userRef, handleSensorStateChange);

  //     console.log("cacat");
  //     return () => {
  //       // Clean up the event listener when the component unmounts
  //       userRef.off("value", handleSensorStateChange);
  //     };
  //   }
  // }, [uid]);

  return null; // or return any desired component if needed
};

export default SensorAlert;
