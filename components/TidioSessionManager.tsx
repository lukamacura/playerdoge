"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TidioSessionManager() {
  const { user, userData } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && window.tidioChatApi) {
      console.log("🔄 Resetujem Tidio session jer je user promenjen");

      if (userData) {
        // Postavi podatke o korisniku u Tidio
        window.tidioChatApi.setVisitorData({
          name: userData.name,
          email: userData.email,
        });
      }
    }
}, [user?.uid, userData]);

  return null;
}
