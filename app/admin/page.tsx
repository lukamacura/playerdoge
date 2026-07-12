"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { ADMIN_EMAILS } from "@/lib/adminEmails";
import { statusLabel, type PendingPaymentStatus } from "@/lib/paymentStatus";
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
  CheckCircle2,
  Tag,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Bitcoin,
  HandCoins,
} from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  coins: number;
  creatorCode?: string | null;
}

interface OrderData {
  token: string;
  uid: string;
  userEmail: string;
  orderId: string;
  packId: string;
  coinAmount: number;
  usdValue: number;
  status: PendingPaymentStatus;
  rawStatus: string;
  createdAtMs: number | null;
  creditedAtMs: number | null;
  creditedBy: string | null;
  statusLog: { code: number | null; atMs: number | null; note: string | null }[];
}

type OrderFilter = "all" | "attention" | "pending" | "credited" | "dead";

const ORDER_FILTER_STATUSES: Record<Exclude<OrderFilter, "all">, PendingPaymentStatus[]> = {
  attention: ["verify_failed", "credit_failed"],
  pending: ["initialized", "processing"],
  credited: ["credited"],
  dead: ["expired", "canceled", "rejected"],
};

const ORDER_STATUS_CLS: Record<PendingPaymentStatus, string> = {
  initialized: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  credited: "bg-green-100 text-green-700",
  expired: "bg-gray-200 text-gray-600",
  canceled: "bg-gray-200 text-gray-600",
  rejected: "bg-gray-200 text-gray-600",
  verify_failed: "bg-red-100 text-red-700",
  credit_failed: "bg-red-100 text-red-700",
};

interface TransactionData {
  userEmail: string;
  uid: string;
  game: string;
  amount: number;
  timestampMs: number;
  creatorCode?: string | null;
  isFreeBonus?: boolean;
  paymentMethod?: "crypto" | "manual";
  usdValue?: number;
}

interface CreatorData {
  code: string;
  displayName: string;
  active: boolean;
  commissionPct: number;
  totalReferredUsers: number;
  totalReferredRevenueUSD: number;
  createdAt: number | null;
}

