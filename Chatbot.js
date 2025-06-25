import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const handleSubmit = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    try {
      const response = await axios.post("http://localhost:11434/api/chat", {
        model: "Llama3",
        messages: [{ role: "user", content: input }],
        stream: false,
      });

      // If the response has the expected structure
      const botReply =
        response.data.message?.content || "Sorry, I didn’t understand that.";

      const botMessage = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error getting response from API.", sender: "bot" },
      ]);
    }
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chat-container chatbot">
      <header className="chat-header">
        <h1 className="chatwithassistance">Chat with Assistant</h1>
      </header>

      <main className="chat-body">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </main>

      <footer className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button onClick={handleSubmit}>&#10148;</button>
      </footer>
    </div>
  );
};

export default Chatbot;
