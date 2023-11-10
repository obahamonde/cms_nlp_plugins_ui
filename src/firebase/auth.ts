import { initializeApp } from "firebase/app";
import config from "~/firebase/config";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

export const useAuth = () => {
  const { state } = useStore();
  const firebaseApp = initializeApp(config);
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const user = ref<User | null>(null);

  const logIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      state.notifications.push({
        status: "error",
        message: "Error logging in",
      });
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      state.notifications.push({
        status: "error",
        message: "Error logging out",
      });
    }
  };

  onAuthStateChanged(auth, (u) => {
    user.value = u;
    state.user = u;
  });

  return {
    logIn,
    logOut,
    user,
  };
};
