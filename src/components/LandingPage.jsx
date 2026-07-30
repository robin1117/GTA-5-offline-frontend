import React, { useState } from "react";
import {
  Shield,
  Settings,
  Users,
  Gamepad2,
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import gtaShowcase from "../assets/gta_showcase.png";
import { AnimatePresence, motion } from "framer-motion";
import { FORMATTED_AMOUNT } from "../config/pricing";
// import { motion, AnimatePresence } from "motion/react";

export default function LandingPage({ onBuyNow }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "Is this the full game of GTA V?",
      answer:
        "Yes, this includes the complete Grand Theft Auto V Story Mode game, fully updated and optimized for offline gameplay. It contains all single-player missions, locations, and characters.",
    },
    {
      question: "How does the offline mode work?",
      answer:
        "We bypass standard online launchers (Rockstar Games Launcher, Epic, Steam account lockouts) that require a constant internet connection. The build runs standalone on your computer, bypassing launcher-related lag and verification prompts.",
    },
    {
      question: "How do I make the payment?",
      answer:
        `We support direct manual payment via UPI. In the checkout step, we provide our official UPI ID and QR code. You can scan the QR code using any app (GPay, PhonePe, Paytm, BHIM) and pay ${FORMATTED_AMOUNT}. After paying, click 'I have paid' and provide your details. We will manually verify the payment and email/text you instructions.`,
    },
    {
      question: "Will I get help with the installation?",
      answer:
        "Absolutely. Along with the download files, we send a step-by-step video guide. If you face any issues, our team is available on WhatsApp and email to guide you through the setup until the game runs smoothly on your system.",
    },
    {
      question: "What are the PC system requirements?",
      answer:
        "You need Windows 10/11 (64-bit), at least 8GB RAM, an Intel Core i5 / AMD Phenom II processor, and an NVIDIA GTX 660 / AMD HD 7870 graphics card or better, along with about 110 GB of free storage space.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="landing-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Gamepad2 size={40} className="logo-accent" />
          LOS SANTOS<span className="logo-accent">.OFFLINE</span>
        </div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#showcase" className="nav-link">
            Showcase
          </a>
          <a href="#faq" className="nav-link">
            FAQ
          </a>
        </nav>
        <button className="btn-nav-buy" onClick={onBuyNow}>
          BUY NOW - {FORMATTED_AMOUNT}
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag animate-slide-up delay-100">
            <span style={{ color: "#00ff66", marginRight: "6px" }}>●</span> Now
            Available • GTA V Offline Edition
          </div>
          <h1 className="hero-title animate-slide-up delay-300">
            Steal the city.
            <br />
            <span className="hero-title-accent">Offline.</span>
          </h1>
          <p className="hero-desc animate-slide-up delay-500">
            Skip the launchers, the always-online drama, and the endless
            updates. We deliver a fully playable GTA 5 experience – installed
            clean, configured for offline, guided by real humans.
          </p>
          <div className="hero-buttons animate-slide-up delay-700">
            <button className="btn-hero-primary" onClick={onBuyNow}>
              GET GTA 5 • {FORMATTED_AMOUNT}
              <ArrowRight scale={87} size={40} />
            </button>
            <a
              href="#features"
              className="btn-hero-secondary"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              WHAT YOU GET
            </a>
          </div>

          <div className="hero-trust animate-slide-up delay-900">
            <div className="trust-item">
              <span className="trust-stars">★★★★★</span>
              <span>4.9 from 2,400+ downloaders</span>
            </div>
            <div className="trust-item">
              <span style={{ color: "#00ff66", marginRight: "4px" }}>✔</span>{" "}
              One-time payment • No subscription
            </div>
            <div className="trust-item">
              <span style={{ color: "#00ff66", marginRight: "4px" }}>✔</span>{" "}
              Human support • No bots
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="section-header">
          <h2 className="section-title">The Ultimate Offline Build</h2>
          <p className="section-desc">
            We optimize, configure, and package the complete GTA V experience so
            it runs fast, independent, and completely local on your PC.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={32} />
            </div>
            <h3 className="feature-title">100% Offline Independent</h3>
            <p className="feature-text">
              No launcher connections, no login prompts, and zero risk of your
              session getting disconnected. Just open the executable and play
              instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Settings size={32} />
            </div>
            <h3 className="feature-title">Optimized & Clean Setup</h3>
            <p className="feature-text">
              We remove junk temp cache files and pre-configure the graphics
              configuration to ensure smooth frame-rates even on mid-range
              laptops and PCs.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={32} />
            </div>
            <h3 className="feature-title">Real Human Support</h3>
            <p className="feature-text">
              No automated chatbots. You will get a dedicated guide who will
              help you over remote support/whatsapp if you need help with
              copy-pasting the files.
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="section section-dark">
        <div className="showcase-grid">
          <div className="showcase-text">
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Relive the Action in Los Santos
            </h2>
            <p className="section-desc" style={{ textAlign: "left" }}>
              Explore Southern California's breathtaking landscape, from
              Vinewood hills to the dusty roads of Sandy Shores. Play the iconic
              stories of Michael, Franklin, and Trevor without launcher lag.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <CheckCircle size={18} style={{ color: "#00ff66" }} />
                <span>Pre-installed ScriptHookV for native mods support</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <CheckCircle size={18} style={{ color: "#00ff66" }} />
                <span>Includes all standard DLC updates and vehicles</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <CheckCircle size={18} style={{ color: "#00ff66" }} />
                <span>
                  Fast compression installer for efficient storage footprint
                </span>
              </div>
            </div>
            <button
              className="btn-hero-primary"
              style={{ marginTop: "15px", alignSelf: "flex-start" }}
              onClick={onBuyNow}
            >
              GET SECURE ACCESS NOW • {FORMATTED_AMOUNT}
            </button>
          </div>

          <div className="showcase-image-wrapper">
            <img
              src={gtaShowcase}
              alt="GTA V Los Santos theme screenshot mockup"
              className="showcase-image"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Everything you need to know about the Los Santos Offline package and
            payment process.
          </p>
        </div>

        <div className="faqs-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                {activeFaq === index ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
              <AnimatePresence initial={true}>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }} // Crucial to prevent text overflow during animation
                  >
                    <div className="faq-answer ">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-info">
          <div className="footer-logo">
            <Gamepad2 size={20} className="logo-accent" />
            LOS SANTOS<span className="logo-accent">.OFFLINE</span>
          </div>
          <p className="footer-desc">
            Independent download & installation service for GTA 5 offline mode.
            Not affiliated with Rockstar Games or Take-Two Interactive. All
            trademarks belong to their respective owners.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Support</h4>
          <div className="footer-section-links">
            <span>Email: help@lossantos-offline.local</span>
            <span>Response within 4 hours</span>
            <span>24/7 Setup Assistance</span>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Legal</h4>
          <div className="footer-section-links">
            <span>© 2026 Los Santos Offline</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
