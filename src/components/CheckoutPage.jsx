import React, { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Check,
  ShieldCheck,
  Copy,
  Info,
} from "lucide-react";
import { AMOUNT, FORMATTED_AMOUNT, UPI_ID } from "../config/pricing";

const API_BASE = import.meta.env.VITE_BASE_URL;
const BASE_AMOUNT = 899;
const DISCOUNT_AMOUNT = Math.max(BASE_AMOUNT - Number(AMOUNT), 0);
const FORMATTED_BASE_AMOUNT = `₹${BASE_AMOUNT}`;
const FORMATTED_DISCOUNT_AMOUNT = `₹${DISCOUNT_AMOUNT}`;
const UPI_REFERENCE_PATTERN = /^\d{12}$/;
const COUNTRY_CALLING_CODES = {
  India: "+91",
  Pakistan: "+92",
  Bangladesh: "+880",
  Nepal: "+977",
  "Sri Lanka": "+94",
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
    paymentMethod: "upi",
    upiId: UPI_ID,
    transactionRef: "",
    hasPaid: false,
  });

  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");

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

  // const getPhoneWithCountryCode = () => {
  //   const countryCode = COUNTRY_CALLING_CODES[formData.country];
  //   const digitsOnly = formData.phone.replace(/\D/g, "");
  //   const withoutInternationalPrefix = digitsOnly.replace(/^00+/, "");

  //   if (!countryCode) {
  //     return formData.phone.trim().startsWith("+")
  //       ? `+${withoutInternationalPrefix}`
  //       : formData.phone.trim();
  //   }

  //   const codeDigits = countryCode.replace("+", "");
  //   const nationalNumber = withoutInternationalPrefix
  //     .replace(new RegExp(`^${codeDigits}`), "")
  //     .replace(/^0+/, "");

  //   return `${countryCode}${nationalNumber}`;
  // };

  const getNormalizedTransactionRef = () => {
    return formData.transactionRef.replace(/[\s-]/g, "");
  };

  const handleVerifiyOtp = async (e) => {
    try {
      let verifiyDetails = await verifyOTP(otp);
      if (verifiyDetails.isError) {
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

      const orderConfirm = await fetch(`${API_BASE}/orderConfirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          // phone: getPhoneWithCountryCode(),
          transactionRef: getNormalizedTransactionRef(),
        }),
      });
      let confirm = await orderConfirm.json();

      if (confirm.orderId) {
        setShowOtpPopup(false);
        setIsSubmitting(false);
        setMessage({
          msg: `${confirm.msg} : ${confirm.orderId}`,
        });
        setView("thankyou");
        setTimeout(() => {
          setMessage({});
        }, 20000);
      }
    } catch (error) {
      console.log(error);
      setShowOtpPopup(false);
      setIsSubmitting(false);
      setMessage({ msg: "Something went wrong.", isError: true });
      setTimeout(() => {
        setMessage({});
      }, 20000);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(formData.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    if (!formData.hasPaid) {
      setValidationError(
        "Please confirm that you have completed the UPI payment first.",
      );
      return;
    }
    if (!formData.transactionRef) {
      setValidationError(
        "Please enter your UPI Transaction Ref / UTR number for verification.",
      );
      return;
    }
    if (!UPI_REFERENCE_PATTERN.test(getNormalizedTransactionRef())) {
      setValidationError(
        "Please enter a valid 12-digit UPI Ref / UTR number. Spaces or hyphens are okay.",
      );
      return;
    }

    // Call submit handler
    onSubmitOrder({
      ...formData,
      // phone: getPhoneWithCountryCode(),
      transactionRef: getNormalizedTransactionRef(),
    });
  };

  const upiURI = `upi://pay?pa=${formData.upiId}&pn=Los%20Santos%20Offline&am=${AMOUNT}&cu=INR&tn=GTA%20V%20Offline`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=000&data=${encodeURIComponent(upiURI)}`;

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
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <span>03.</span> Payment Method
            </h2>

            <div className="payment-tabs">
              <div
                className={`payment-tab ${formData.paymentMethod === "card" ? "active" : "disabled"}`}
                type="button"
                onClick={() => {}}
              >
                <CreditCard size={18} /> CARD
              </div>
              <div
                className={`payment-tab ${formData.paymentMethod === "upi" ? "active" : ""}`}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentMethod: "upi" }))
                }
              >
                <Smartphone size={18} /> UPI - INDIA
              </div>
            </div>

            {formData.paymentMethod === "upi" && (
              <div className="upi-payment-panel">
                <p className="upi-instruction">
                  Scan the QR code below using any UPI app (GPay, PhonePe,
                  Paytm, BHIM) to send <strong>{FORMATTED_AMOUNT}</strong>{" "}
                  manually, or copy the UPI ID.
                </p>

                <div className="qr-code-wrapper">
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR Code"
                    className="qr-code-img"
                  />
                  <div className="qr-amount-badge">PAY {FORMATTED_AMOUNT}</div>
                </div>

                <div className="upi-id-box">
                  <span className="upi-id-text">{formData.upiId}</span>
                  <button
                    type="button"
                    className="btn-copy-upi"
                    onClick={handleCopyUpi}
                    title="Copy UPI ID"
                  >
                    {copied ? (
                      <Check size={16} style={{ color: "#00ff66" }} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                <div className="upi-confirmation-box">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hasPaid"
                      checked={formData.hasPaid}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      Yes, I have completed the manual payment of{" "}
                      <strong>{FORMATTED_AMOUNT}</strong> using the QR Code /
                      UPI ID.
                    </span>
                  </label>

                  <div className="form-group" style={{ marginTop: "15px" }}>
                    <label htmlFor="transactionRef">
                      UPI Transaction ID / Ref / UTR Number
                    </label>
                    <input
                      type="text"
                      id="transactionRef"
                      name="transactionRef"
                      value={formData.transactionRef}
                      onChange={handleChange}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="e.g. 12-digit Ref or UPI Transaction Number"
                      required
                    />
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      This is required so we can verify your payment on our end
                      before sending setup instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
              disabled={isSubmitting || !formData.hasPaid}
            >
              {isSubmitting
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
                  and transaction reference are uploaded to our secure backend.
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">02</div>
                <div className="step-desc">
                  <strong>We verify your payment.</strong> Our support staff
                  will check your UPI transaction ID against our bank statements
                  manually.
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
