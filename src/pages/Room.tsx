import {useParams} from "react-router";
import {useRoom} from "../mongodb/setup";
import { estimate } from "../mongodb/types";
import "./Room.css";

function Estimate(props: {estimate: estimate}) {
    const {estimate} = props;

    return <div className="estimate">
        <p>{estimate.name}</p>
        <h2>{estimate.estimate}</h2>
    </div>
}

export default function Room() {
    const {id} =useParams<{id: string}>();
    const {room, estimates} = useRoom(id);

    return (
        <main>
            <h1>Room - {room?.topic}</h1>
            <div className="cards">
                {[...estimates, ...estimates, ...estimates].map(estimate => (<Estimate estimate={estimate} key={estimate._id.toHexString()} />))}
            </div>
        </main>
    );
}
