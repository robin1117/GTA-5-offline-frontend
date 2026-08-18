import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Info,
} from "lucide-react";
import { AMOUNT, FORMATTED_AMOUNT } from "../config/pricing";

const API_BASE = import.meta.env.VITE_BASE_URL;
const BASE_AMOUNT = 899;
const DISCOUNT_AMOUNT = Math.max(BASE_AMOUNT - Number(AMOUNT), 0);
const FORMATTED_BASE_AMOUNT = `₹${BASE_AMOUNT}`;
const FORMATTED_DISCOUNT_AMOUNT = `₹${DISCOUNT_AMOUNT}`;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage({
  setShowOtpPopup,
  showOtpPopup,
  onBack,
  onSubmitOrder,
  isSubmitting,
  verifyOTP,
  setIsSubmitting,
  setMessage,
  setView,
  clearRecaptcha,
}) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    country: "India",
    address: "",
    city: "",
    zip: "",
    paymentMethod: "razorpay",
    transactionRef: "",
    hasPaid: false,
  });

  const [validationError, setValidationError] = useState("");
  const [isRazorpayOpening, setIsRazorpayOpening] = useState(false);

  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsSubmitting(false);
    setMessage({});
  };

  const createRazorpayOrder = async () => {
    const response = await fetch(`${API_BASE}/create-razorpay-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        paymentMethod: "razorpay",
      }),
    });
    const order = await response.json();

    if (!response.ok || !order.success) {
      throw new Error(order.msg || "Could not create Razorpay order.");
    }
    return order;
  };

  const verifyRazorpayPayment = async (razorpayResponse) => {
    const response = await fetch(`${API_BASE}/verify-razorpay-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        paymentMethod: "razorpay",
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
      }),
    });
    const confirm = await response.json();

    if (confirm.orderId) {
      setShowOtpPopup(false);
      setIsSubmitting(false);
      setIsRazorpayOpening(false);
      setMessage({
        msg: `${confirm.msg} : ${confirm.orderId}`,
      });
      setView("thankyou");
      setTimeout(() => {
        setMessage({});
      }, 20000);
      return;
    }

    throw new Error(confirm.msg || "Order confirmation failed.");
  };

  const openRazorpayCheckout = async () => {
    setIsRazorpayOpening(true);
    setMessage({ msg: "Opening Razorpay checkout...", isError: false });

    try {

      const [order, isLoaded] = await Promise.all([
        createRazorpayOrder(),
        loadRazorpayScript(),
      ]);

      if (!isLoaded) {
        throw new Error("Could not load Razorpay checkout. Please try again.");
      }

      const razorpay = new window.Razorpay({
        key: order.key,
        order_id: order.orderId,
        name: "Los Santos Offline",
        description: "GTA V Offline Package",
        prefill: {
          name: formData.fullname,
          email: formData.email,
          contact: formData.phone.replace(/\D/g, ""),
        },
        notes: {
          city: formData.city,
          country: formData.country,
        },
        theme: {
          color: "#00ff66",
        },
        handler: async (response) => {
          try {
            setMessage({
              msg: "Payment received. Verifying payment...",
              isError: false,
            });
            await verifyRazorpayPayment(response);
          } catch (error) {
            console.error(error);
            setIsSubmitting(false);
            setIsRazorpayOpening(false);
            setMessage({
              msg: "Payment completed, but verification failed. Please contact support with your payment ID.",
              isError: true,
            });
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setIsRazorpayOpening(false);
            setMessage({});
          },
        },
      });

      setShowOtpPopup(false);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setMessage({ msg: error.message, isError: true });
      setIsSubmitting(false);
      setIsRazorpayOpening(false);
      setShowOtpPopup(false);
      setOtp("");
    }
  };

  const handleVerifiyOtp = async (e) => {
    try {
      const verifiyDetails = await verifyOTP(otp);
      if (!verifiyDetails || verifiyDetails.isError) {
        return;
      }
      const response = await fetch(`${API_BASE}/auth/verifiy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(verifiyDetails),
      });

      let { success } = await response.json();

      if (!success) {
        setMessage({
          msg: "Something went wrong. Please contact support.",
          isError: true,
        });
        return;
      }

      await openRazorpayCheckout();
    } catch (error) {
      console.log(error);
      setShowOtpPopup(false);
      setIsSubmitting(false);
      setIsRazorpayOpening(false);
      setMessage({ msg: "Something went wrong.", isError: true });
      setTimeout(() => {
        setMessage({});
      }, 20000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate form
    if (!formData.fullname || !formData.email || !formData.phone) {
      setValidationError("Please fill out all contact information.");
      return;
    }
    if (!formData.address || !formData.city || !formData.zip) {
      setValidationError("Please fill out the billing address.");
      return;
    }
    onSubmitOrder({
      ...formData,
      paymentMethod: "razorpay",
    });
  };

  return (
    <div className="checkout-container">
      <div className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Back to home
      </div>

      <div className="checkout-header">
        <div
          className="hero-tag"
          style={{ display: "inline-block", marginBottom: "10px" }}
        >
          Secure Checkout • Manual Transfer
        </div>
        <h1 className="checkout-title" style={{ fontSize: "3.5rem" }}>
          Finish the Heist.
        </h1>
        <p className="checkout-subtitle">
          Fill in your details below. Our team will reach out within a few hours
          with your personalized download instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-layout">
        {/* Left Column: Form Fields */}
        <div className="checkout-form-sections">
          {/* 01. Contact */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <span>01.</span> Contact
            </h2>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="e.g. Michael De Santa"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@lossantos.mail"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  required
                />
              </div>
            </div>
          </div>

          {/* 02. Billing Address */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <span>02.</span> Billing Address
            </h2>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="India">India</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Nepal">Nepal</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="4 Vinewood Blvd, Apt 5"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Los Santos"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Postal / Zip</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="90210"
                  required
                />
              </div>
            </div>
          </div>

          {/* 03. Payment Method */}
        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="checkout-summary-column">
          <div className="order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="product-info">
              <div className="product-name">GTA V - OFFLINE PACKAGE</div>
              <div
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Standalone Offline Build + Setup Guide
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Base package</span>
                <span>{FORMATTED_BASE_AMOUNT}</span>
              </div>
              <div className="price-row discount">
                <span>Launch discount</span>
                <span>- {FORMATTED_DISCOUNT_AMOUNT}</span>
              </div>
              <div className="price-row">
                <span>Setup & support</span>
                <span>Included</span>
              </div>
            </div>

            <div className="price-total">
              <span>TOTAL</span>
              <span className="total-amount">{FORMATTED_AMOUNT}</span>
            </div>

            {validationError && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(239, 68, 68, 0.1)",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-checkout-submit"
              disabled={isSubmitting || isRazorpayOpening}
            >
              {isSubmitting || isRazorpayOpening
                ? "Processing..."
                : `SUBMIT ORDER • ${FORMATTED_AMOUNT}`}
            </button>

            <div className="summary-notice">
              <ShieldCheck
                size={20}
                style={{ color: "var(--accent-primary)", flexShrink: 0 }}
              />
              <span>
                Your details are secure. Once payment is verified, download
                setup instructions are sent to your email.
              </span>
            </div>
          </div>

          <div className="next-steps-card">
            <h3 className="next-steps-title">What Happens Next?</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-num">01</div>
                <div className="step-desc">
                  <strong>You submit this form.</strong> Your billing details
                  are checked before mobile verification starts.
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">02</div>
                <div className="step-desc">
                  <strong>You complete payment.</strong> Razorpay opens only
                  after your mobile number is verified.
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">03</div>
                <div className="step-desc">
                  <strong>Receive instructions.</strong> We will contact you on
                  Email / Phone within a few hours with guided download &
                  install instructions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showOtpPopup && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            {/* Close Button */}
            <button
              className="otp-close-btn"
              onClick={() => {
                setShowOtpPopup(false);
                setIsSubmitting(false);
                setIsRazorpayOpening(false);
                setMessage({});
              }}
            >
              ✕
            </button>

            <h2>Verify Mobile Number</h2>

            <p>
              Please enter the OTP sent to your mobile number to confirm this
              order
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
            />

            <div className="otp-actions">
              <button className="verify-btn" onClick={handleVerifiyOtp}>
                Verify
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  clearRecaptcha();
                  setShowOtpPopup(false);
                  setIsSubmitting(false);
                  setIsRazorpayOpening(false);
                  setMessage({});
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
