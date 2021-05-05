import { useParams } from "react-router";
import { useEstimateHooks } from "../../mongodb/setup";
import { useState } from "react";
import Cards from "./cards/Cards";
import "./Estimates.css";

export default function Estimates() {
  const { id } = useParams();
  const [selectedCard, setSelectedCard] = useState(-1);
  const [name, setName] = useState("");
  const { room, estimates, createOrUpdateEstimate } = useEstimateHooks(id);

  const onSelectCard = (card) => {
    setSelectedCard(card);
    if (room) createOrUpdateEstimate(room, name, card);
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

function Estimate(props) {
  const { name, estimate } = props;

  return (
    <div className="estimate">
      <p>{name}</p>
      <p>{estimate}</p>
    </div>
  );
}
