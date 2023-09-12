import "@firebase/auth";
import "@firebase/database";
import { getDatabase, ref, set } from "firebase/database";
import { database, auth } from "../firebase";

class Automation {
  constructor(name, devices) {
    this.name = name;
    this.devices = devices;
  }

  setAutomationData() {
    const user = auth.currentUser;
    const userId = user.uid;
    const automationRef = ref(
      database,
      "users/" + userId + "/automations/" + this.name
    );
    set(automationRef, { devices: this.devices });
  }
}

export default Automation;
