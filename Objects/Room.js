import "@firebase/auth";
import "@firebase/database";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

class Room {
  constructor(type, name, devices, sensors, favourite) {
    this.type = type;
    this.name = name;
    this.devices = devices;
    this.sensors = sensors;
    this.favourite = favourite;
  }

  addDevice(device) {
    this.devices.push(device);
  }

  setRoomData() {
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;
    console.log(database);
    set(ref(database, "users/" + userId + "/rooms/" + this.name), {
      roomType: this.type,
      devices: this.devices,
      sensors: this.sensors,
      favourite: this.favourite,
    });
  }
}

export default Room;
