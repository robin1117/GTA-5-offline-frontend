import React, { useEffect, useState } from "react";
import { Mail, Clock, ArrowLeft, MessageSquare, Gamepad2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_BASE_URL;
const SUPPORT_EMAIL = import.meta.env.VITE_EMAIL_SUPPORT || "devins1117@gmail.com";

export default function ThankYouPage({ onBackHome }) {
  const [lastOrder, setLastOrder] = useState({ fullname: "", email: "" });

  async function thankyou() {
    const thanks = await fetch(`${API_BASE}/thankyou`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    let userObj = await thanks.json();
    setLastOrder(userObj);
  }

  useEffect(() => {
    thankyou();
    return () => {};
  }, []);

  return (
    <div className="thank-you-container">
      <div className="hero-tag" style={{ marginBottom: "20px" }}>
        ✓ Order Submitted Successfully
      </div>

      <h1 className="thank-you-title">
        Thank you, <br />
        <span className="thank-you-title-name">{lastOrder.fullname}</span>.
      </h1>

      <p className="thank-you-desc">
        Your manual payment details have been logged in our system. Our support
        staff is verifying the transaction reference against our payments
        dashboard. We will reach out to you shortly.
      </p>

      <div className="info-cards">
        <div className="info-card">
          <Mail className="info-card-icon" size={24} />
          <span className="info-card-label">Confirmation To</span>
          <span className="info-card-value">{lastOrder.email}</span>
          <span className="info-card-value">{lastOrder.phone}</span>
        </div>

        <div className="info-card">
          <Clock className="info-card-icon" size={24} />
          <span className="info-card-label">Expect Contact Within</span>
          <span className="info-card-value">
            A few hours • 24/7 Support Window
          </span>
        </div>
      </div>
      <div className="thank-you-buttons">
        <button className="btn-hero-secondary text-sm" onClick={onBackHome}>
          <ArrowLeft size={16} /> BACK TO HOME
        </button>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=GTA V Offline Setup Support`}
          className="btn-hero-primary text-sm"
          style={{ textDecoration: "none" }}
        >
          <MessageSquare size={16} /> CONTACT SUPPORT
        </a>
      </div>
    </div>
  );
}
