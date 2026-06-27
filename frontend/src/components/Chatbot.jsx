import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanText = (text) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .trim();
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot", {
        message: currentMessage,
      });

      const cleanReply = cleanText(res.data.reply);

      const botMessage = { sender: "bot", text: cleanReply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    }

    setTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {open && (
        <div className="w-[360px] h-[430px] bg-white shadow-2xl rounded-xl flex flex-col mb-4 border">

          {/* Header */}
          <div className="bg-[#000000] text-white p-3 rounded-t-xl font-semibold text-sm flex items-center gap-2">
            🤖 SikshaSetu AI Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 text-sm space-y-3 bg-gray-50">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {typing && (
              <div className="text-xs text-gray-500 italic">
                AI is typing...
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Input */}
          <div className="p-2 border-t flex bg-white">

            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm outline-none"
              placeholder="Ask something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button
              onClick={sendMessage}
              className="ml-2 bg-[#000000] hover:bg-[#252a37] text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              Send
            </button>

          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#13135f] hover:bg-[#162d6b] text-white rounded-full w-14 h-14 shadow-xl text-xl flex items-center justify-center cursor-pointer"
      >
        💬
      </button>

    </div>
  );
};

export default Chatbot;