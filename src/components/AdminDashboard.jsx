import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  Search,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  UserCheck,
  Shield,
} from "lucide-react";

export default function AdminDashboard({ onBack }) {
  const API_BASE = import.meta.env.VITE_BASE_URL;
  const [view, setView] = useState("dashboard"); // 'login' | 'register' | 'dashboard'

  // Login // register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const originalRobots = robotsMeta?.getAttribute("content");
    robotsMeta?.setAttribute("content", "noindex, nofollow");

    return () => {
      if (originalRobots) {
        robotsMeta?.setAttribute("content", originalRobots);
      }
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userName, password }),
      });
      if (res.ok) {
        setLoading(false);
        setView("dashboard");
      }
      if (res.status == 401) {
        setMessage(res.statusText);
      }
      if (res.status == 500) {
        setMessage(res.statusText);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  const handlerRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });
      if (res.ok) {
        setLoading(false);
        setMessage("");
        setView("login");
      }
      if (res.status == 409) {
        setMessage(res.statusText);
      }
      if (res.status == 404) {
        setMessage(res.statusText);
      }
      if (res.status == 500) {
        setMessage(res.statusText);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);

    console.log(API_BASE);
    try {
      const res = await fetch(`${API_BASE}/orders`, { credentials: "include" });
      console.log(res);
      // if (!res.ok) throw new Error("Failed to fetch orders");
      // const data = await res.json();
      // setOrders(data);
    } catch (err) {
      // console.error(err);
      // // Fallback local storage for demo mode
      // const localOrders = localStorage.getItem("demo_orders");
      // if (localOrders) {
      //   setOrders(JSON.parse(localOrders));
      // } else {
      //   setOrders([]);
      // }
      // showMsg(
      //   "Running in demo/offline mode. Fetching local simulation orders.",
      //   "warning",
      // );
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      showMsg(`Order status updated to ${newStatus}!`, "success");
      fetchOrders();
    } catch (err) {
      console.warn("Backend offline, updating local mock state.");
      // Local update
      const updatedOrders = orders.map((o) => {
        if (o._id === orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      setOrders(updatedOrders);
      localStorage.setItem("demo_orders", JSON.stringify(updatedOrders));
      showMsg(`[Demo Mode] Status updated to ${newStatus}!`, "success");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order record?")) return;

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete order");

      showMsg("Order record deleted.", "success");
      fetchOrders();
    } catch (err) {
      console.warn("Backend offline, deleting local mock state.");
      const updatedOrders = orders.filter((o) => o._id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("demo_orders", JSON.stringify(updatedOrders));
      showMsg("[Demo Mode] Order record deleted.", "success");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    return (
      order.fullname?.toLowerCase().includes(term) ||
      order.email?.toLowerCase().includes(term) ||
      order.phone?.toLowerCase().includes(term) ||
      order.transactionRef?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-container">
      {view === "login" && (
        <div
          style={{
            maxWidth: "300px",
            margin: "50px auto",
            fontFamily: "sans-serif",
          }}
        >
          <h2>Login</h2>
          <form
            onSubmit={handleLoginSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={{ padding: "8px" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "8px" }}
            />
            <div style={{ color: "red" }}>{message}</div>
            <button
              type="submit"
              style={{
                padding: "10px",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </form>
          <div
            className="modeChangeBtn"
            onClick={() => {
              setView(() => "register");
              setMessage("");
            }}
          >
            Wana Register
          </div>
        </div>
      )}

      {view === "register" && (
        <div
          style={{
            maxWidth: "300px",
            margin: "50px auto",
            fontFamily: "sans-serif",
          }}
        >
          <h2>Register</h2>
          <form
            onSubmit={handlerRegisterSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              style={{ padding: "8px" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "8px" }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "8px" }}
            />
            <div style={{ color: "red" }}>{message}</div>
            <button
              type="submit"
              style={{
                padding: "10px",
                background: "#0070f3",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </form>
          <div
            className="modeChangeBtn"
            onClick={() => {
              setView(() => "login");
              setMessage("");
            }}
          >
            Wana Login
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <>
          <div className="back-link" onClick={onBack}>
            <ArrowLeft size={16} /> BACK TO STOREFRONT
          </div>

          <div className="admin-header">
            <div>
              <h1 className="admin-title">
                <Shield
                  size={28}
                  className="logo-accent"
                  style={{
                    display: "inline-block",
                    marginRight: "10px",
                    verticalAlign: "middle",
                  }}
                />
                Payments Admin Dashboard
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  marginTop: "5px",
                }}
              >
                Verify manual UPI transactions and manage user delivery.
              </p>
            </div>

            <div className="admin-controls">
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.3)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    padding: "8px 12px 8px 35px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    width: "250px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                onClick={fetchOrders}
                disabled={loading}
                className="btn-table-action"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 12px",
                  background: "var(--bg-tertiary)",
                }}
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                REFRESH
              </button>
            </div>
          </div>

          {message && (
            <div
              style={{
                backgroundColor:
                  message.type === "warning"
                    ? "rgba(245, 158, 11, 0.1)"
                    : "rgba(0, 255, 102, 0.1)",
                border: `1px solid ${message.type === "warning" ? "#f59e0b" : "#00ff66"}`,
                padding: "12px 20px",
                borderRadius: "4px",
                color: message.type === "warning" ? "#f59e0b" : "#00ff66",
                fontSize: "0.85rem",
                marginBottom: "20px",
              }}
            >
              {message.text}
            </div>
          )}

          {loading && orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-secondary)",
              }}
            >
              <RefreshCw
                size={36}
                className="animate-spin logo-accent"
                style={{ margin: "0 auto 15px" }}
              />
              <span>Loading orders from database...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                border: "1px dashed var(--border-color)",
                borderRadius: "6px",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <p style={{ fontSize: "1.1rem" }}>No order records found.</p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "5px",
                }}
              >
                Make sure your backend is running or submit a test order from
                the checkout.
              </p>
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer Details</th>
                    <th>Billing Address</th>
                    <th>Transaction Ref</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      {/* Date */}
                      <td
                        style={{
                          whiteSpace: "nowrap",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {new Date(
                          order.createdAt || order.date,
                        ).toLocaleDateString()}{" "}
                        <br />
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {new Date(
                            order.createdAt || order.date,
                          ).toLocaleTimeString()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td>
                        <strong style={{ fontSize: "0.95rem", color: "#fff" }}>
                          {order.fullname}
                        </strong>
                        <div
                          style={{
                            marginTop: "4px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Email: {order.email} <br />
                          Phone: {order.phone}
                        </div>
                      </td>

                      {/* Address */}
                      <td style={{ color: "var(--text-secondary)" }}>
                        {order.address} <br />
                        {order.city}, {order.zip} ({order.country})
                      </td>

                      {/* UPI Ref */}
                      <td>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.9rem",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          {order.transactionRef}
                        </span>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            marginTop: "4px",
                          }}
                        >
                          Method: {order.paymentMethod?.toUpperCase()}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order._id, "contacted")
                              }
                              className="btn-table-action"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <UserCheck size={12} /> Contacted
                            </button>
                          )}

                          {order.status === "contacted" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order._id, "completed")
                              }
                              className="btn-table-action"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <CheckCircle2 size={12} /> Complete
                            </button>
                          )}

                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="btn-table-action"
                            style={{
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              color: "#ef4444",
                            }}
                            title="Delete record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
