import { useParams } from "react-router";
import { useInsertEstimate, useRoom } from "../../mongodb/setup";
import "./Room.css";
import { useState } from "react";
import Cards from "./Cards";

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const { room, estimates } = useRoom(id);
  const [selectedCard, setSelectedCard] = useState(-1);
  const [name, setName] = useState("");
  const insertEstimate = useInsertEstimate();

  const onSelectCard = (card: number) => {
    setSelectedCard(card);
    if (room) insertEstimate(room, name, card);
  };

  return (
    <main>
      <h1>Room - {room?.topic}</h1>
      <label>Enter your name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Cards selectedCard={selectedCard} onSelectCard={onSelectCard} />

      <div className="estimates">
        {estimates.map((estimate) => (
          <div className="estimate">
            <p>{estimate.name}</p>
            <p>{estimate.estimate}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
