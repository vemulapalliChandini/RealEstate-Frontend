// import { Button, Input } from 'antd';
// import React, { useState, useRef } from 'react';
// import { _post } from '../Service/apiClient';
// import './Chatbot.css';
// import { RobotOutlined } from '@ant-design/icons';
// import { faRobot } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// const Chatbot = () => {
//     const [userInput, setUserInput] = useState("");
//     const [chatHistory, setChatHistory] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isChatOpen, setIsChatOpen] = useState(false);

//     const userMessageRef = useRef(null);
//     const botResponseRef = useRef(null);

//     const handleUserInput = (e) => {
//         setUserInput(e.target.value);
//     };

//     const sendMessage = async () => {
//         if (!userInput) return;

//         // Add user's message to chat history
//         const newChatHistory = [...chatHistory, { sender: 'user', message: userInput }];
//         setChatHistory(newChatHistory);
//         setIsLoading(true);

//         // Scroll to the latest user message after sending
//         setTimeout(() => {
//             if (userMessageRef.current) {
//                 userMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             }
//         }, 0);

//         try {
//             const response = await _post("bot/chat", { userMessage: userInput });
//             const updatedChatHistory = [
//                 ...newChatHistory,
//                 { sender: 'bot', message: response.data },
//             ];
//             setChatHistory(updatedChatHistory);

//             // After bot response, scroll to show both user message and response
//             setTimeout(() => {
//                 if (botResponseRef.current) {
//                     botResponseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                 }
//             }, 100);
//         } catch (error) {
//             console.error("Error sending message:", error);
//         } finally {
//             setIsLoading(false);
//             setUserInput("");
//         }
//     };

//     const clearChat = () => {
//         setChatHistory([]);
//         setUserInput("");
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault(); // Prevent form submission if inside a form
//             sendMessage();
//         }
//     };

//     return (
//         <div className="chatbot-container">
//             {!isChatOpen && (
//                 <Button
//                     icon={<FontAwesomeIcon icon={faRobot} />}
//                     type="primary"
//                     onClick={() => setIsChatOpen(true)}
//                     className="chatbot-toggle-button"
//                 />
//             )}

//             {isChatOpen && (
//                 <div className="chatbot-window">
//                     <div className="chatbot-header">
//                         <h3>Chatbot</h3>
//                         <Button type="text" onClick={() => setIsChatOpen(false)} style={{ color: '#fff' }}>
//                             ✕
//                         </Button>
//                     </div>
//                     <div className="chat-history">
//                         {chatHistory.map((chat, index) => (
//                             <div
//                                 key={index}
//                                 ref={chat.sender === 'user' && index === chatHistory.length - 2 ? userMessageRef : chat.sender === 'bot' && index === chatHistory.length - 1 ? botResponseRef : null}
//                                 className={`chat-message ${chat.sender === 'user' ? 'user-message' : 'bot-message'}`}
//                             >
//                                 {chat.message}
//                             </div>
//                         ))}
//                         {isLoading && <div className="bot-message">Bot is typing...</div>}
//                     </div>
//                     <div className="chatbot-input-container">
//                         <Input
//                             type="text"
//                             value={userInput}
//                             onChange={handleUserInput}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Type your message"
//                             className="chatbot-input"
//                         />
//                         <Button type="primary" onClick={sendMessage} disabled={isLoading}>
//                             Send
//                         </Button>
//                     </div>
//                     <Button type="link" onClick={clearChat} className="clear-chat">
//                         Clear Chat
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Chatbot;

import { Button, Input } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { _post } from "../Service/apiClient";
import "./Chatbot.css";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";

