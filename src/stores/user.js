import { defineStore } from "pinia";
import { auth, db } from "@/firebase";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { query, where, collection, onSnapshot } from "firebase/firestore";

export const userStore = defineStore({
  id: "user",
  state: () => ({
    isCheckingAutoLogin: false,
    isWhaleListLoaded: false,
    uid: "",
    name: "",
    email: "",
    whaleList: [],
    firebaseUnsubscribes: {
      whaleList: () => { },
    },
  }),
  getters: {
    isLoggedIn: (state) => state.uid !== "",
  },
  actions: {
    initAuthStateListener() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("get user data", user);
          this.uid = user.uid;
          this.name = user.displayName;
          this.email = user.email;

          this.subscribeWhaleList();
        } else {
          console.log("user logged out.");
        }
      });
    },
    initAutoSignIn() {
      this.isCheckingAutoLogin = true;
      setPersistence(auth, browserLocalPersistence).then(() => {
        this.isCheckingAutoLogin = false;
      });
    },
    signIn() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((credential) => {
          console.log("Sign In Success", credential);
        })
        .catch((error) => {
          console.log("Sign In Error", error);
        });
    },
    signOut() {
      signOut(auth)
        .then(() => {
          console.log("Sign Out Success.");
          this.uid = "";
          this.name = "";
          this.email = "";
        })
        .catch((error) => {
          console.log("Sign Out Error", error);
        });
    },
    subscribeWhaleList() {
      const storeUser = userStore();
      console.log("uid", storeUser.uid);
      this.isFirstLoadingWhaleList = true;

      const q = query(
        collection(db, "whale-user"),
        where("uid", "==", storeUser.uid)
      );
      const unsubWhaleList = onSnapshot(q, (querySnapshot) => {
        this.whaleList = [];
        querySnapshot.forEach((doc) => {
          console.log("whale-user", doc.data());
          const wu = {
            id: doc.id,
            uid: doc.data().uid,
            wid: doc.data().wid,
          };
          this.whaleList.push(wu);
        });
        this.isWhaleListLoaded = true;
      });
      this.firebaseUnsubscribes.whaleList = unsubWhaleList;
    },
    unsubscribe(key) {
      this.firebaseUnsubscribes[key]();
    },
  },
});
