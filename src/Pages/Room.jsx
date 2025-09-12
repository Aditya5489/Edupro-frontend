import React, { useEffect, useState, useRef } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../components/Socket";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


const Room = () => {
  const {id}=useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const { username, roomId } = location.state || {};
  const finalId=roomId||id;


  const [clients, setClient] = useState([]);
  const [code, setCode] = useState("");

  const [messages, setMessages] = useState([]); 
  const [chatInput, setChatInput] = useState("");


  useEffect(() => {
    if (!location.state) {
      navigate("/homeroom");
      return;
    }

    const init = async () => {
      if (!socketRef.current) {
        socketRef.current = await initSocket();

        socketRef.current.on("connect_error", handleError);
        socketRef.current.on("connect_failed", handleError);

        socketRef.current.emit("join", {
          roomId,
          username: location.state.username,
        });

        // Handle new users joining
        socketRef.current.on("joined", ({ clients, username, socketId }) => {
          // Only show toast for others joining
          if (username !== location.state.username) {
            toast.success(`${username} joined`);
          }

          const uniqueClients = clients.filter(
            (c, index, self) =>
              index === self.findIndex((u) => u.username === c.username)
          );
          setClient(uniqueClients);

          // Sync code to newly joined user
          socketRef.current.emit("sync-code", {
            code,
            socketId,
          });
        });

        // Handle user leaving
        socketRef.current.on("disconnected", ({ socketId, username }) => {
          toast.success(`${username} left`);
          setClient((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });

        socketRef.current.off("receive-message");
        socketRef.current.on("receive-message", ({ username, message }) => {
          setMessages((prev) => [...prev, { username, message }]);
        });


        // Listen for code changes
        socketRef.current.on("code-change", ({ code }) => {
          if (code !== null) setCode(code);
        });
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
        socketRef.current.off("code-change");
        socketRef.current.off("receive-message");
        socketRef.current.disconnect();
      }
    };
  }, []); 

  const handleError = (e) => {
    console.log("socket error=>", e);
    toast.error("Socket connection failed");
    navigate("/homeroom");
  };

  // Broadcast code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socketRef.current.emit("code-change", { roomId, code: newCode });
  };

  const sendMessage = () => {
  if (chatInput.trim() === "") return;
  
  socketRef.current.emit("send-message", {
    roomId,
    username: location.state?.username,
    message: chatInput
  });

  setChatInput(""); 
};


  return (
  <div className="container-fluid vh-100 p-0">
    <div className="row h-100 m-0">
      {/* Sidebar */}
      <div
        className="col-md-2 bg-dark text-light d-flex flex-column"
        style={{ height: "100vh" }}
      >
        <h4 className="mt-3 ms-2">👨‍💻 Participants</h4>
        <hr className="mt-2" />
        <div className="d-flex flex-column overflow-auto flex-grow-1">
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>

        <div className="mt-auto border-top border-bottom">
          <button
            className="btn btn-neon w-100 mt-3 px-3"
            onClick={() => {
              if (!finalId) {
                toast.error("Room ID not found");
                return;
              }

              navigator.clipboard.writeText(finalId)
                .then(() => toast.success("Room ID copied!"))
                .catch(() => toast.error("Failed to copy Room ID"));
            }}
          >
            Copy Room Id
          </button>
          <button
            className="btn btn-neon w-100 mt-3 mb-4 px-3"
            onClick={() => {
              if (socketRef.current) {
                socketRef.current.emit("leave-room", { roomId }); 
                socketRef.current.disconnect(); 
              }
              navigate("/dashboard"); 
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Editor + Chat Panel */}
      <div className="col-md-10 d-flex h-100 p-0">
        {/* Editor Section */}
        <div className="flex-grow-1 d-flex flex-column h-100 overflow-auto" style={{"backgroundColor": "#1e1e2f",}} >
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            code={code}
            onCodeChange={handleCodeChange}
        
          />
        </div>

        {/* Chat Panel */}
        <div
          className="chat-container d-flex flex-column"
          style={{
            width: "300px",
            height: "100%",
            backgroundColor: "#1e1e2f",
            borderLeft:"1px solid white",
            padding: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div className="chat-messages flex-grow-1 overflow-auto mb-2" style={{"color":"white"}}>
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-1">
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="input-group mt-auto">
            <input
              type="text"
              className="form-control"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{ backgroundColor: "white", color: "black", border: "none" }}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default Room;
