import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./Admin"; // import your Admin component

function App() {
  const publicVapidKey =
    "BPrZcFrQ6-F-5Rc34982D_-qrpIXiHLoYL3piFJcdh5ub5yrqFWicEZ2a2vyuxYeKy8VZl_KiD3vMOiFLmTtAnE";

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("✅ Service Worker registered");
      });
    }
  }, []);

  const subscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) await existingSub.unsubscribe();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await fetch("https://vercelpushb.vercel.app/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    alert("🎉 Subscribed successfully!");
  };

  const sendNotification = async () => {
    await fetch("https://vercelpushb.vercel.app/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hello 🚀", message: "Test notification!" }),
    });
  };

  return (
    <Router>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 10 }}>User</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "20px" }}>
              <h1>React + Express + PostgreSQL Push Notifications</h1>
              <button onClick={subscribe}>Enable Notifications</button>
              <button onClick={sendNotification} style={{ marginLeft: 10 }}>
                Send Test Notification
              </button>
            </div>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

// Helper: Convert Base64 URL string to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default App;
