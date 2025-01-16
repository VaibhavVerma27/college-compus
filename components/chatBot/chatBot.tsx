"use client"
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Chat {
  userInput: string;
  response: string;
}

const FloatingChatbot = () => {
  const { data: session } = useSession();
  const [chat, setChat] = useState<Chat[]>([
    { userInput: "Hi!", response: "Hello! How can I assist you today?" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const convertLinksToAnchors = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${url}</a>`;
    });
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    setIsDisabled(true);

    try {
      setChat((chat) => [...chat, { userInput: userMessage, response: "fetching response..." }]);
      const res = await axios.post("https://college-compus.vercel.app/api/aichatbot", { userInput: userMessage });
      console.log(res.data);

      if (res.status === 200) {
        setChat((prev) => {
          const updatedChat = [...prev];
          // Convert links before setting the response
          updatedChat[updatedChat.length - 1].response = convertLinksToAnchors(res.data);
          return updatedChat;
        });

        setUserMessage("");
      } else {
        setChat((prev) => {
          const updatedChat = [...prev];
          updatedChat[updatedChat.length - 1].response = "Failed to fetch response";
          return updatedChat;
        });
      }
    } catch (error) {
      console.log(error);
    }

    setIsDisabled(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!session) return null;
  return (
    <div className="fixed bottom-0 right-0 z-50 md:bottom-8 md:right-8">
      {/* Chat Bubble */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 transform duration-200 ease-in-out m-4 md:m-0">
          <span className="text-white text-2xl md:text-3xl font-bold">💬</span>
        </button>
      )}

      {/* Expanded Chatbox */}
      {isChatOpen && (
        <div
          className="flex flex-col w-full h-screen md:h-[80vh] md:w-[600px] bg-gray-800 md:rounded-2xl shadow-xl transform duration-300 ease-in-out">
          {/* Header */}
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 md:p-6 flex justify-between items-center md:rounded-t-2xl">
            <span className="text-xl md:text-2xl font-bold">College Connect Chat</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white text-2xl md:text-3xl font-bold hover:opacity-80 transition-opacity"
            >
              ✖
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gray-900 space-y-4 md:space-y-6">
            {chat.map((message, index) => (
              <div key={index}>
                {/* User Message */}
                <div className="flex justify-end mb-3 md:mb-4">
                  <div
                    className="bg-blue-600 text-white p-3 md:p-5 rounded-lg max-w-[85%] text-base md:text-lg shadow-md transform transition-transform duration-300 ease-in-out">
                    {message.userInput}
                  </div>
                </div>
                {/* Bot Response */}
                <div className="flex justify-start mb-3 md:mb-4">
                  <div
                    className="bg-gray-700 text-gray-300 p-3 md:p-5 rounded-lg max-w-[85%] text-base md:text-lg shadow-md whitespace-pre-wrap transform transition-transform duration-300 ease-in-out"
                    dangerouslySetInnerHTML={{__html: message.response}}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-4 md:p-6 bg-gray-800 flex items-center space-x-3 md:space-x-6"><input
            type="text"
            value={userMessage}
            onKeyPress={handleKeyPress}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 md:px-6 py-3 md:py-4 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-blue-500 placeholder-gray-400 text-base md:text-lg"          />
            <button
              disabled={isDisabled}
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold hover:opacity-90 transition-opacity duration-300 whitespace-nowrap"            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;
