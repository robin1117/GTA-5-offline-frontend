import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const status = error?.status || "404";

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.kicker}>MISSION FAILED</p>
        <h1 style={styles.title}>Route Lost in Los Santos</h1>
        <p style={styles.copy}>
          Page nahi mili, boss. GPS ne bola "recalculating", aur Franklin bhi
          confuse ho gaya.
        </p>

        <div style={styles.statusBox}>
          <span style={styles.statusLabel}>Error Code</span>
          <strong style={styles.status}>{status}</strong>
        </div>

        <a href="/" style={styles.button}>
          Restart Mission
        </a>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at 50% 15%, rgba(0, 255, 102, 0.12), transparent 32%), #070708",
    color: "#ffffff",
  },
  panel: {
    width: "min(100%, 560px)",
    textAlign: "center",
    padding: "42px 24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "6px",
    background: "rgba(17, 19, 24, 0.88)",
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.42)",
  },
  kicker: {
    marginBottom: "14px",
    color: "#00ff66",
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    letterSpacing: "0.14em",
  },
  title: {
    marginBottom: "16px",
    fontSize: "clamp(3rem, 10vw, 5.5rem)",
    lineHeight: "0.88",
  },
  copy: {
    maxWidth: "430px",
    margin: "0 auto 24px",
    color: "#9aa0a6",
    fontSize: "0.98rem",
    lineHeight: 1.65,
  },
  statusBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
    padding: "10px 14px",
    border: "1px solid rgba(0, 255, 102, 0.25)",
    borderRadius: "4px",
    background: "rgba(0, 255, 102, 0.08)",
  },
  statusLabel: {
    color: "#9aa0a6",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  status: {
    color: "#00ff66",
    fontFamily: "var(--font-display)",
    fontSize: "1.4rem",
    lineHeight: 1,
  },
  button: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "46px",
    padding: "0 24px",
    borderRadius: "4px",
    background: "#00ff66",
    color: "#000000",
    fontFamily: "var(--font-display)",
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textDecoration: "none",
    textTransform: "uppercase",
  },
};
