import { useState } from "react";
import LandingPage from "./components/LandingPage";
import CheckoutPage from "./components/CheckoutPage";
import ThankYouPage from "./components/ThankYouPage";
import AdminDashboard from "./components/AdminDashboard";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../utils/firebase.js";

export default function App() {
  const [view, setView] = useState("checkout"); // 'landing' | 'checkout' | 'thankyou'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [message, setMessage] = useState({ msg: "", isError: false });
  const [isSending, setIsSending] = useState(false);

  const API_BASE = import.meta.env.VITE_BASE_URL;

  const clearRecaptcha = () => {
    window.recaptchaVerifier?.clear();
    window.recaptchaVerifier = null;
  };

  const setupRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
    try {
      await window.recaptchaVerifier.render();
      return window.recaptchaVerifier;
    } catch (error) {}
  };

  const sendOTP = async (phone) => {
    const phoneNumber = phone.trim().replace(/[\s()-]/g, "");
    setMessage({});
    if (!phoneNumber.startsWith("+")) {
      setMessage({
        msg: "Enter phone number with country code, for example +91 1234567891",
        isError: true,
      });
      setIsSubmitting(false);
      return;
    }
    setIsSending(true);
    try {
      const verifier = await setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier,
      );
      window.confirmationResult = confirmation;

      setMessage({ msg: `OTP sent at ${phone}`, isError: false });
      setShowOtpPopup(true);
      return confirmation;
    } catch (err) {
      clearRecaptcha();
      setMessage({
        msg: "Could not send OTP. try again, make sure your mobile Numner is Correct !",
        isError: true,
      });
      setIsSubmitting(false);
      return null;
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setMessage("");
      if (!window.confirmationResult) {
        setMessage({ msg: "Send the OTP first.", isError: true });
        return;
      }
      const result = await window.confirmationResult.confirm(otp);
      setMessage({ msg: "verfying..", isError: false });
      return result;
    } catch (err) {
      setMessage({ msg: "Invalid OTP.", isError: true });
      return { msg: err.message, isError: true };
    }
  };

  const handleSubmitOrder = async (orderDetails) => {
    setIsSubmitting(true);
    sendOTP(orderDetails.phone);
  };

  //==============================================================

  const handleBuyNow = () => {
    setView("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackHome = () => {
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container">
      <div id="recaptcha-container" className="recaptcha-container"></div>
      {message.msg && (
        <div
          className={`${message.isError ? "auth-message-error" : "auth-message"}`}
        >
          {message.msg}
        </div>
      )}

      {view === "landing" && <LandingPage onBuyNow={handleBuyNow} />}

      {view === "checkout" && (
        <CheckoutPage
          onBack={handleBackHome}
          onSubmitOrder={handleSubmitOrder}
          isSubmitting={isSubmitting || isSending}
          showOtpPopup={showOtpPopup}
          setShowOtpPopup={setShowOtpPopup}
          verifyOTP={verifyOTP}
          setIsSubmitting={setIsSubmitting}
          setMessage={setMessage}
          setView={setView}
        />
      )}

      {view === "thankyou" && <ThankYouPage onBackHome={handleBackHome} />}
    </div>
  );
}
