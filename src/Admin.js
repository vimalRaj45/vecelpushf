import { useState, useEffect } from "react";
import NotificationForm from "./components/NotificationForm";

export default function Admin() {
  const [history, setHistory] = useState([]);

  const sendNotification = async ({ title, message }) => {
    await fetch("https://vercelpushb.vercel.app/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    alert("Notifications sent!");
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch("https://vercelpushb.vercel.app/notifications");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Notification Panel</h2>
      <NotificationForm onSend={sendNotification} />

      <h3 style={{ marginTop: 30 }}>Notification History</h3>
      <ul>
        {history.map((n) => (
          <li key={n.id}>
            [{new Date(n.sent_at).toLocaleString()}] <b>{n.title}</b>: {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