const Chatbot = ({ onFetchFilteredData }) => {
  const location = useLocation();
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [propId, setPropId] = useState(null);
  const navigate = useNavigate();
  const userMessageRef = useRef(null);
  const botResponseRef = useRef(null);
  const [promptText, setPromptText] = useState("Accepted?");

  useEffect(() => {
    setIsChatOpen(false);
  }, [location.pathname]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async (message) => {
    if (!message) return;

    const newChatHistory = [...chatHistory, { sender: "user", message }];
    setChatHistory(newChatHistory);
    setIsLoading(true);

    setTimeout(() => {
      if (userMessageRef.current) {
        userMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
    try {
      const response = await _post("bot/chat", { userMessage: message });
      if (response.data.id !== undefined) {
        setPropId(response.data.id);
      }
      const updatedChatHistory = [
        ...newChatHistory,
        { sender: "bot", message: response.data.result },
      ];
      setChatHistory(updatedChatHistory);

      setTimeout(() => {
        if (botResponseRef.current) {
          botResponseRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(userInput);
    }
  };

  const handlePromptClick = () => {
    const message = `get latest ${localStorage.getItem("type")} property`;
    setUserInput(message);
    setIsChatOpen(true);
    sendMessage(message); // Immediately send the message after setting
  };

  // const isBuyerPage = location.pathname === "/dashboard/buyer";

  const handlePromptClick1 = () => {
    navigate("/dashboard/agent/myproperties");
    localStorage.setItem("mtype", localStorage.getItem("type"));
    localStorage.setItem("form", true);
  };

  const handleAppointmentsClick = () => {
    const name = "@";
    const status = promptText.trim().replace(/[?]/g, "");
    onFetchFilteredData(name, status);
  };

  const handleAppointmentsClick1 = () => {
    const name = "@";
    const status = promptText.trim().replace(/[?]/g, "");
    onFetchFilteredData(name, status);
  };

  useEffect(() => {
    // const toggleText = () => {
    //   setPromptText((prev) =>
    //     prev === "Accepted?" ? "Rejected?" : "Accepted?"
    //   );
    // };

    const toggleText = () => {
      if (location.pathname === "/dashboard/buyer/agentappointment") {
        // If we are on this specific path, toggle between 3 options
        if (promptText === "Accepted?") {
          setPromptText("Rejected?");
        } else if (promptText === "Rejected?") {
          setPromptText("Pending?");
        } else {
          setPromptText("Accepted?");
        }
      } else {
        // If not on that path, toggle between "Accepted?" and "Rejected?"
        setPromptText((prev) =>
          prev === "Accepted?" ? "Rejected?" : "Accepted?"
        );
      }
    };

    const intervalId = setInterval(toggleText, 2000);
    return () => clearInterval(intervalId);
  }, [location.pathname, promptText]);

  const isBuyerPage = location.pathname === "/dashboard/buyer";
  const isAgentPage = location.pathname === "/dashboard/agent";
  const isAppointments =
    location.pathname === "/dashboard/agent/appointments/buyerRequests";
  const isAppointments1 =
    location.pathname === "/dashboard/buyer/agentappointment";

  const handleMsgClick = () => {
    navigate(
      `/dashboard/buyer/${localStorage
        .getItem("type")
        .toLowerCase()}/details/${propId}`
    );
  };

  return (
    <div className="chatbot-container">
      {isBuyerPage && !isChatOpen && (
        <div className="chatbot-prompt" onClick={handlePromptClick}>
          <div className="chatbot-prompt-arrow"></div>
          Latest Property?
        </div>
      )}
      {isAgentPage && !isChatOpen && (
        <div className="chatbot-prompt" onClick={handlePromptClick1}>
          <div className="chatbot-prompt-arrow"></div>
          Add property?
        </div>
      )}
      {isAppointments && !isChatOpen && (
        <div className="chatbot-prompt" onClick={handleAppointmentsClick1}>
          <div className="chatbot-prompt-arrow"></div>
          {promptText}
        </div>
      )}

      {isAppointments1 && !isChatOpen && (
        <div className="chatbot-prompt" onClick={handleAppointmentsClick}>
          <div className="chatbot-prompt-arrow"></div>
          {promptText}
        </div>
      )}

      {!isChatOpen && (
        <Button
          icon={<FontAwesomeIcon icon={faRobot} />}
          type="primary"
          onClick={() => setIsChatOpen(true)}
          className="chatbot-toggle-button"
        />
      )}

      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Estate Guide</h3>
            <Button
              type="text"
              onClick={() => setIsChatOpen(false)}
              style={{ color: "#fff" }}
            >
              ✕
            </Button>
          </div>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                ref={
                  chat.sender === "user" && index === chatHistory.length - 2
                    ? userMessageRef
                    : chat.sender === "bot" && index === chatHistory.length - 1
                    ? botResponseRef
                    : null
                }
                className={`chat-message ${
                  chat.sender === "user" ? "user-message" : "bot-message"
                }`}
                onClick={() => {
                  if (chat.sender === "bot") {
                    handleMsgClick();
                  }
                }}
                style={{
                  cursor: chat.sender === "bot" && "pointer",
                }}
              >
                {chat.message}
              </div>
            ))}
            {isLoading && <div className="bot-message">Bot is typing...</div>}
          </div>
          <div className="chatbot-input-container">
            <Input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message"
              className="chatbot-input"
            />
            <Button
              type="primary"
              onClick={() => sendMessage(userInput)}
              disabled={isLoading}
            >
              Send
            </Button>
          </div>
          <Button type="link" onClick={clearChat} className="clear-chat">
            Clear Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
