import { useState } from "react";

export default function NotificationForm({ onSend }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!title || !message) {
      alert("Please enter both title and message!");
      return;
    }
    onSend({ title, message });
    setTitle("");
    setMessage("");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleSend}>Send Notification</button>
    </div>
  );
}
