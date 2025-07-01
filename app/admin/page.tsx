"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserData {
  uid: string;
  email: string;
  coins: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const allowedAdmins = ["luka.xzy@gmail.com", "ivan.emi010@gmail.com"];

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && allowedAdmins.includes(user.email || "")) {
        setAuthorized(true);
        fetch("/api/admin/users")
          .then((res) => res.json())
          .then(setUsers);
      } else {
        setAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (authorized === null) {
    return <p className="text-center mt-10">Provera pristupa...</p>;
  }

  if (!authorized) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-6xl font-montserrat text-center mt-24 text-red-600 font-extrabold">
          You cannot access this page!
        </p>
      </div>
    );
  }

  const updateCoins = async (uid: string, coins: number) => {
    await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ uid, coins }),
    });
    setUsers(users.map((u) => (u.uid === uid ? { ...u, coins } : u)));
  };

  const deleteUser = async (uid: string) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      body: JSON.stringify({ uid }),
    });
    setUsers(users.filter((u) => u.uid !== uid));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="mt-8 bg-[#FFEFC4] border border-[#1d1d1d]">
        <CardHeader className="">
          <CardTitle className="text-xl sm:text-2xl text-center">
            Admin panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div
              key={user.uid}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border border-[#1d1d1d] rounded-lg"
            >
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <p className="text-sm font-medium break-all">{user.email}</p>
                <Input
                  type="number"
                  defaultValue={user.coins}
                  onBlur={(e) => updateCoins(user.uid, Number(e.target.value))}
                  className="w-full sm:w-32 border border-[#1d1d1d]"
                />
              </div>
              <Button
                variant="destructive"
                className="w-full sm:w-auto border border-[#1d1d1d]"
                onClick={() => deleteUser(user.uid)}
              >
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
