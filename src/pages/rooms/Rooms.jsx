import { getRooms, insertRoom } from "../../mongodb/setup";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./Rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  const onCreateRoom = (name) => {
    if (name) {
      insertRoom(name).then(() => {
        getRooms().then(setRooms);
      });
    }
  };

  return (
    <main>
      <section>
        <h1>Rooms</h1>
        <CreateRoom onCreateRoom={onCreateRoom} />
      </section>

      <section>
        {rooms.map((room) => (
          <RoomRow room={room} key={room._id.toHexString()} />
        ))}
      </section>
    </main>
  );
}

function CreateRoom(props) {
  const [name, setName] = useState("");

  return (
    <div className="create-room">
      <label>Enter room name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button className="btn primary" onClick={() => props.onCreateRoom(name)}>
        Create Room
      </button>
    </div>
  );
}

function RoomRow(props) {
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
