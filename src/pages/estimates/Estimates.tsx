import { useParams } from "react-router";
import { useEstimatesBackend } from "../../mongodb/setup";
import { useState } from "react";
import Cards from "./cards/Cards";
import "./Estimates.css";

export default function Estimates() {
  const { id } = useParams<{ id: string }>();
  const [selectedCard, setSelectedCard] = useState(-1);
  const [name, setName] = useState("");
  const { room, estimates, upsertEstimate } = useEstimatesBackend(id);

  const onSelectCard = (card: number) => {
    setSelectedCard(card);
    if (room) upsertEstimate(room, name, card);
  };

  return (
    <main>
      <section>
        <h1>Room - {room?.topic}</h1>
        <label>Enter your name:</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </section>

      <section>
        <Cards selectedCard={selectedCard} onSelectCard={onSelectCard} />
      </section>

      <section className="estimates">
        <h2>Estimates</h2>
        {estimates.map((estimate) => (
          <Estimate
            key={estimate._id.toHexString()}
            name={estimate.name}
            estimate={estimate.estimate}
          />
        ))}
      </section>
    </main>
  );
}

function Estimate(props: { name: string; estimate: number }) {
  const { name, estimate } = props;

  return (
    <div className="estimate">
      <p>{name}</p>
      <p>{estimate}</p>
    </div>
  );
}
