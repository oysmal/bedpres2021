import { useInsertRoom, useRooms } from "../../mongodb/setup";
import React, { useState } from "react";
import { room } from "../../mongodb/types";
import { useHistory } from "react-router";
import "./Rooms.css";

export default function Rooms() {
  const rooms = useRooms();

  return (
    <main>
      <section>
        <h1>Rooms</h1>
        <CreateRoom />
      </section>

      <section>
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
      <a
        className="btn"
        href={"/estimates/" + room._id.toHexString()}
        onClick={() => history.push("/estimates/" + room._id.toHexString())}
      >
        Enter room
      </a>
    </div>
  );
}
