import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserData {
  coins: number;
  email: string;
  name: string;
  creatorCode: string | null;
  freePackageStatus: "ineligible" | "pending" | "granted";
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const defaultUserData: UserData = {
  coins: 0,
  email: "",
  name: "",
  creatorCode: null,
  freePackageStatus: "ineligible",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeDoc?.();
      setUser(firebaseUser);

      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        unsubscribeDoc = onSnapshot(
          docRef,
          (snap) => {
            setLoading(false);
            if (snap.exists()) {
              const d = snap.data();
              setUserData({
                coins: d.coins ?? 0,
                email: d.email ?? "",
                name: d.name ?? "",
                creatorCode: d.creatorCode ?? null,
                freePackageStatus: d.freePackageStatus ?? "ineligible",
              });
            } else {
              setUserData(defaultUserData);
            }
          },
          () => {
            setLoading(false);
            setUserData(defaultUserData);
          }
        );
      } else {
        setLoading(false);
        setUserData(null);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDoc?.();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
