import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./HomeRoom.util.css"; 

const baseURL = import.meta.env.VITE_API_URL;

const HomeRoom = () => {
  const navigate=useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  

 
  const generateRoomId = async (e) => {
    e.preventDefault();

    const id = uuid();
    setRoomId(id);
    toast.success("Room Id is generated");
  };

  
  const joinRoom = async () => {

    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    navigate(`/room/${roomId}`, {
      state: { username, roomId },
    });
    toast.success("Room is created");
  };

  return (
    <div className="home-container container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 ">
          <div className="card home-card shadow-lg ">
            <div className="card-body text-center">
              <h3 className="mb-4 title">💻 Join a Room</h3>
              <div className="form-group">
                <input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  type="text"
                  className="form-control custom-input mb-3"
                  placeholder="Enter Room ID"
                  style={{color: "white"}}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control custom-input mb-3 text-white"
                  placeholder="Enter Username"
                />
                <button onClick={joinRoom} className="btn join-btn btn-lg w-100">Join Room</button>
                <p className="mt-3 text-white">
                  Don’t have a room ID?{" "}
                  <span
                    className="new-room"
                    onClick={generateRoomId}
                  >
                    Generate New Room
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRoom;
