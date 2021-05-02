import {useRooms} from "../mongodb/setup";
import React from "react";
import {room} from "../mongodb/types";
import {useHistory} from "react-router";
import './Home.css';

function RoomRow(props: { room: room }): JSX.Element {
    const {room} = props;
    const history = useHistory();

    return (
        <div className="room-row">
            <p>{room.topic}</p>
            <p>{room._id.toHexString()}</p>
            <button className="btn" onClick={() => history.push('/room/' + room._id)}>Enter</button>
        </div>
    );
}

export default function Home() {
    const rooms = useRooms();

    return (
        <main className="main">
            <h1>Rooms</h1>
            <div className="room-row">
                <h5>Name</h5>
                <h5>ID</h5>
                <h5>Actions</h5>
            </div>
            {rooms?.map((room) => <RoomRow room={room} key={room._id.toHexString()}/>)}
        </main>
    );
}
