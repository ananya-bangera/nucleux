import React, { useState, useRef, useEffect } from "react";
import { Send, Gamepad2 } from "lucide-react";

export default function Chat({messages, setMessages}) {

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = input.trim();      
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[900px] w-[500px] bg-yellow-400 rounded-lg overflow-hidden border-4 border-blue-500 shadow-lg">
      <div className="bg-blue-500 p-4 text-white font-bold text-xl flex items-center">
        <Gamepad2 className="mr-2 text-pink-500" />
        Game Chat
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-yellow-300 to-yellow-400">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start space-x-2">
            <img 
              src="/Moana.png?height=40&width=40"
              alt="Moana" 
              className="w-10 h-10 rounded-full border-2 border-green-500" 
            />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-bold text-purple-700">"Moana"</span>
                {/* <span className="ml-2 text-xs text-purple-900">
                  {message.timestamp.toLocaleTimeString()}
                </span> */}
              </div>
              <p className="bg-green-500 text-white p-2 rounded-lg mt-1 inline-block">
                {message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="bg-blue-500 p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white text-purple-900 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-pink-500 text-white rounded-r-lg px-4 py-2 hover:bg-pink-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}