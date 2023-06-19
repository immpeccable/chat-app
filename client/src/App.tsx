import React from "react";
import { BrowserRouter, Route, Outlet, Routes } from "react-router-dom";
import { Landing } from "./Pages/Landing";
import { Signup } from "./Pages/Signup";
import { Login } from "./Pages/Login";
import { Header } from "./Components/Header";

export const App: React.FC = () => {
  return (
    <div className="min-h-[100vh] bg-black bg-opacity-90">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

// // Chatroom.tsx
// import React, { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// interface ChatroomProps {
//   chatroomId: string;
//   user: string;
// }

// const Chatroom: React.FC<ChatroomProps> = ({ chatroomId, user }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<string[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const newSocket = io("http://localhost:3000");

//     newSocket.emit("join", chatroomId, user);

//     newSocket.on("message", (message: string) => {
//       console.log("is message coming here bro!!");
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.emit("leave", chatroomId, user);
//       newSocket.disconnect();
//       console.log("disconnected for some reason");
//     };
//   }, [chatroomId, user]);

//   const sendMessage = () => {
//     if (socket) {
//       console.log("message is ent from the client");
//       socket.emit("sendMessage", chatroomId, newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div>
//       <h2>Chatroom: {chatroomId}</h2>
//       <div>
//         {messages.map((message, index) => (
//           <p key={index}>{message}</p>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={newMessage}
//         onChange={(e) => setNewMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// };

// export default Chatroom;
