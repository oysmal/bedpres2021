import "./Cards.css";

const cards = [1, 3, 5, 8, 13, 20, 40, 60];

export default function Cards(props) {
  const { onSelectCard, selectedCard } = props;

  return (
    <div className="cards">
      {cards.map((card) => {
        let className = "card";
        if (card === selectedCard) className += " selected-card";

        return (
          <div
            key={card}
            className={className}
            onClick={() => onSelectCard(card)}
          >
            <h2>{card}</h2>
          </div>
        );
      })}
    </div>
  );
}