interface ConfirmPurchaseState {
  uid: string;
  email: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "transactions" | "creators" | "orders">("users");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txMethodFilter, setTxMethodFilter] = useState<"all" | "crypto" | "manual">("all");
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [confirmCredit, setConfirmCredit] = useState<string | null>(null);
  const [creditingToken, setCreditingToken] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // Confirm Purchase modal state
  const [confirmPurchase, setConfirmPurchase] = useState<ConfirmPurchaseState | null>(null);
  const [cpCoinAmount, setCpCoinAmount] = useState("");
  const [cpUsdValue, setCpUsdValue] = useState("");
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email || "")) {
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
        <p className="text-3xl font-bold text-[#1d1d1d] text-center">Access Denied</p>
        <p className="text-sm text-[#1d1d1d]/60">You are not authorized to view this page.</p>
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

  const handleTabChange = (tab: "users" | "transactions" | "creators" | "orders") => {
    setActiveTab(tab);
    if (tab === "transactions" && transactions.length === 0) {
      setTxLoading(true);
      fetch("/api/admin/transactions")
        .then((res) => res.json())
        .then((data) => {
          setTransactions(Array.isArray(data) ? data : []);
          setTxLoading(false);
        });
    }
    if (tab === "creators" && creators.length === 0) {
      setCreatorsLoading(true);
      fetch("/api/admin/creators")
        .then((res) => res.json())
        .then((data) => {
          setCreators(Array.isArray(data) ? data : []);
          setCreatorsLoading(false);
        });
    }
    if (tab === "orders" && orders.length === 0) {
      loadOrders();
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const idToken = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setOrdersError(data.error ?? "Failed to load orders");
      } else {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      }
    } catch {
      setOrdersError("Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const creditOrder = async (token: string) => {
    setCreditingToken(token);
    setOrdersError("");
    try {
      const idToken = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/orders/credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ token }),
      });
      if (res.ok || res.status === 409) {
        // 409 means it was already credited — reflect that either way.
        setOrders((prev) =>
          prev.map((o) =>
            o.token === token ? { ...o, status: "credited", creditedBy: "admin" } : o
          )
        );
      } else {
        const d = await res.json().catch(() => ({}));
        setOrdersError(d.error ?? "Failed to credit order");
      }
    } catch {
      setOrdersError("Failed to credit order");
    } finally {
      setCreditingToken(null);
      setConfirmCredit(null);
    }
  };

  const openConfirmPurchase = (user: UserData) => {
    setConfirmPurchase({ uid: user.uid, email: user.email });
    setCpCoinAmount("");
    setCpUsdValue("");
    setCpError("");
  };

  const submitConfirmPurchase = async () => {
    if (!confirmPurchase) return;
    const coins = Number(cpCoinAmount);
    if (!coins || coins <= 0) {
      setCpError("Enter a valid coin amount");
      return;
    }
    setCpLoading(true);
    setCpError("");
    try {
      const res = await fetch("/api/admin/confirmPurchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: confirmPurchase.uid,
          coinAmount: coins,
          usdValue: Number(cpUsdValue) || 0,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setCpError(d.error ?? "Failed to confirm purchase");
      } else {
        // Refresh user list to reflect updated coins
        fetch("/api/admin/users")
          .then((r) => r.json())
          .then(setUsers);
        setConfirmPurchase(null);
      }
    } catch {
      setCpError("Something went wrong");
    } finally {
      setCpLoading(false);
    }
  };

  const toggleCreatorActive = async (code: string, active: boolean) => {
    await fetch("/api/admin/creators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, active }),
    });
    setCreators(creators.map((c) => (c.code === code ? { ...c, active } : c)));
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
          {(["users", "orders", "transactions", "creators"] as const).map((tab) => {
            const icons = { users: <Users size={15} />, orders: <Wallet size={15} />, transactions: <Receipt size={15} />, creators: <Tag size={15} /> };
            const labels = { users: "Users", orders: "Orders", transactions: "Transactions", creators: "Creators" };
            const badge = tab === "users" ? users.length : tab === "orders" && orders.length > 0 ? orders.length : tab === "transactions" && transactions.length > 0 ? transactions.length : tab === "creators" && creators.length > 0 ? creators.length : null;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-[#1d1d1d] text-[#FFEFC4] shadow"
                    : "text-[#1d1d1d]/60 hover:text-[#1d1d1d]"
                }`}
              >
                {icons[tab]}
                {labels[tab]}
                {badge !== null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === tab
                        ? "bg-[#FFEFC4]/20 text-[#FFEFC4]"
                        : "bg-[#1d1d1d]/10 text-[#1d1d1d]/50"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1d1d1d]/40" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-[#1d1d1d]/30 bg-white focus:border-[#1d1d1d] max-w-sm"
              />
            </div>

            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="bg-white border border-[#1d1d1d]/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#FFEFC4] border border-[#1d1d1d]/20 flex items-center justify-center text-sm font-bold text-[#1d1d1d] shrink-0">
                      {getInitial(user.email)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1d1d1d] break-all leading-snug">
                        {user.email}
                      </p>
                      {user.creatorCode && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1d1d1d]/60 mt-0.5">
                          <Tag size={11} className="text-[#1d1d1d]/40" />
                          Referred by <span className="font-mono font-bold">{user.creatorCode}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Coins size={16} className="text-amber-500 shrink-0" />
                    <Input
                      type="number"
                      defaultValue={user.coins}
                      onBlur={(e) => updateCoins(user.uid, Number(e.target.value))}
                      className="w-24 border-[#1d1d1d]/30 text-center font-semibold"
                    />
                  </div>

                  {/* Confirm Purchase */}
                  <button
                    onClick={() => openConfirmPurchase(user)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors shrink-0"
                  >
                    <CheckCircle2 size={13} />
                    Confirm Purchase
                  </button>

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

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#1d1d1d]/40">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-[#1d1d1d]/40">
                <Wallet size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No payment orders found.</p>
                {ordersError && <p className="text-xs text-red-500 mt-2">{ordersError}</p>}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-4 bg-[#1d1d1d]/10 p-1 rounded-lg w-fit flex-wrap">
                  {(["all", "attention", "pending", "credited", "dead"] as const).map((f) => {
                    const count =
                      f === "all"
                        ? orders.length
                        : orders.filter((o) => ORDER_FILTER_STATUSES[f].includes(o.status)).length;
                    const labels: Record<OrderFilter, string> = {
                      all: "All",
                      attention: "Needs attention",
                      pending: "Pending",
                      credited: "Credited",
                      dead: "Expired/Canceled",
                    };
                    return (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                          orderFilter === f
                            ? "bg-[#1d1d1d] text-[#FFEFC4] shadow"
                            : "text-[#1d1d1d]/60 hover:text-[#1d1d1d]"
                        }`}
                      >
                        {labels[f]}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            f === "attention" && count > 0
                              ? "bg-red-100 text-red-700"
                              : orderFilter === f
                                ? "bg-[#FFEFC4]/20 text-[#FFEFC4]"
                                : "bg-[#1d1d1d]/10 text-[#1d1d1d]/50"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {ordersError && <p className="text-xs text-red-500 mb-3">{ordersError}</p>}

                <div className="space-y-2">
                  {orders
                    .filter(
                      (o) =>
                        orderFilter === "all" ||
                        ORDER_FILTER_STATUSES[orderFilter].includes(o.status)
                    )
                    .map((order) => (
                      <div
                        key={order.token}
                        className="bg-white border border-[#1d1d1d]/15 rounded-xl px-4 py-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-[#FFEFC4] border border-[#1d1d1d]/20 flex items-center justify-center text-xs font-bold text-[#1d1d1d] shrink-0">
                              {getInitial(order.userEmail || "?")}
                            </div>
                            <p className="text-sm font-medium text-[#1d1d1d] break-all leading-snug">
                              {order.userEmail}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 text-sm">
                            <Coins size={14} className="text-amber-500" />
                            <span className="font-bold text-[#1d1d1d]">
                              {order.coinAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-[#1d1d1d]/45 ml-1">
                              ${order.usdValue.toFixed(2)}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 w-fit ${ORDER_STATUS_CLS[order.status]}`}
                          >
                            {statusLabel(order.status)}
                            {order.status === "credited" && order.creditedBy === "admin" && " (admin)"}
                          </span>

                          <div className="flex items-center gap-1.5 text-xs text-[#1d1d1d]/45 shrink-0">
                            <CalendarClock size={13} />
                            {order.createdAtMs ? new Date(order.createdAtMs).toLocaleString() : "—"}
                          </div>

                          {order.status !== "credited" &&
                            (confirmCredit === order.token ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-[#1d1d1d]/60">Credit {order.coinAmount.toLocaleString()} coins?</span>
                                <button
                                  onClick={() => creditOrder(order.token)}
                                  disabled={creditingToken === order.token}
                                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                  {creditingToken === order.token ? (
                                    <Loader2 size={12} className="animate-spin" />
                                  ) : (
                                    <CheckCircle2 size={12} />
                                  )}
                                  Yes, credit
                                </button>
                                <button
                                  onClick={() => setConfirmCredit(null)}
                                  className="text-xs px-3 py-1.5 bg-[#1d1d1d]/10 text-[#1d1d1d] rounded-lg font-semibold hover:bg-[#1d1d1d]/20 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmCredit(order.token)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors shrink-0"
                              >
                                <HandCoins size={13} />
                                Credit now
                              </button>
                            ))}

                          <button
                            onClick={() =>
                              setExpandedLog(expandedLog === order.token ? null : order.token)
                            }
                            className="text-xs px-2 py-1.5 text-[#1d1d1d]/40 hover:text-[#1d1d1d] transition-colors shrink-0"
                          >
                            {expandedLog === order.token ? "Hide log" : "Log"}
                            {order.statusLog.length > 0 && ` (${order.statusLog.length})`}
                          </button>
                        </div>

                        {expandedLog === order.token && (
                          <div className="mt-3 pt-3 border-t border-[#1d1d1d]/10 text-xs text-[#1d1d1d]/60 space-y-1">
                            <p className="font-mono text-[10px] text-[#1d1d1d]/40 break-all">
                              order {order.orderId} · pack {order.packId} · raw status: {order.rawStatus}
                            </p>
                            {order.statusLog.length === 0 ? (
                              <p className="italic">No webhook callbacks received for this order.</p>
                            ) : (
                              order.statusLog.map((entry, i) => (
                                <p key={i} className="font-mono text-[11px]">
                                  {entry.atMs ? new Date(entry.atMs).toLocaleString() : "—"}
                                  {entry.code !== null && ` · code ${entry.code}`}
                                  {entry.note && ` · ${entry.note}`}
                                </p>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </>
            )}
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
              <>
                <div className="flex items-center gap-1 mb-4 bg-[#1d1d1d]/10 p-1 rounded-lg w-fit">
                  {(["all", "crypto", "manual"] as const).map((f) => {
                    const count =
                      f === "all"
                        ? transactions.length
                        : transactions.filter((t) => (t.paymentMethod ?? "manual") === f).length;
                    const icon =
                      f === "crypto" ? <Bitcoin size={13} /> : f === "manual" ? <HandCoins size={13} /> : null;
                    return (
                      <button
                        key={f}
                        onClick={() => setTxMethodFilter(f)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                          txMethodFilter === f
                            ? "bg-[#1d1d1d] text-[#FFEFC4] shadow"
                            : "text-[#1d1d1d]/60 hover:text-[#1d1d1d]"
                        }`}
                      >
                        {icon}
                        {f}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            txMethodFilter === f
                              ? "bg-[#FFEFC4]/20 text-[#FFEFC4]"
                              : "bg-[#1d1d1d]/10 text-[#1d1d1d]/50"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              <div className="space-y-2">
                {transactions
                  .filter((tx) => txMethodFilter === "all" || (tx.paymentMethod ?? "manual") === txMethodFilter)
                  .map((tx, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#1d1d1d]/15 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#FFEFC4] border border-[#1d1d1d]/20 flex items-center justify-center text-xs font-bold text-[#1d1d1d] shrink-0">
                        {getInitial(tx.userEmail)}
                      </div>
                      <p className="text-sm font-medium text-[#1d1d1d] break-all leading-snug">
                        {tx.userEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-[#1d1d1d]/70 shrink-0">
                      <Gamepad2 size={14} className="text-[#1d1d1d]/40" />
                      {tx.game}
                      {tx.paymentMethod === "crypto" ? (
                        <span className="flex items-center gap-1 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">
                          <Bitcoin size={10} />
                          Crypto
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] bg-[#1d1d1d]/10 text-[#1d1d1d]/60 px-1.5 py-0.5 rounded-full font-bold">
                          <HandCoins size={10} />
                          Manual
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Coins size={14} className="text-amber-500" />
                      {(() => {
                        const isCredit = tx.game === "Coin Purchase" || tx.isFreeBonus;
                        return (
                          <span className={`text-sm font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                            {isCredit ? `+${tx.amount}` : `-${tx.amount}`}
                          </span>
                        );
                      })()}
                      {tx.isFreeBonus && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold ml-1">
                          Bonus
                        </span>
                      )}
                    </div>

                    {tx.creatorCode && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Tag size={12} className="text-[#1d1d1d]/40" />
                        <span className="text-xs font-semibold text-[#1d1d1d]/60">{tx.creatorCode}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-[#1d1d1d]/45 shrink-0">
                      <CalendarClock size={13} />
                      {new Date(tx.timestampMs).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        )}

        {/* Creators Tab */}
        {activeTab === "creators" && (
          <div>
            {creatorsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#1d1d1d]/40">
                <Loader2 size={32} className="animate-spin" />
                <p className="text-sm">Loading creators...</p>
              </div>
            ) : creators.length === 0 ? (
              <div className="text-center py-16 text-[#1d1d1d]/40">
                <Tag size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No creator codes found.</p>
                <p className="text-xs mt-1">Seed them manually in the Firebase console under <code>creatorCodes/</code>.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {creators.map((creator) => (
                  <div
                    key={creator.code}
                    className="bg-white border border-[#1d1d1d]/15 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1d1d1d] text-sm bg-[#FFEFC4] px-2 py-0.5 rounded">
                          {creator.code}
                        </span>
                        <span className="text-sm text-[#1d1d1d]/70">{creator.displayName}</span>
                      </div>
                      {creator.commissionPct > 0 && (
                        <p className="text-xs text-[#1d1d1d]/40 mt-0.5">{(creator.commissionPct * 100).toFixed(0)}% commission</p>
                      )}
                    </div>

                    <div className="flex items-center gap-5 shrink-0 text-sm">
                      <div className="flex items-center gap-1.5 text-[#1d1d1d]/70">
                        <Users size={14} />
                        <span className="font-semibold">{creator.totalReferredUsers}</span>
                        <span className="text-xs text-[#1d1d1d]/40">users</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#1d1d1d]/70">
                        <Wallet size={14} />
                        <span className="font-semibold">${creator.totalReferredRevenueUSD.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCreatorActive(creator.code, !creator.active)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors shrink-0"
                      style={creator.active
                        ? { borderColor: "#16a34a33", color: "#16a34a", backgroundColor: "#f0fdf4" }
                        : { borderColor: "#d1d5db", color: "#6b7280", backgroundColor: "#f9fafb" }
                      }
                    >
                      {creator.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {creator.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm Purchase Modal */}
      {confirmPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-[#1d1d1d] mb-1">Confirm Purchase</h3>
            <p className="text-xs text-[#1d1d1d]/50 mb-4 break-all">{confirmPurchase.email}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1d1d1d]/60 mb-1 block">
                  Coins to grant <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={cpCoinAmount}
                  onChange={(e) => setCpCoinAmount(e.target.value)}
                  className="border-[#1d1d1d]/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1d1d1d]/60 mb-1 block">
                  USD value paid
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 9.99"
                  value={cpUsdValue}
                  onChange={(e) => setCpUsdValue(e.target.value)}
                  className="border-[#1d1d1d]/30"
                />
                {!cpUsdValue && (
                  <p className="text-xs text-amber-500 mt-1">
                    Leaving this blank will not update creator revenue stats.
                  </p>
                )}
              </div>
            </div>

            {cpError && <p className="text-xs text-red-500 mt-3">{cpError}</p>}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmPurchase(null)}
                className="flex-1 text-sm px-4 py-2 border border-[#1d1d1d]/20 text-[#1d1d1d]/60 rounded-lg hover:bg-[#1d1d1d]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitConfirmPurchase}
                disabled={cpLoading}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm px-4 py-2 bg-[#1d1d1d] text-white rounded-lg font-semibold hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {cpLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
