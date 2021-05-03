import { useInsertRoom, useRooms } from "../../mongodb/setup";
import React, { useState } from "react";
import { room } from "../../mongodb/types";
import { useHistory } from "react-router";
import "./Home.css";

export default function Home() {
  const rooms = useRooms();

  return (
    <main className="main">
      <h1>Rooms</h1>
      <section>
        <CreateRoom />
        <div className="room-row">
          <h5>Name</h5>
          <h5>ID</h5>
          <h5>Actions</h5>
        </div>
        {rooms?.map((room) => (
          <RoomRow room={room} key={room._id.toHexString()} />
        ))}
      </section>
    </main>
  );
}

function CreateRoom() {
  const [name, setName] = useState("");
  const insertRoom = useInsertRoom();

  const onCreateRoom = () => {
    if (name) {
      insertRoom(name);
    }
  };

  return (
    <div className="create-room">
      <label>Enter room name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button className="btn primary" onClick={onCreateRoom}>
        Create Room
      </button>
    </div>
  );
}

function RoomRow(props: { room: room }): JSX.Element {
  const { room } = props;
  const history = useHistory();

  return (
    <div className="room-row">
      <p>{room.topic}</p>
      <p>{room._id.toHexString()}</p>
      <button
        className="btn primary"
        onClick={() => history.push("/room/" + room._id)}
      >
        Enter
      </button>
    </div>
  );
}
