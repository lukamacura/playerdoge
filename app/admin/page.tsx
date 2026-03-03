"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Users,
  Receipt,
  Search,
  Coins,
  Trash2,
  Loader2,
  Gamepad2,
  CalendarClock,
  UserX,
} from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  coins: number;
}

interface TransactionData {
  userEmail: string;
  uid: string;
  game: string;
  amount: number;
  timestampMs: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "transactions">("users");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFEFC4]">
        <Loader2 className="animate-spin text-[#1d1d1d]" size={32} />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFEFC4] gap-4">
        <UserX size={64} className="text-red-600" />
        <p className="text-3xl font-bold text-[#1d1d1d] text-center">
          Access Denied
        </p>
        <p className="text-sm text-[#1d1d1d]/60">
          You are not authorized to view this page.
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
    setConfirmDelete(null);
  };

  const handleTabChange = (tab: "users" | "transactions") => {
    setActiveTab(tab);
    if (tab === "transactions" && transactions.length === 0) {
      setTxLoading(true);
      fetch("/api/admin/transactions")
        .then((res) => res.json())
        .then((data) => {
          setTransactions(data);
          setTxLoading(false);
        });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitial = (email: string) => email.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <div className="bg-[#1d1d1d] text-[#FFEFC4] px-6 py-5 flex items-center gap-3">
        <ShieldCheck size={26} />
        <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        <div className="ml-auto flex items-center gap-4 text-sm text-[#FFEFC4]/60">
          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {users.length} users
          </span>
          {transactions.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Receipt size={14} />
              {transactions.length} transactions
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#1d1d1d]/10 p-1 rounded-xl w-fit">
          <button
            onClick={() => handleTabChange("users")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-[#1d1d1d] text-[#FFEFC4] shadow"
                : "text-[#1d1d1d]/60 hover:text-[#1d1d1d]"
            }`}
          >
            <Users size={15} />
            Users
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "users"
                  ? "bg-[#FFEFC4]/20 text-[#FFEFC4]"
                  : "bg-[#1d1d1d]/10 text-[#1d1d1d]/50"
              }`}
            >
              {users.length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange("transactions")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "transactions"
                ? "bg-[#1d1d1d] text-[#FFEFC4] shadow"
                : "text-[#1d1d1d]/60 hover:text-[#1d1d1d]"
            }`}
          >
            <Receipt size={15} />
            Transactions
            {transactions.length > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === "transactions"
                    ? "bg-[#FFEFC4]/20 text-[#FFEFC4]"
                    : "bg-[#1d1d1d]/10 text-[#1d1d1d]/50"
                }`}
              >
                {transactions.length}
              </span>
            )}
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {/* Search */}
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1d1d1d]/40"
              />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-[#1d1d1d]/30 bg-white focus:border-[#1d1d1d] max-w-sm"
              />
            </div>

            {/* User list */}
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="bg-white border border-[#1d1d1d]/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Avatar + email */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#FFEFC4] border border-[#1d1d1d]/20 flex items-center justify-center text-sm font-bold text-[#1d1d1d] shrink-0">
                      {getInitial(user.email)}
                    </div>
                    <p className="text-sm font-medium text-[#1d1d1d] break-all leading-snug">
                      {user.email}
                    </p>
                  </div>

                  {/* Coins editor */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Coins size={16} className="text-amber-500 shrink-0" />
                    <Input
                      type="number"
                      defaultValue={user.coins}
                      onBlur={(e) =>
                        updateCoins(user.uid, Number(e.target.value))
                      }
                      className="w-24 border-[#1d1d1d]/30 text-center font-semibold"
                    />
                  </div>

                  {/* Delete */}
                  {confirmDelete === user.uid ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#1d1d1d]/60">Sure?</span>
                      <button
                        onClick={() => deleteUser(user.uid)}
                        className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-3 py-1.5 bg-[#1d1d1d]/10 text-[#1d1d1d] rounded-lg font-semibold hover:bg-[#1d1d1d]/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(user.uid)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-16 text-[#1d1d1d]/40">
                  <Users size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No users found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            {txLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#1d1d1d]/40">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 text-[#1d1d1d]/40">
                <Receipt size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No transactions found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#1d1d1d]/15 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    {/* Avatar + email */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFEFC4] border border-[#1d1d1d]/20 flex items-center justify-center text-xs font-bold text-[#1d1d1d] shrink-0">
                        {getInitial(tx.userEmail)}
                      </div>
                      <p className="text-sm font-medium text-[#1d1d1d] break-all leading-snug">
                        {tx.userEmail}
                      </p>
                    </div>

                    {/* Game */}
                    <div className="flex items-center gap-1.5 text-sm text-[#1d1d1d]/70 shrink-0">
                      <Gamepad2 size={14} className="text-[#1d1d1d]/40" />
                      {tx.game}
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Coins size={14} className="text-amber-500" />
                      <span className="text-sm font-bold text-red-600">
                        −{tx.amount}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-[#1d1d1d]/45 shrink-0">
                      <CalendarClock size={13} />
                      {new Date(tx.timestampMs).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
