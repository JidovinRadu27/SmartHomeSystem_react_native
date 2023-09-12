import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

class User {
  constructor(name, birthday, photo) {
    this.name = name;
    this.birthday = birthday;
    this.photo = photo;
  }

  setUserData() {
    const database = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;
    console.log(database);
    set(ref(database, "users/" + userId), {
      username: this.name,
      birthday: this.birthday,
      photo: this.photo,
    });
  }
}

export default User;
